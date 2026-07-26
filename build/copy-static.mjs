import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()
const publicDirectory = resolve(root, 'public')

await rm(resolve(root, 'dist'), { recursive: true, force: true })
await rm(resolve(publicDirectory, 'assets'), { recursive: true, force: true })
await rm(resolve(publicDirectory, 'icons'), { recursive: true, force: true })
await mkdir(resolve(publicDirectory, 'assets'), { recursive: true })
await cp(resolve(root, 'assets', 'audio'), resolve(publicDirectory, 'assets', 'audio'), { recursive: true })
await cp(resolve(root, 'assets', 'lesson-images'), resolve(publicDirectory, 'assets', 'lesson-images'), { recursive: true })
await cp(resolve(root, 'assets', 'lesson-videos'), resolve(publicDirectory, 'assets', 'lesson-videos'), { recursive: true })
await cp(resolve(root, 'assets', 'icons'), resolve(publicDirectory, 'icons'), { recursive: true })
