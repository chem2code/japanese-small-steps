import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const serverDirectory = resolve(process.cwd(), 'dist', 'server')

// Public media belongs to Cloudflare's static asset binding, not the Worker
// bundle. Vinext currently mirrors public/ into both outputs, so remove only
// the redundant server copies after the asset manifest has been generated.
await rm(resolve(serverDirectory, 'assets'), { recursive: true, force: true })
await rm(resolve(serverDirectory, 'icons'), { recursive: true, force: true })
