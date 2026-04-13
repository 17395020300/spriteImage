import { defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'
import { LayoutMode } from '@/enums/LayoutMode'
import { StyleOutputKind } from '@/enums/StyleOutputKind'
import { ClassNamePattern } from '@/enums/ClassNamePattern'
import { packSprites } from '@/utils/packSprite'
import type { FramePlacement, PackResult } from '@/utils/packSprite'
import { buildFullStylesheet } from '@/utils/cssSprites'
import { renderSpriteDataUrl } from '@/utils/renderSpriteCanvas'
import { readImageNaturalSize } from '@/hooks/useImageFileMeta'

export interface SpriteFrame {
  id: string
  file: File
  name: string
  objectUrl: string
  width: number
  height: number
}

function newId() {
  return crypto.randomUUID()
}

/** 将「文件名」拆成主名与扩展名（无点或点在首位时视为无扩展名） */
function splitFileName(fileName: string): { stem: string; ext: string } {
  const lastDot = fileName.lastIndexOf('.')
  if (lastDot <= 0) return { stem: fileName, ext: '' }
  return { stem: fileName.slice(0, lastDot), ext: fileName.slice(lastDot) }
}

/** 若 original 已在 used 中，则依次尝试 stem_1.ext、stem_2.ext … 直到唯一 */
function uniqueNameWithIndex(original: string, used: Set<string>): string {
  if (!used.has(original)) {
    used.add(original)
    return original
  }
  const { stem, ext } = splitFileName(original)
  let i = 1
  while (true) {
    const candidate = ext ? `${stem}_${i}${ext}` : `${stem}_${i}`
    if (!used.has(candidate)) {
      used.add(candidate)
      return candidate
    }
    i++
  }
}

export const useSpriteStore = defineStore('sprite', () => {
  const frames = shallowRef<SpriteFrame[]>([])
  const globalGap = ref(4)
  const layoutMode = ref<LayoutMode>(LayoutMode.BinaryTree)
  const spriteUrlInCss = ref('css_sprites.png')
  const styleOutputKind = ref<StyleOutputKind>(StyleOutputKind.BackgroundShorthand)
  const classNamePattern = ref<ClassNamePattern>(ClassNamePattern.BgPrefix)
  const customClassPrefix = ref('icon')
  const cssUnit = ref<'px' | 'rem'>('px')
  const remBase = ref(16)

  // 新增：雪碧图导出格式
  const spriteFormat = ref<'image/png' | 'image/webp'>('image/png')

  const spriteDataUrl = ref('')
  let renderToken = 0
  /** 串行化 addFiles，避免 NUpload 多文件并行触发 onBeforeUpload 时互相覆盖 frames */
  let addFilesQueue = Promise.resolve()

  const packFrames = computed(() =>
    frames.value.map((f) => ({
      id: f.id,
      w: f.width,
      h: f.height,
    })),
  )

  const packResult = computed<PackResult | null>(() => {
    if (frames.value.length === 0) return null
    return packSprites(layoutMode.value, packFrames.value, globalGap.value)
  })

  const placementById = computed(() => {
    const m = new Map<string, FramePlacement>()
    const pr = packResult.value
    if (!pr) return m
    for (const p of pr.placements) m.set(p.id, p)
    return m
  })

  const fullCss = computed(() => {
    const pr = packResult.value
    if (!pr || frames.value.length === 0) return ''
    const ordered = frames.value.map((f, index) => ({
      id: f.id,
      fileName: f.name,
      index,
    }))
    return buildFullStylesheet(ordered, placementById.value, {
      spriteUrl: spriteUrlInCss.value,
      kind: styleOutputKind.value,
      classPattern: classNamePattern.value,
      customPrefix: customClassPrefix.value,
      unit: cssUnit.value,
      remBase: remBase.value,
    })
  })

  async function refreshSpriteImage() {
    const pr = packResult.value
    const token = ++renderToken
    if (!pr || frames.value.length === 0) {
      spriteDataUrl.value = ''
      return
    }
    const items = frames.value.map((f) => {
      const p = placementById.value.get(f.id)
      if (!p) throw new Error('placement missing')
      return { objectUrl: f.objectUrl, placement: p }
    })
    try {
      const url = await renderSpriteDataUrl(items, pr.spriteWidth, pr.spriteHeight, spriteFormat.value)
      if (token === renderToken) spriteDataUrl.value = url
    } catch {
      if (token === renderToken) spriteDataUrl.value = ''
    }
  }

  watch(
    [frames, layoutMode, globalGap],
    () => {
      void refreshSpriteImage()
    },
    { deep: true },
  )

  function addFiles(fileList: FileList | File[]) {
    const run = async () => {
      const arr = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
      const next = [...frames.value]
      const usedNames = new Set(next.map((f) => f.name))
      for (const file of arr) {
        const objectUrl = URL.createObjectURL(file)
        try {
          const { width, height } = await readImageNaturalSize(file, objectUrl)
          const name = uniqueNameWithIndex(file.name, usedNames)
          next.push({
            id: newId(),
            file,
            name,
            objectUrl,
            width,
            height,
          })
        } catch {
          URL.revokeObjectURL(objectUrl)
        }
      }
      frames.value = next
    }
    addFilesQueue = addFilesQueue.then(run, run)
    return addFilesQueue
  }

  function setFrameName(id: string, name: string) {
    frames.value = frames.value.map((f) => {
      if (f.id !== id) return f
      return name === f.name ? f : { ...f, name }
    })
  }

  function finalizeFrameName(id: string) {
    frames.value = frames.value.map((f) => {
      if (f.id !== id) return f
      const nextName = f.name.trim() || f.file.name
      return nextName === f.name ? f : { ...f, name: nextName }
    })
  }

  function removeFrame(id: string) {
    const f = frames.value.find((x) => x.id === id)
    if (f) URL.revokeObjectURL(f.objectUrl)
    frames.value = frames.value.filter((x) => x.id !== id)
  }

  function clearAll() {
    for (const f of frames.value) URL.revokeObjectURL(f.objectUrl)
    frames.value = []
    spriteDataUrl.value = ''
  }

  async function downloadSprite(filename?: string) {
    await refreshSpriteImage()
    const url = spriteDataUrl.value
    if (!url) return
    // 自动根据格式和默认名
    let ext = spriteFormat.value === 'image/webp' ? '.webp' : '.png'
    let name = filename || `css_sprites${ext}`
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
  }

  return {
    frames,
    globalGap,
    layoutMode,
    spriteUrlInCss,
    styleOutputKind,
    classNamePattern,
    customClassPrefix,
    cssUnit,
    remBase,
    spriteDataUrl,
    packResult,
    placementById,
    fullCss,
    addFiles,
    setFrameName,
    finalizeFrameName,
    removeFrame,
    clearAll,
    spriteFormat,
    downloadSprite,
    refreshSpriteImage,
  }
})
