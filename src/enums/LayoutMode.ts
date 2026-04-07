export const LayoutMode = {
  BinaryTree: 'binaryTree',
  Diagonal: 'diagonal',
  DiagonalAlt: 'diagonalAlt',
  Row: 'row',
  Column: 'column',
} as const

export type LayoutMode = (typeof LayoutMode)[keyof typeof LayoutMode]

export const layoutModeOptions: { label: string; value: LayoutMode }[] = [
  { label: 'Binary Tree（紧凑装箱）', value: LayoutMode.BinaryTree },
  { label: 'Diagonal（对角阶梯）', value: LayoutMode.Diagonal },
  { label: 'Diagonal Alt（镜像对角）', value: LayoutMode.DiagonalAlt },
  { label: '左右布局（单行）', value: LayoutMode.Row },
  { label: '上下布局（单列）', value: LayoutMode.Column },
]
