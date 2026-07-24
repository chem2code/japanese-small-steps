import { cp, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()
const client = resolve(root, 'dist', 'client')

await mkdir(resolve(client, 'assets'), { recursive: true })
await cp(resolve(root, 'assets', 'audio'), resolve(client, 'assets', 'audio'), { recursive: true })
await cp(resolve(root, 'assets', 'lesson-images'), resolve(client, 'assets', 'lesson-images'), { recursive: true })
await cp(resolve(root, 'assets', 'icons'), resolve(client, 'icons'), { recursive: true })
