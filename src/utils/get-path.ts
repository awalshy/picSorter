export function getPath(basePath: string, ...paths: string[]): string {
  let fullPath = basePath
  for (const path of paths)
    fullPath += `/${path}`
  return fullPath
}
