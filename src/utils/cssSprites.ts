import type { FramePlacement } from '@/utils/packSprite'
import { ClassNamePattern } from '@/enums/ClassNamePattern'
import { StyleOutputKind } from '@/enums/StyleOutputKind'

export function sanitizeClassBase(name: string): string {
  const base = name.replace(/\.[^/.]+$/, '')
  const s = base.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^-+/, '')
  return s || 'frame'
}

function toCssNumber(px: number, unit: 'px' | 'rem', remBase: number): string {
  if (unit === 'rem') {
    const v = px / remBase
    const rounded = Math.round(v * 1000) / 1000
    return `${rounded}rem`
  }
  return `${Math.round(px)}px`
}

export function buildClassName(
  pattern: ClassNamePattern,
  fileName: string,
  index: number,
  customPrefix: string,
): string {
  const safe = sanitizeClassBase(fileName)
  switch (pattern) {
    case ClassNamePattern.Index:
      return `sprite-${index}`
    case ClassNamePattern.CustomPrefix: {
      const p = sanitizeClassBase(customPrefix || 'icon')
      return `${p}_${safe}`
    }
    case ClassNamePattern.BgPrefix:
    default:
      return `bg-${safe}`
  }
}

export interface CssFrameInput {
  id: string
  fileName: string
  index: number
}

export function generateRuleForPlacement(
  className: string,
  placement: FramePlacement,
  spriteUrl: string,
  kind: StyleOutputKind,
  unit: 'px' | 'rem',
  remBase: number,
): string {
  const w = toCssNumber(placement.w, unit, remBase)
  const h = toCssNumber(placement.h, unit, remBase)
  const bx = toCssNumber(-placement.x, unit, remBase)
  const by = toCssNumber(-placement.y, unit, remBase)
  const url = JSON.stringify(spriteUrl)

  if (kind === StyleOutputKind.BackgroundLonghand) {
    return `.${className} {\n    width: ${w}; height: ${h};\n    background-image: url(${url});\n    background-position: ${bx} ${by};\n    background-repeat: no-repeat;\n}`
  }

  return `.${className} {\n    width: ${w}; height: ${h};\n    background: url(${url}) ${bx} ${by};\n}`
}

export function buildFullStylesheet(
  framesOrdered: CssFrameInput[],
  placementById: Map<string, FramePlacement>,
  options: {
    spriteUrl: string
    kind: StyleOutputKind
    classPattern: ClassNamePattern
    customPrefix: string
    unit: 'px' | 'rem'
    remBase: number
  },
): string {
  const parts: string[] = []
  for (let i = 0; i < framesOrdered.length; i++) {
    const f = framesOrdered[i]
    const p = placementById.get(f.id)
    if (!p) continue
    const cls = buildClassName(options.classPattern, f.fileName, i, options.customPrefix)
    parts.push(
      generateRuleForPlacement(
        cls,
        p,
        options.spriteUrl,
        options.kind,
        options.unit,
        options.remBase,
      ),
    )
  }
  return parts.join('\n\n')
}

export function buildRuleForFrameAtIndex(
  frame: CssFrameInput,
  index: number,
  placement: FramePlacement,
  options: {
    spriteUrl: string
    kind: StyleOutputKind
    classPattern: ClassNamePattern
    customPrefix: string
    unit: 'px' | 'rem'
    remBase: number
  },
): string {
  const cls = buildClassName(options.classPattern, frame.fileName, index, options.customPrefix)
  return generateRuleForPlacement(
    cls,
    placement,
    options.spriteUrl,
    options.kind,
    options.unit,
    options.remBase,
  )
}
