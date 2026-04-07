<script setup lang="ts">
import {
  NList,
  NListItem,
  NThing,
  NButton,
  NText,
  NEmpty,
  NInput,
} from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useSpriteStore } from '@/store/sprite'
import { useCopyText } from '@/hooks/useCopyText'
import { useMessage } from 'naive-ui'
import { buildRuleForFrameAtIndex } from '@/utils/cssSprites'
import { computed } from 'vue'

const store = useSpriteStore()
const { frames, placementById, spriteUrlInCss, styleOutputKind, classNamePattern, customClassPrefix, cssUnit, remBase } =
  storeToRefs(store)

const message = useMessage()
const { copyText } = useCopyText()

const hasFrames = computed(() => frames.value.length > 0)

async function copyStyle(frameId: string, index: number) {
  const f = frames.value.find((x) => x.id === frameId)
  const p = placementById.value.get(frameId)
  if (!f || !p) return
  const text = buildRuleForFrameAtIndex(
    { id: f.id, fileName: f.name, index },
    index,
    p,
    {
      spriteUrl: spriteUrlInCss.value,
      kind: styleOutputKind.value,
      classPattern: classNamePattern.value,
      customPrefix: customClassPrefix.value,
      unit: cssUnit.value,
      remBase: remBase.value,
    },
  )
  const ok = await copyText(text)
  if (ok) message.success('已复制该帧样式')
  else message.error('复制失败')
}
</script>

<template>
  <div class="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-#18181c min-h-120px">
    <NText strong class="block mb-3">
      帧列表（可改名称、删除、复制样式）
    </NText>
    <NEmpty v-if="!hasFrames" description="暂无图片" class="py-8" />
    <NList v-else bordered>
      <NListItem v-for="(f, index) in frames" :key="f.id">
        <template #prefix>
          <img
            :src="f.objectUrl"
            alt=""
            class="w-12 h-12 object-contain rounded border border-gray-100 dark:border-gray-700"
          >
        </template>
        <NThing :description="`${f.width} × ${f.height}px`" description-class="text-xs text-gray-500">
          <template #header>
            <NInput
              size="small"
              :value="f.name"
              placeholder="帧名称"
              class="max-w-sm"
              @update:value="(v) => store.setFrameName(f.id, v)"
              @blur="store.finalizeFrameName(f.id)"
            />
          </template>
          <template #header-extra>
            <div  class="ml-2.5 flex items-center">
              <NButton size="small" type="success" @click="copyStyle(f.id, index)">
                复制样式
              </NButton>
              <NButton size="small" type="error" quaternary @click="store.removeFrame(f.id)">
                删除
              </NButton>
            </div>
          </template>
        </NThing>
      </NListItem>
    </NList>
  </div>
</template>
