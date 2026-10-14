import assert from 'node:assert/strict'
import { stat } from 'node:fs/promises'
import { createServer } from 'vite'
const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { lesson7Scenes, lesson7Lines } = await server.ssrLoadModule('/src/lesson7Extension.ts')
  const text = lesson7Lines.map(([jp]) => jp.replace(/!(.*?)\((.*?)\)/g, '$1')).join('')
  const phrases = ['起きます','窓を開けます','顔を洗います','歯を磨きます','髪をとかします','服を着ます','お茶を入れます','お茶を飲みます','ご飯を食べます','タバコを吸いません','新聞を読みます','靴をはきます','ドアを閉めます','かぎをかけます','ごみを出します','会社へ行きます','切符を買います','雑誌を読みます','音楽を聞きます','メールを出します','書類を読みます','手紙を書きます','切手をはります','手紙を出します','電話をかけます','ファックスを送ります','資料を作ります','銀行へ行きます','お金を払います','車を洗います','写真を撮ります','家へ帰ります','かぎを開けます','ドアを開けます','靴を脱ぎます','服を脱ぎます','電気をつけます','テレビをつけます','テレビを見ます','料理を作ります','シャワーを浴びます','体を洗います','頭を洗います','窓を閉めます','電気を消します','寝ます']
  for (const phrase of phrases) assert(text.includes(phrase), `Missing expression: ${phrase}`)
  for (const [jp, zh] of lesson7Lines) { assert(zh.length > 0); assert(!/[一-龯]/.test(jp.replace(/!(.*?)\((.*?)\)/g, '$2')), `Missing reading: ${jp}`) }
  for (const id of [...lesson7Lines.map((_, i) => i), 'full']) assert((await stat(`assets/audio/lesson7-extension/${id}.mp3`)).size > 1000)
  console.log(JSON.stringify({ scenes: lesson7Scenes.length, passages: lesson7Lines.length, coveredExpressions: phrases.length, audioFiles: lesson7Lines.length + 1 }))
} finally { await server.close() }
