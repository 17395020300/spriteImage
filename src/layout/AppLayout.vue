<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-#f7f8fa dark:bg-#101014">
    <AppNavbar />
    <main class="flex-1 w-full max-w-1400px mx-auto px-4 py-6 box-border">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
