import { useClipboard } from '@vueuse/core'
import { ref } from 'vue'

export function useCopyText() {
  const { copy, isSupported } = useClipboard()
  const lastError = ref<string | null>(null)

  async function copyText(text: string): Promise<boolean> {
    lastError.value = null
    try {
      if (isSupported.value) {
        await copy(text)
        return true
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      }
    } catch {
      lastError.value = '复制失败'
    }
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      lastError.value = '复制失败'
      return false
    }
  }

  return { copyText, lastError, isSupported }
}
