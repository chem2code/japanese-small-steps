const PROGRESS_KEY = 'hyoga-japanese-progress'
const STUDY_KEY = 'hyoga-study-v3'

interface ProgressBackup {
  version: 1
  exportedAt: string
  progress: string[]
  study: Record<string, unknown>
}

function parseStoredValue<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || '') as T
  } catch {
    return fallback
  }
}

export function downloadProgressBackup() {
  const payload: ProgressBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: parseStoredValue<string[]>(PROGRESS_KEY, []),
    study: parseStoredValue<Record<string, unknown>>(STUDY_KEY, {}),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `jstep-collections-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

export async function restoreProgressBackup(file: File) {
  const payload = JSON.parse(await file.text()) as Partial<ProgressBackup>
  if (
    payload.version !== 1
    || !Array.isArray(payload.progress)
    || !payload.progress.every((item) => typeof item === 'string')
    || !payload.study
    || typeof payload.study !== 'object'
    || Array.isArray(payload.study)
  ) {
    throw new Error('invalid-backup')
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload.progress))
  localStorage.setItem(STUDY_KEY, JSON.stringify(payload.study))
  window.location.reload()
}
