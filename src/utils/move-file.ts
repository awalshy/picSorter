/* eslint-disable unicorn/prefer-node-protocol */
import {rename, access, mkdir} from 'fs/promises'
import {getPath} from './get-path'

function isMeme(name: string): boolean {
  return name.includes('FB_IMG')
}

const months = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]

export async function moveFile(name: string, srcFolder: string, destFolder: string, date: Date): Promise<void> {
  // Check if folder exists
  if (isMeme(name)) {
    await rename(getPath(srcFolder, name), getPath(destFolder, 'memes', name))
    return
  }

  // Year
  const yearFolderName = date.getFullYear().toString()
  const yearFolderPath = getPath(destFolder, yearFolderName)
  console.log('YEAR FOLDER', yearFolderPath)
  try {
    await access(yearFolderPath)
  } catch {
    await mkdir(yearFolderPath)
  }

  // Month
  const monthFolderName = months[date.getMonth()]
  const monthFolderPath = getPath(yearFolderPath, monthFolderName)
  console.log('MONTH FOLDER PATH', monthFolderPath)
  try {
    await access(monthFolderPath)
  } catch {
    await mkdir(monthFolderPath)
  }

  // Day
  const dayFolderName = date.getDate().toString()
  const dayFolderPath = getPath(monthFolderPath, dayFolderName)
  console.log('DAY FOLDER PATH', dayFolderPath)
  try {
    await access(dayFolderPath)
  } catch {
    await mkdir(dayFolderPath)
  }

  console.log('FROM', getPath(srcFolder, name), 'to', getPath(dayFolderPath, name))
  // Move file
  await rename(getPath(srcFolder, name), getPath(dayFolderPath, name))
}
