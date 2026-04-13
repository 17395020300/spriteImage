<script setup lang="ts">
import { NCard, NText, NTag, NButton } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useSpriteStore } from '@/store/sprite'
import { computed } from 'vue'


const store = useSpriteStore()
const { spriteDataUrl, packResult, spriteFormat } = storeToRefs(store)

const sizeText = computed(() => {
  const pr = packResult.value
  if (!pr) return ''
  return `${pr.spriteWidth} × ${pr.spriteHeight}px`
})
</script>

<template>
  <NCard title="雪碧图预览" class="rounded-xl shadow-sm">
    <template #header-extra>
      <NSpace>
        <NSelect
          v-model:value="spriteFormat"
          :options="[
            { label: 'PNG', value: 'image/png' },
            { label: 'WebP', value: 'image/webp' }
          ]"
          size="small"
          style="width: 100px"
        />
        <NButton type="primary" secondary size="small" :disabled="!spriteDataUrl" @click="store.downloadSprite()">
          下载雪碧图
        </NButton>
      </NSpace>
    </template>
    <div
      class="sprite-preview-canvas h-fit flex items-center justify-center rounded-lg overflow-auto w-fit"
      :class="{ 'w-full !h-[200px]': !spriteDataUrl }"
    >
      <img
        v-if="spriteDataUrl"
        :src="spriteDataUrl"
        alt="sprite"
        class="max-w-full h-auto block shadow border border-gray-200 dark:border-gray-600"
      >
      <div v-else class="w-full h-full flex items-center justify-center">
        <NText depth="3">
        上传图片后将在此生成合并预览
      </NText>
      </div>
    </div>
    <div v-if="sizeText" class="flex justify-center mt-2">
      <NTag size="small" type="success" bordered>
        {{ sizeText }}
      </NTag>
    </div>
  </NCard>
</template>

<style scoped>
/* 透明区域示意：浅灰/白棋盘格（与图形软件中的透明度网格一致） */
.sprite-preview-canvas {
  background-color: #fff;
  background-image: repeating-conic-gradient(
    #e8e8e8 0% 25%,
    #fff 0% 50%
  );
  background-size: 16px 16px;
  background-position: 0 0;
}

.dark .sprite-preview-canvas {
  background-color: #1f1f1f;
  background-image: repeating-conic-gradient(#2d2d2d 0% 25%, #1f1f1f 0% 50%);
}
</style>
