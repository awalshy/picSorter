/* eslint-disable unicorn/prefer-node-protocol */
import {rename, access, mkdir} from 'fs/promises'
import {getPath} from './get-path'
import type {StringArrayTag} from 'exifreader'

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

export function isValidDate(date: Date) {
  return date instanceof Date && !Number.isNaN(date.getTime())
}

export function isMeme(name: string): boolean {
  return name.includes('FB_IMG')
}

export function isScreenshot(name: string): boolean {
  return name.includes('Screenshot_')
}

export function renameFolder(name: string, getMonth: boolean): string | undefined {
  const splited = name.split('_')
  if (splited.length < 2)
    return
  const monthNumber = Number(splited[0])
  if (monthNumber === 0 && getMonth) return
  if (monthNumber === 0) return splited[1]
  if (monthNumber < 1 || monthNumber > 12 || Number.isNaN(monthNumber)) return
  const month = months[monthNumber - 1]
  if (getMonth) return month
  const eventName = splited[1]
  return `${month}/${eventName}`
}

export async function moveFile(name: string, srcFolder: string, destFolder: string, d: StringArrayTag | undefined): Promise<void> {
  // Check if folder exists
  if (!d) {
    try {
      await access(getPath(destFolder, 'no_date'))
    } catch {
      await mkdir(getPath(destFolder, 'no_date'))
    }

    await rename(getPath(srcFolder, name), getPath(destFolder, 'no_date', name))
    return
  }

  if (isMeme(name)) {
    try {
      await access(getPath(destFolder, 'memes'))
    } catch {
      await mkdir(getPath(destFolder, 'memes'))
    }

    await rename(getPath(srcFolder, name), getPath(destFolder, 'memes', name))
    return
  }

  let date = new Date(d.value[0])
  // If date is invalid, change string
  if (!isValidDate(date)) {
    console.log('NaN so importing other way date')
    const splitedDateTime = d.value[0].split(' ')
    const splitedDate = splitedDateTime[0].replace(/:/gm, '/')
    const reassembledDate = [splitedDate, splitedDateTime[1]].join(' ')
    date = new Date(reassembledDate)
  }

  // Year
  const yearFolderName = date.getFullYear().toString()
  const yearFolderPath = getPath(destFolder, yearFolderName)
  try {
    await access(yearFolderPath)
  } catch {
    await mkdir(yearFolderPath)
  }

  // Month
  const monthFolderName = months[date.getMonth()]
  const monthFolderPath = getPath(yearFolderPath, monthFolderName)
  try {
    await access(monthFolderPath)
  } catch {
    await mkdir(monthFolderPath)
  }

  // Day
  const dayFolderName = date.getDate().toString()
  const dayFolderPath = getPath(monthFolderPath, dayFolderName)
  try {
    await access(dayFolderPath)
  } catch {
    await mkdir(dayFolderPath)
  }

  // Move file
  await rename(getPath(srcFolder, name), getPath(dayFolderPath, name))
}
