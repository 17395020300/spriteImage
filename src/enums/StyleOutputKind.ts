/** CSS 声明写法 */
export const StyleOutputKind = {
  BackgroundShorthand: 'backgroundShorthand',
  BackgroundLonghand: 'backgroundLonghand',
} as const

export type StyleOutputKind = (typeof StyleOutputKind)[keyof typeof StyleOutputKind]

export const styleOutputOptions: { label: string; value: StyleOutputKind }[] = [
  { label: 'background 简写', value: StyleOutputKind.BackgroundShorthand },
  { label: 'background 拆分（image/position/repeat）', value: StyleOutputKind.BackgroundLonghand },
]
