<script setup lang="ts">
import { NUpload, NUploadDragger, NText } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { useSpriteStore } from '@/store/sprite'

const store = useSpriteStore()

function beforeUpload(data: { file: UploadFileInfo }) {
  const f = data.file.file
  if (f && f.type.startsWith('image/')) void store.addFiles([f])
  return false
}
</script>

<template>
  <div class="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-#18181c">
    <NText strong class="block mb-3">
      上传图片
    </NText>
    <NUpload
      multiple
      directory-dnd
      :default-upload="false"
      accept="image/*"
      :show-file-list="false"
      :on-before-upload="beforeUpload"
    >
      <NUploadDragger>
        <div class="py-6 text-center">
          <NText depth="2">
            点击或拖拽图片到此处，支持批量选择
          </NText>
        </div>
      </NUploadDragger>
    </NUpload>
  </div>
</template>
