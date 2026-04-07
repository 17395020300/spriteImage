import { LayoutMode, type LayoutMode as LayoutModeValue } from '@/enums/LayoutMode'

/** 参与装箱的单帧（占位步进 = w/h + globalGap） */
export interface PackFrame {
  id: string
  w: number
  h: number
}

export interface FramePlacement {
  id: string
  x: number
  y: number
  w: number
  h: number
}

export interface PackResult {
  spriteWidth: number
  spriteHeight: number
  placements: FramePlacement[]
}

const effStrideX = (f: PackFrame, globalGap: number) => f.w + globalGap
const effStrideY = (f: PackFrame, globalGap: number) => f.h + globalGap

function emptyPack(): PackResult {
  return { spriteWidth: 0, spriteHeight: 0, placements: [] }
}

/** 单行从左到右 */
export function packRow(frames: PackFrame[], globalGap: number): PackResult {
  if (frames.length === 0) return emptyPack()
  let x = 0
  let maxH = 0
  const placements: FramePlacement[] = []
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i]
    placements.push({ id: f.id, x, y: 0, w: f.w, h: f.h })
    maxH = Math.max(maxH, f.h)
    const spacing = i < frames.length - 1 ? effStrideX(f, globalGap) - f.w : 0
    x += f.w + spacing
  }
  return { spriteWidth: x, spriteHeight: maxH, placements }
}

/** 单列从上到下 */
export function packColumn(frames: PackFrame[], globalGap: number): PackResult {
  if (frames.length === 0) return emptyPack()
  let y = 0
  let maxW = 0
  const placements: FramePlacement[] = []
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i]
    placements.push({ id: f.id, x: 0, y, w: f.w, h: f.h })
    maxW = Math.max(maxW, f.w)
    const spacing = i < frames.length - 1 ? effStrideY(f, globalGap) - f.h : 0
    y += f.h + spacing
  }
  return { spriteWidth: maxW, spriteHeight: y, placements }
}

/** 对角阶梯：x、y 同步累加 */
export function packDiagonal(frames: PackFrame[], globalGap: number): PackResult {
  if (frames.length === 0) return emptyPack()
  let x = 0
  let y = 0
  let maxR = 0
  let maxB = 0
  const placements: FramePlacement[] = []
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i]
    placements.push({ id: f.id, x, y, w: f.w, h: f.h })
    maxR = Math.max(maxR, x + f.w)
    maxB = Math.max(maxB, y + f.h)
    if (i < frames.length - 1) {
      x += effStrideX(f, globalGap)
      y += effStrideY(f, globalGap)
    }
  }
  return { spriteWidth: maxR, spriteHeight: maxB, placements }
}

/** 镜像对角：先算左→右对角，再水平镜像 */
export function packDiagonalAlt(frames: PackFrame[], globalGap: number): PackResult {
  const base = packDiagonal(frames, globalGap)
  if (base.placements.length === 0) return base
  const maxR = Math.max(...base.placements.map((p) => p.x + p.w))
  const placements = base.placements.map((p) => ({
    ...p,
    x: maxR - p.x - p.w,
  }))
  return { ...base, placements }
}

interface BTreeNode {
  x: number
  y: number
  w: number
  h: number
  used: boolean
  down?: BTreeNode
  right?: BTreeNode
}

function findNode(root: BTreeNode, w: number, h: number): BTreeNode | null {
  if (root.used) {
    const r = root.right ? findNode(root.right, w, h) : null
    if (r) return r
    return root.down ? findNode(root.down, w, h) : null
  }
  if (w <= root.w && h <= root.h) return root
  return null
}

function splitNode(node: BTreeNode, w: number, h: number): BTreeNode {
  node.used = true
  node.down = {
    x: node.x,
    y: node.y + h,
    w: node.w,
    h: node.h - h,
    used: false,
  }
  node.right = {
    x: node.x + w,
    y: node.y,
    w: node.w - w,
    h,
    used: false,
  }
  return node
}

function growRight(root: BTreeNode, w: number, h: number): { root: BTreeNode; fit: BTreeNode } {
  const next: BTreeNode = {
    x: 0,
    y: 0,
    w: root.w + w,
    h: root.h,
    used: true,
    down: root,
    right: { x: root.w, y: 0, w, h: root.h, used: false },
  }
  const node = findNode(next, w, h)
  if (!node) throw new Error('growRight: no space')
  return { root: next, fit: splitNode(node, w, h) }
}

function growDown(root: BTreeNode, w: number, h: number): { root: BTreeNode; fit: BTreeNode } {
  const next: BTreeNode = {
    x: 0,
    y: 0,
    w: root.w,
    h: root.h + h,
    used: true,
    down: { x: 0, y: root.h, w: root.w, h, used: false },
    right: root,
  }
  const node = findNode(next, w, h)
  if (!node) throw new Error('growDown: no space')
  return { root: next, fit: splitNode(node, w, h) }
}

function growNode(root: BTreeNode, w: number, h: number): { root: BTreeNode; fit: BTreeNode } {
  const canGrowDown = w <= root.w
  const canGrowRight = h <= root.h
  const shouldGrowRight = canGrowRight && root.h >= root.w + w
  const shouldGrowDown = canGrowDown && root.w >= root.h + h
  if (shouldGrowRight) return growRight(root, w, h)
  if (shouldGrowDown) return growDown(root, w, h)
  if (canGrowRight) return growRight(root, w, h)
  if (canGrowDown) return growDown(root, w, h)
  return growRight(root, w, h)
}

/**
 * Growing Binary Tree（Jake Gordon 思路）：按 effW×effH 装箱，贴图仍用原始 w×h。
 */
export function packBinaryTree(frames: PackFrame[], globalGap: number): PackResult {
  if (frames.length === 0) return emptyPack()

  const blocks = frames.map((f) => ({
    frame: f,
    pw: effStrideX(f, globalGap),
    ph: effStrideY(f, globalGap),
  }))

  blocks.sort((a, b) => Math.max(b.pw, b.ph) - Math.max(a.pw, a.ph))

  const first = blocks[0]
  let root: BTreeNode = {
    x: 0,
    y: 0,
    w: first.pw,
    h: first.ph,
    used: false,
  }

  const idToPlacement = new Map<string, FramePlacement>()

  for (const { frame: f, pw, ph } of blocks) {
    let node = findNode(root, pw, ph)
    if (node) {
      splitNode(node, pw, ph)
      idToPlacement.set(f.id, { id: f.id, x: node.x, y: node.y, w: f.w, h: f.h })
    } else {
      const grown = growNode(root, pw, ph)
      root = grown.root
      const n = grown.fit
      idToPlacement.set(f.id, { id: f.id, x: n.x, y: n.y, w: f.w, h: f.h })
    }
  }

  const placements = frames.map((f) => {
    const p = idToPlacement.get(f.id)
    if (!p) throw new Error(`Missing placement for ${f.id}`)
    return p
  })

  let spriteWidth = 0
  let spriteHeight = 0
  for (const p of placements) {
    spriteWidth = Math.max(spriteWidth, p.x + p.w)
    spriteHeight = Math.max(spriteHeight, p.y + p.h)
  }

  return {
    spriteWidth,
    spriteHeight,
    placements,
  }
}

export function packSprites(
  mode: LayoutModeValue,
  frames: PackFrame[],
  globalGap: number,
): PackResult {
  switch (mode) {
    case LayoutMode.Row:
      return packRow(frames, globalGap)
    case LayoutMode.Column:
      return packColumn(frames, globalGap)
    case LayoutMode.Diagonal:
      return packDiagonal(frames, globalGap)
    case LayoutMode.DiagonalAlt:
      return packDiagonalAlt(frames, globalGap)
    case LayoutMode.BinaryTree:
    default:
      return packBinaryTree(frames, globalGap)
  }
}
