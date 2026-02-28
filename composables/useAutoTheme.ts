import { ref, watch, onMounted, onUnmounted } from 'vue'

// Utilisez un état partagé pour que tous les composants qui utilisent 
// ce composable voient la même valeur (singleton state).
const isAutoTimeEnabledShared = ref(false)
let timeCheckInterval: number | undefined

export const useAutoTheme = () => {
  const colorMode = useColorMode()
  const isAutoTimeEnabled = isAutoTimeEnabledShared

  const checkTimeAndSetTheme = () => {
    if (!isAutoTimeEnabled.value) return

    const now = new Date()
    const hours = now.getHours()

    // Light between 08:00 and 18:00 (inclusive), Dark otherwise
    if (hours >= 8 && hours <= 18) {
      if (colorMode.preference !== 'light') {
        colorMode.preference = 'light'
      }
    } else {
      if (colorMode.preference !== 'dark') {
        colorMode.preference = 'dark'
      }
    }
  }

  const loadPreference = () => {
    if (process.client) {
      const saved = localStorage.getItem('cps_theme_auto_time')
      if (saved) {
        isAutoTimeEnabled.value = saved === 'true'
      }
    }
  }

  const savePreference = (enabled: boolean) => {
    isAutoTimeEnabled.value = enabled
    if (process.client) {
      localStorage.setItem('cps_theme_auto_time', String(enabled))

      if (enabled) {
        checkTimeAndSetTheme()
      }
    }
  }

  onMounted(() => {
    loadPreference()

    // Check initially and then every minute if enabled
    if (isAutoTimeEnabled.value) {
      checkTimeAndSetTheme()
    }

    // Set up interval to check time
    timeCheckInterval = window.setInterval(() => {
      checkTimeAndSetTheme()
    }, 60000) // Every minute
  })

  onUnmounted(() => {
    if (timeCheckInterval) {
      clearInterval(timeCheckInterval)
    }
  })

  // Watch for changes and save them automatically
  watch(isAutoTimeEnabled, (newVal) => {
    savePreference(newVal)
  })

  return {
    isAutoTimeEnabled,
    savePreference
  }
}
