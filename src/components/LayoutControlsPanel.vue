<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NSelect,
  NInputNumber,
  NButton,
  NText,
} from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useSpriteStore } from '@/store/sprite'
import { layoutModeOptions } from '@/enums/LayoutMode'

const store = useSpriteStore()
const { layoutMode, globalGap } = storeToRefs(store)

const layoutSelectOptions = layoutModeOptions.map((o) => ({
  label: o.label,
  value: o.value,
}))
</script>

<template>
  <div class="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-#18181c">
    <NText strong class="block mb-3">
      排版与间距
    </NText>
    <NForm label-placement="left" label-width="96">
      <NFormItem label="排版方式">
        <NSelect
          v-model:value="layoutMode"
          :options="layoutSelectOptions"
          class="max-w-md"
        />
      </NFormItem>
      <NFormItem label="全局 gap">
        <NInputNumber v-model:value="globalGap" :min="0" :max="256" class="w-40" />
      </NFormItem>
      <NFormItem label=" ">
        <NButton type="default" @click="store.clearAll()">
          清空全部
        </NButton>
      </NFormItem>
    </NForm>
  </div>
</template>
