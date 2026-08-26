import { execFile } from 'node:child_process'
import { mkdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { promisify } from 'node:util'
import path from 'node:path'
import Papa from 'papaparse'
import YAML from 'yaml'

const execFileAsync = promisify(execFile)
const root = process.cwd()
const outputDir = path.join(root, 'assets', 'audio', 'grammar-examples')
const lessons = YAML.parse(await readFile(path.join(root, '_data', 'lessons.yml'), 'utf8'))
const grammar = Papa.parse(await readFile(path.join(root, '_data', 'grammar.csv'), 'utf8'), {
  header: true,
  skipEmptyLines: true,
  transform: (value) => value.trim(),
}).data.filter((item) => /^\d{3}$/.test(item.lesson))

const ignoredAnchors = new Set(['否定', '确认', '转折', '铺垫', '疑问', '关联', '属性', '从属机构', '国家'])
const plainJapanese = (source = '') => source
  .replace(/!(.*?)\((.*?)\)/g, '$1')
  .replace(/@[\d]{0,2}/g, '')
  .replace(/[>*#\n]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
const cleanLine = (value = '') => plainJapanese(value)
  .replace(/^[Ａ-ＺA-Z]\s*[甲乙]?[：:]?\s*/, '')
  .replace(/^[甲乙][：:]\s*/, '')
  .trim()
const sourceLines = (source = '') => source.split(/\r?\n/).map(cleanLine).filter((line) => line.length > 2 && !/^[-–—]+$/.test(line))
const anchorsFor = (expression) => Array.from(new Set(
  cleanLine(expression)
    .replace(/\[[^\]]*\]/g, '')
    .split(/[～~／/・,，。()（）]/)
    .map((item) => item.trim())
    .filter((item) => item && !ignoredAnchors.has(item))
    .filter((item) => /[ぁ-んァ-ヶ一-龠々ー]/.test(item)),
))

function exampleFor(item) {
  const lesson = lessons[`l${Number(item.lesson)}`]
  if (!lesson) return null
  const anchors = anchorsFor(item.expression)
  if (!anchors.length) return null
  const sections = [lesson.basic4, [lesson.basicc, lesson.context].filter(Boolean).join('\n')]
  let best
  for (const source of sections) {
    for (const sentence of sourceLines(source)) {
      const score = anchors.filter((anchor) => sentence.includes(anchor)).reduce((sum, anchor) => sum + Math.max(anchor.length, 1), 0)
      if (score > 0 && (!best || score > best.score)) best = { sentence, score }
    }
  }
  return best?.sentence || null
}

await mkdir(outputDir, { recursive: true })
const jobs = grammar.map((item) => ({ item, sentence: exampleFor(item) })).filter((job) => job.sentence)
let completed = 0

async function worker(queue) {
  while (queue.length) {
    const { item, sentence } = queue.shift()
    const target = path.join(outputDir, `g${item.idx}.mp3`)
    if (!existsSync(target)) {
      await execFileAsync('edge-tts', [
        '--voice', 'ja-JP-NanamiNeural',
        '--rate=-5%',
        '--text', sentence,
        '--write-media', target,
      ])
    }
    completed += 1
    if (completed % 25 === 0 || completed === jobs.length) console.log(`Generated ${completed}/${jobs.length}`)
  }
}

const queue = [...jobs]
await Promise.all(Array.from({ length: 4 }, () => worker(queue)))
console.log(`Grammar example audio ready: ${jobs.length} files`)
