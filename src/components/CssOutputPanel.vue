<script setup lang="ts">
import {
  NCard,
  NCode,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NButton,
  NSpace,
  useMessage,
} from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useSpriteStore } from '@/store/sprite'
import { styleOutputOptions } from '@/enums/StyleOutputKind'
import { ClassNamePattern, classNamePatternOptions } from '@/enums/ClassNamePattern'
import { useCopyText } from '@/hooks/useCopyText'
import { cssToJsonString } from '@/utils/cssToJsonString'
import { buildViteNanaSpriteConfigString } from '@/utils/viteNanaSpriteConfigString'
import { computed } from 'vue'

const store = useSpriteStore()
const {
  fullCss,
  frames,
  placementById,
  spriteUrlInCss,
  styleOutputKind,
  classNamePattern,
  customClassPrefix,
  cssUnit,
  remBase,
} = storeToRefs(store)

const message = useMessage()
const { copyText } = useCopyText()

const styleOptions = styleOutputOptions
const classOptions = classNamePatternOptions

const unitOptions = [
  { label: 'px', value: 'px' },
  { label: 'rem', value: 'rem' },
]

const showRem = computed(() => cssUnit.value === 'rem')

async function copyAll() {
  const text = fullCss.value
  if (!text) {
    message.warning('没有可复制的 CSS')
    return
  }
  const ok = await copyText(text)
  if (ok) message.success('已复制全部样式')
  else message.error('复制失败')
}

const codeForHighlight = computed(() =>
  fullCss.value.trim() ? fullCss.value : '/* 生成后的 CSS 将显示在这里 */',
)

async function copyCssAsJson() {
  const text = fullCss.value
  if (!text) {
    message.warning('没有可复制的 CSS')
    return
  }
  try {
    const json = cssToJsonString(text)
    const ok = await copyText(json)
    if (ok) message.success('已复制 CSS JSON')
    else message.error('复制失败')
  } catch {
    message.error('CSS 解析失败')
  }
}

async function copyViteNanaSpriteConfig() {
  if (frames.value.length === 0) {
    message.warning('请先添加图片帧')
    return
  }
  const text = buildViteNanaSpriteConfigString(
    frames.value.map((f) => ({ id: f.id, name: f.name })),
    placementById.value,
    spriteUrlInCss.value,
  )
  const ok = await copyText(text)
  if (ok) message.success('已复制 vite-nanaSprite 配置')
  else message.error('复制失败')
}
</script>

<template>
  <NCard title="CSS 代码" class="rounded-xl shadow-sm">
    <NForm label-placement="top" class="mb-3">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <NFormItem label="样式图中 URL / 文件名">
          <NInput v-model:value="spriteUrlInCss" placeholder="css_sprites.png" />
        </NFormItem>
        <NFormItem label="样式类型">
          <NSelect v-model:value="styleOutputKind" :options="styleOptions" />
        </NFormItem>
        <NFormItem label="类名规则">
          <NSelect v-model:value="classNamePattern" :options="classOptions" />
        </NFormItem>
        <NFormItem v-if="classNamePattern === ClassNamePattern.CustomPrefix" label="自定义前缀">
          <NInput v-model:value="customClassPrefix" placeholder="icon" />
        </NFormItem>
        <NFormItem label="单位">
          <NSelect v-model:value="cssUnit" :options="unitOptions" />
        </NFormItem>
        <NFormItem v-if="showRem" label="rem 基准（px）">
          <NInputNumber v-model:value="remBase" :min="1" :max="128" class="w-full" />
        </NFormItem>
      </div>
    </NForm>
    <NSpace class="mb-2">
      <NButton type="primary" @click="copyAll">
        一键复制 CSS
      </NButton>
      <NButton secondary @click="copyCssAsJson">
        一键复制 CSS JSON
      </NButton>
      <NButton secondary @click="copyViteNanaSpriteConfig">
        一键复制 vite-nanaSprite 配置
      </NButton>
    </NSpace>
    <div
      class="rounded-lg border border-solid border-[var(--n-border-color)] min-h-[12rem] max-h-[28rem] overflow-auto p-4"
    >
      <NCode
        :code="codeForHighlight"
        language="css"
        word-wrap
        show-line-numbers
        :trim="false"
        class="text-sm"
      />
    </div>
  </NCard>
</template>
