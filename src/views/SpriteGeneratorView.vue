<script setup lang="ts">
import AppLayout from '@/layout/AppLayout.vue'
import FrameUploadPanel from '@/components/FrameUploadPanel.vue'
import FrameListPanel from '@/components/FrameListPanel.vue'
import LayoutControlsPanel from '@/components/LayoutControlsPanel.vue'
import SpritePreviewPanel from '@/components/SpritePreviewPanel.vue'
import CssOutputPanel from '@/components/CssOutputPanel.vue'
</script>

<template>
  <AppLayout>
    <div class="flex flex-col gap-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-4 flex flex-col gap-6">
          <FrameUploadPanel />
          <LayoutControlsPanel />
          <FrameListPanel />
        </div>
        <div class="lg:col-span-8 flex flex-col gap-6">
          <SpritePreviewPanel />
          <CssOutputPanel />
        </div>
      </div>
    </div>
  </AppLayout>
</template>
