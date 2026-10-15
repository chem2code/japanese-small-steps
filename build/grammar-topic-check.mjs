import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { mkdir, stat } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
const exec = promisify(execFile)
const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { grammarTopicLessons: topics, verbModels, verbForms } = await server.ssrLoadModule('/src/grammarTopics.ts')
  assert.equal(new Set(topics.map((t) => t.id)).size, topics.length)
  for (const topic of topics) {
    assert(topic.lessons.every((id) => id >= 1 && id <= 48))
    assert(topic.rows.every((r) => r.length === topic.columns.length))
    for (const q of topic.quiz) { assert(q.choices.includes(q.answer)); assert.equal(new Set(q.choices).size, q.choices.length); assert(q.explanation.length > 10) }
    for (const [i, example] of topic.examples.entries()) {
      assert(!/[一-龯]/.test(example.jp.replace(/!(.*?)\((.*?)\)/g, '$2')), `Missing reading: ${example.jp}`)
      const file = `assets/audio/grammar-topics/${topic.id}-${i}.mp3`
      if (process.argv.includes('--generate') && !(await stat(file).then((s) => s.size > 1000).catch(() => false))) {
        await mkdir('assets/audio/grammar-topics', { recursive: true })
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            await exec('uvx', ['--from', 'edge-tts==7.3.1', 'edge-tts', '--voice', 'ja-JP-NanamiNeural', '--rate=-8%', '--text', example.jp.replace(/!(.*?)\((.*?)\)/g, '$1'), '--write-media', file], { timeout: 45000 })
            break
          } catch { if (attempt === 2) throw new Error(`Audio generation failed: ${file}`); console.log(`Retry ${file}`) }
        }
        console.log(`Generated ${topic.id}-${i}`)
      }
      assert((await stat(file)).size > 1000, `Missing audio: ${file}`)
    }
  }
  for (const v of verbModels) assert.equal(v.forms.length, verbForms.length)
  assert.equal(verbModels.find((v) => v.word.startsWith('行く')).forms[2], '行って')
  assert.equal(verbModels.find((v) => v.word.startsWith('帰る')).forms[2], '帰って')
  assert.equal(verbModels.find((v) => v.word.startsWith('買う')).forms[1], '買わない')
  assert.equal(verbModels.find((v) => v.word === 'する').forms[4], 'できる')
  console.log(JSON.stringify({ topics: topics.length, quiz: topics.reduce((sum, t) => sum + t.quiz.length, 0), examples: topics.reduce((sum, t) => sum + t.examples.length, 0), verifiedVerbForms: verbModels.length * verbForms.length }))
} finally { await server.close() }
