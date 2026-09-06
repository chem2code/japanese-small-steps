import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { grammarCatalog, grammarNotes, grammarLesson } = await server.ssrLoadModule('/src/grammarGuide.ts')
  const { beginnerLessons } = await server.ssrLoadModule('/src/data.ts')
  const { grammarExampleForLesson } = await server.ssrLoadModule('/src/grammarExamples.ts')
  const ids = new Set(grammarCatalog.map((g) => g.idx))
  assert.equal(ids.size, grammarCatalog.length, 'Grammar IDs must be unique')
  let examples = 0, recordings = 0
  for (const [id, note] of Object.entries(grammarNotes)) {
    assert(ids.has(id), `Unknown grammar ${id}`)
    assert(note.choices.includes(note.answer), `Invalid answer ${id}`)
    assert.equal(new Set(note.choices).size, note.choices.length, `Duplicate choices ${id}`)
    assert(note.connection.length && note.translation && note.reason && note.contrast, `Incomplete explanation ${id}`)
    for (const related of note.related) assert(ids.has(related), `Broken related link ${id} -> ${related}`)
  }
  for (const grammar of grammarCatalog) {
    const lesson = grammarLesson(grammar)
    assert(lesson, `Missing lesson for ${grammar.idx}`)
    const example = grammarExampleForLesson(grammar, lesson)
    if (!example) continue
    examples += 1
    if (example.audioPath) {
      assert(existsSync(`.${example.audioPath}`), `Missing recording ${example.audioPath}`)
      recordings += 1
    }
  }
  const comparison = grammarCatalog.find((g) => g.idx === '106')
  const example = grammarExampleForLesson(comparison, beginnerLessons.find((l) => l.id === 12))
  assert(example?.sentence.includes('ほど'), 'Comparison must contain the target grammar')
  assert(/ない|ありません/.test(example.sentence), 'Comparison must use a negative predicate')
  console.log(JSON.stringify({ grammar: ids.size, enriched: Object.keys(grammarNotes).length, matchedTextbookExamples: examples, mappedRecordings: recordings, comparison: example.sentence }, null, 2))
} finally { await server.close() }
