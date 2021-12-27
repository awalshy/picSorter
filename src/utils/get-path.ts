/* eslint-disable unicorn/prefer-node-protocol */
import {platform} from 'process'

export function getPath(basePath: string, ...paths: string[]): string {
  // Remove slashes on path
  let fullPath = basePath
  let lastChar = basePath[basePath.length - 1]
  if (lastChar === '/' || lastChar === '\\')
    fullPath = fullPath.slice(0, -1)
  for (const path of paths) {
    const lcIsSlash = fullPath[fullPath.length - 1] === '/' || fullPath[fullPath.length - 1] === '\\'
    const fcIsSlash = path[0] === '/' || path[0] === '\\'
    fullPath += `${lcIsSlash ? '' : '/'}${fcIsSlash ? path.slice(1) : path}`
  }

  lastChar = fullPath[fullPath.length - 1]
  if (lastChar === '/' || lastChar === '\\')
    fullPath = fullPath.slice(0, -1)
  if (platform === 'win32') {
    fullPath = fullPath.replace(/\//gm, '\\')
  } else if (platform === 'linux') {
    fullPath = fullPath.replace(/\\/gm, '/')
  }

  return fullPath
}
