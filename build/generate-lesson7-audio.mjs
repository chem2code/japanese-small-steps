import { createServer } from 'vite'
import { mkdir, stat } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
const exec = promisify(execFile)
const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { lesson7Lines } = await server.ssrLoadModule('/src/lesson7Extension.ts')
  const plain = (s) => s.replace(/!(.*?)\((.*?)\)/g, '$1')
  const lines = lesson7Lines.map(([jp]) => plain(jp))
  const jobs = [...lines.map((text, i) => [String(i), text]), ['full', lines.join('\n')]]
  const dir = 'assets/audio/lesson7-extension'
  await mkdir(dir, { recursive: true })
  for (const [id, text] of jobs) {
    const file = `${dir}/${id}.mp3`
    if (await stat(file).then((s) => s.size > 1000).catch(() => false)) continue
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await exec('uvx', ['--from', 'edge-tts==7.3.1', 'edge-tts', '--voice', 'ja-JP-NanamiNeural', '--rate=-12%', '--text', text, '--write-media', file], { timeout: 45000 })
        break
      } catch { if (attempt === 2) throw new Error(`Audio generation failed: ${id}`); console.log(`Retry ${id}`) }
    }
    if ((await stat(file)).size < 1000) throw new Error(`Invalid audio ${id}`)
    console.log(`Audio ${id} ready`)
  }
} finally { await server.close() }
