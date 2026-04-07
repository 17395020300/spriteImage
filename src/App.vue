<script setup lang="ts">
import { NConfigProvider, NMessageProvider, zhCN, dateZhCN } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import css from 'highlight.js/lib/languages/css'

hljs.registerLanguage('css', css)
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :hljs="hljs">
    <NMessageProvider>
      <router-view />
    </NMessageProvider>
  </NConfigProvider>
</template>
