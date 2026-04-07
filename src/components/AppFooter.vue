<script setup lang="ts">
import { NLayoutFooter, NText } from 'naive-ui'
</script>

<template>
  <NLayoutFooter bordered class="!bg-white dark:!bg-#18181c py-6">
    <div class="max-w-1400px mx-auto px-4">
      <div class="flex flex-col items-center gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
        <div class="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4">
          <img
            src="@/assets/logo.png"
            alt="雪碧图生成器"
            class="h-20 w-auto shrink-0"
          >
          <div class="text-center md:text-left">
            <NText strong class="text-base block mb-1">
              雪碧图生成器
            </NText>
            <NText depth="3" class="text-sm">
              在浏览器本地合并帧图，导出雪碧图与定位 CSS。
            </NText>
          </div>
        </div>

        <div class="max-w-md text-left w-full md:max-w-lg">
          <NText depth="2" class="text-sm font-medium block mb-2">
            为什么要用雪碧图 / 精灵图？
          </NText>
          <ul class="text-sm text-[var(--n-text-color-3)] space-y-1.5 list-disc pl-4.5 m-0">
            <li>将多张小图合并为一张，显著减少 HTTP 请求与连接开销。</li>
            <li>整图可被浏览器缓存，后续只需用 CSS <code class="text-xs px-1 rounded bg-[var(--n-color-hover)]">background-position</code> 切换显示区域。</li>
            <li>适合图标集、UI 切片与逐帧动画：资源集中、管理简单。</li>
          </ul>
        </div>
      </div>
    </div>
  </NLayoutFooter>
</template>
