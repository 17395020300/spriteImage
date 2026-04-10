import type { FramePlacement } from '@/utils/packSprite'
import { sanitizeClassBase } from '@/utils/cssSprites'

/** 生成可粘贴进 vite.config 的 path.resolve 相对路径片段 */
function spriteUrlForViteResolve(spriteUrlInCss: string): string {
  const t = spriteUrlInCss.trim()
  if (/^https?:\/\//i.test(t)) {
    const part = t.split('/').pop() ?? 'sprite.png'
    const file = decodeURIComponent(part.split('?')[0] ?? part)
    return `src/assets/${file}`
  }
  if (t.includes('/')) return t.replace(/^\.\//, '')
  return `src/assets/${t}`
}

function viteSpriteKeyFromUrl(spriteUrlInCss: string): string {
  const rel = spriteUrlForViteResolve(spriteUrlInCss)
  const base = rel.split('/').pop() ?? 'icons'
  const stem = base.replace(/\.[^/.]+$/, '') || base
  return sanitizeClassBase(stem)
}

/** 与示例一致：0 为数字，非零为带 px 的字符串 */
function formatAxisForViteConfig(v: number): string {
  const r = Math.round(v)
  return r === 0 ? '0' : `'${r}px'`
}

export function buildViteNanaSpriteConfigString(
  frames: { id: string; name: string }[],
  placementById: Map<string, FramePlacement>,
  spriteUrlInCss: string,
): string {
  const rel = spriteUrlForViteResolve(spriteUrlInCss)
  const urlLine = `path.resolve(__dirname, ${JSON.stringify(rel)})`
  const key = viteSpriteKeyFromUrl(spriteUrlInCss)

  const itemLines: string[] = []
  for (const f of frames) {
    const p = placementById.get(f.id)
    if (!p) continue
    const name = sanitizeClassBase(f.name)
    const px = formatAxisForViteConfig(-p.x)
    const py = formatAxisForViteConfig(-p.y)
    itemLines.push(
      `            { name: ${JSON.stringify(name)}, width: ${p.w}, height: ${p.h}, positionX: ${px}, positionY: ${py} },`,
    )
  }

  return [
    '[',
    '        {',
    `          url: ${urlLine},`,
    `          key: ${JSON.stringify(key)},`,
    '          items: [',
    ...itemLines,
    '          ],',
    '        },',
    '      ]',
  ].join('\n')
}
