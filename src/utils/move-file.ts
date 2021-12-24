/* eslint-disable unicorn/prefer-node-protocol */
import {rename, access, mkdir} from 'fs/promises'
import {getPath} from './get-path'

export async function moveFile(name: string, srcFolder: string, destFolder: string, date: Date): Promise<void> {
  // Check if folder exists
  const folderName = date.getFullYear().toString()
  const folderPath = getPath(destFolder, folderName)
  try {
    await access(folderPath)
  } catch {
    await mkdir(folderPath)
  }

  rename(getPath(srcFolder, name), getPath(folderPath, name))
}
