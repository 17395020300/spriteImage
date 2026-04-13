import type { FramePlacement } from '@/utils/packSprite'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`无法加载图片: ${src}`))
    img.src = src
  })
}


export async function renderSpriteDataUrl(
  items: { objectUrl: string; placement: FramePlacement }[],
  spriteWidth: number,
  spriteHeight: number,
  format: 'image/png' | 'image/webp' = 'image/png',
): Promise<string> {
  if (items.length === 0 || spriteWidth <= 0 || spriteHeight <= 0) {
    return ''
  }
  const canvas = document.createElement('canvas')
  canvas.width = spriteWidth
  canvas.height = spriteHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 不可用')
  ctx.clearRect(0, 0, spriteWidth, spriteHeight)
  for (const { objectUrl, placement: p } of items) {
    const img = await loadImage(objectUrl)
    ctx.drawImage(img, p.x, p.y, p.w, p.h)
  }
  return canvas.toDataURL(format)
}

export async function renderSpriteBlob(
  items: { objectUrl: string; placement: FramePlacement }[],
  spriteWidth: number,
  spriteHeight: number,
  format: 'image/png' | 'image/webp' = 'image/png',
): Promise<Blob | null> {
  const dataUrl = await renderSpriteDataUrl(items, spriteWidth, spriteHeight, format)
  if (!dataUrl) return null
  const res = await fetch(dataUrl)
  return res.blob()
}
