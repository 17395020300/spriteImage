<script setup lang="ts">
import { NLayoutHeader, NSpace, NText } from 'naive-ui'
</script>

<template>
  <NLayoutHeader bordered class="sticky top-0 z-50 !bg-white dark:!bg-#18181c shadow-sm">
    <div class="max-w-1400px mx-auto px-4 h-56px flex items-center justify-between box-border">
      <NSpace align="center" :size="12">
        <div class="flex items-center gap-2">
          <img src="@/assets/logo.png" alt="logo" class="h-10">
          <NText strong class="text-lg">
            雪碧图生成器
          </NText>
        </div>
      </NSpace>

      <a
        href="https://github.com/Rupiong/nanaSprite"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 shrink-0 text-[var(--n-text-color-2)] hover:text-[var(--n-text-color-1)] transition-colors"
        aria-label="GitHub 仓库"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-5 h-5" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.74-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span class="text-sm">GitHub</span>
      </a>
    </div>
  </NLayoutHeader>
</template>
