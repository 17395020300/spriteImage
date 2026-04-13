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
    </div>
  </NLayoutHeader>
</template>
