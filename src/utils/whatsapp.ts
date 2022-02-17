import {isValidDate} from './move-file'

export function isWhatsAppPicture(name: string): boolean {
  return /IMG-\d{8}-WA\d{4}.jpg/g.test(name)
}

export function getDateWA(name: string): number | undefined {
  const baseDate = name.split('-')[1]
  if (baseDate.length !== 8 || !isWhatsAppPicture(name))
    return
  const year = baseDate.slice(0, 4)
  const month = baseDate.slice(4, 6)
  const day = baseDate.slice(6, 8)
  const date = new Date(`${year}/${month}/${day}`)
  if (isValidDate(date))
    return date.getTime()
}
