const assetBase = import.meta.env.BASE_URL || '/'

export function assetUrl(path: string) {
  const base = assetBase.endsWith('/') ? assetBase : `${assetBase}/`
  return `${base}${path.replace(/^\/+/, '')}`
}
