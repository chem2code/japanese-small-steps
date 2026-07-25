import { useCallback, useEffect, useMemo, useState } from 'react'
import { beginnerLessons } from './data'
import { wordsForLesson, type Word } from './lessonDetails'

const STUDY_KEY = 'hyoga-study-v3'

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy'

export interface ReviewState {
  dueAt: string
  intervalDays: number
  repetitions: number
  ease: number
}

interface StudyState {
  completedDays: number[]
  review: Record<string, ReviewState>
  activityDates: string[]
}

const initialState: StudyState = {
  completedDays: [],
  review: {},
  activityDates: [],
}

export const wordId = (word: Word) =>
  `${word.lesson}:${word.word || word.kanji || word.kana}:${word.desc}`

const today = () => new Date().toISOString().slice(0, 10)

function readState(): StudyState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STUDY_KEY) || '') as Partial<StudyState>
    return {
      ...initialState,
      ...parsed,
      completedDays: parsed.completedDays || [],
      review: parsed.review || {},
      activityDates: parsed.activityDates || [],
    }
  } catch {
    return initialState
  }
}

export function useStudy() {
  const [state, setState] = useState<StudyState>(readState)

  useEffect(() => {
    localStorage.setItem(STUDY_KEY, JSON.stringify(state))
  }, [state])

  const toggleLesson = useCallback((lessonId: number) => {
    setState((current) => {
      const completedDays = current.completedDays.includes(lessonId)
        ? current.completedDays.filter((item) => item !== lessonId)
        : [...current.completedDays, lessonId].sort((a, b) => a - b)
      return {
        ...current,
        completedDays,
        activityDates: Array.from(new Set([...current.activityDates, today()])),
      }
    })
  }, [])

  const gradeWord = useCallback((word: Word, grade: ReviewGrade) => {
    setState((current) => {
      const id = wordId(word)
      const previous = current.review[id] || { intervalDays: 0, repetitions: 0, ease: 2.5, dueAt: new Date().toISOString() }
      const now = Date.now()
      let intervalDays = previous.intervalDays
      let repetitions = previous.repetitions
      let ease = previous.ease
      let dueAt: string

      if (grade === 'again') {
        intervalDays = 0
        repetitions = 0
        ease = Math.max(1.3, ease - 0.2)
        dueAt = new Date(now + 10 * 60 * 1000).toISOString()
      } else {
        repetitions += 1
        if (grade === 'hard') {
          intervalDays = Math.max(1, Math.round((intervalDays || 1) * 1.2))
          ease = Math.max(1.3, ease - 0.15)
        } else if (grade === 'good') {
          intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.max(4, Math.round(intervalDays * ease))
        } else {
          intervalDays = repetitions === 1 ? 4 : Math.max(7, Math.round((intervalDays || 3) * ease * 1.3))
          ease += 0.15
        }
        dueAt = new Date(now + intervalDays * 24 * 60 * 60 * 1000).toISOString()
      }

      return {
        ...current,
        review: { ...current.review, [id]: { intervalDays, repetitions, ease, dueAt } },
        activityDates: Array.from(new Set([...current.activityDates, today()])),
      }
    })
  }, [])

  const currentLessonId =
    beginnerLessons.find((lesson) => !state.completedDays.includes(lesson.id))?.id
    ?? beginnerLessons.at(-1)?.id
    ?? 1
  const currentWords = useMemo(() => wordsForLesson(currentLessonId).slice(0, 12), [currentLessonId])
  const learnedWords = useMemo(
    () => state.completedDays
      .flatMap((lessonId) => wordsForLesson(lessonId))
      .filter((word, index, all) => all.findIndex((item) => wordId(item) === wordId(word)) === index),
    [state.completedDays],
  )
  const dueWords = useMemo(() => {
    const now = Date.now()
    const due = learnedWords.filter((word) => {
      const review = state.review[wordId(word)]
      return !review || new Date(review.dueAt).getTime() <= now
    })
    return due.length ? due : currentWords.slice(0, 8)
  }, [currentWords, learnedWords, state.review])

  const streak = useMemo(() => {
    const activity = new Set(state.activityDates)
    let count = 0
    const cursor = new Date()
    while (activity.has(cursor.toISOString().slice(0, 10))) {
      count += 1
      cursor.setDate(cursor.getDate() - 1)
    }
    return count
  }, [state.activityDates])

  return {
    ...state,
    currentLessonId,
    currentWords,
    dueWords,
    streak,
    toggleLesson,
    gradeWord,
    lessonCompleted: state.completedDays.includes(currentLessonId),
  }
}

export type StudyController = ReturnType<typeof useStudy>
