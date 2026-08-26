import Papa from 'papaparse'
import wordsSource from '../_data/words.csv?raw'
import grammarSource from '../_data/grammar.csv?raw'

export interface Word {
  kana: string
  kanji: string
  pos: string
  desc: string
  word: string
  lesson: string
}

export interface Grammar {
  idx: string
  expression: string
  shortexplain: string
  explanation: string
  lesson: string
}

const words = Papa.parse<Word>(wordsSource, {
  header: true,
  skipEmptyLines: true,
  transform: (value) => value.trim(),
}).data

export const allWords = words

const grammar = Papa.parse<Grammar>(grammarSource, {
  header: true,
  skipEmptyLines: true,
  transform: (value) => value.trim(),
}).data

export const wordsForLesson = (id: number) => {
  const key = String(id).padStart(3, '0')
  return words.filter((item) => item.lesson.includes(key))
}

export const grammarForLesson = (id: number) => {
  const key = String(id).padStart(3, '0')
  return grammar.filter((item) => item.lesson.includes(key))
}
