import { ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

export function useTheme() {
  const isDark = ref(usePreferredDark().value)
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  watch(isDark, (newValue) => {
    if (newValue) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, { immediate: true })

  return {
    isDark,
    toggleTheme
  }
} 