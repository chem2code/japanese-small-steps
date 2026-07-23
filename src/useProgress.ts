import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'hyoga-japanese-progress'

export function useProgress() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[]
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  }, [completed])

  const toggle = useCallback((key: string) => {
    setCompleted((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    )
  }, [])

  return { completed, toggle }
}
