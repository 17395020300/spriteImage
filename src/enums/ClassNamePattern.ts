/** 生成类名的规则 */
export const ClassNamePattern = {
  BgPrefix: 'bgPrefix',
  Index: 'index',
  CustomPrefix: 'customPrefix',
} as const

export type ClassNamePattern = (typeof ClassNamePattern)[keyof typeof ClassNamePattern]

export const classNamePatternOptions: { label: string; value: ClassNamePattern }[] = [
  { label: 'bg-文件名', value: ClassNamePattern.BgPrefix },
  { label: 'sprite-序号', value: ClassNamePattern.Index },
  { label: '自定义前缀 + 文件名', value: ClassNamePattern.CustomPrefix },
]
