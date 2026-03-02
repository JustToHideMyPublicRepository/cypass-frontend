import { ref, watch, onMounted, onUnmounted } from 'vue'

// État partagé pour les paramètres de planification
export interface ThemeSchedule {
  dayStart: string // Format "HH:mm"
  dayEnd: string   // Format "HH:mm"
  activeDays: number[] // 0-6 (Dimanche-Samedi)
}

const defaultSchedule: ThemeSchedule = {
  dayStart: '08:00',
  dayEnd: '18:00',
  activeDays: [1, 2, 3, 4, 5] // Par défaut, jours ouvrables (Lundi-Vendredi)
}

// Utilisez un état partagé pour que tous les composants qui utilisent 
// ce composable voient la même valeur (singleton state).
const isAutoTimeEnabledShared = ref(false)
const autoThemeScheduleShared = ref<ThemeSchedule>({ ...defaultSchedule })
let timeCheckInterval: number | undefined

export const useAutoTheme = () => {
  const colorMode = useColorMode()
  const isAutoTimeEnabled = isAutoTimeEnabledShared
  const autoThemeSchedule = autoThemeScheduleShared

  const checkTimeAndSetTheme = () => {
    if (!isAutoTimeEnabled.value) return

    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const day = now.getDay()
    const currentTimeMinutes = hours * 60 + minutes

    // Vérifier si le jour actuel est actif
    const isDayActive = autoThemeSchedule.value.activeDays.includes(day)
    if (!isDayActive) return

    // Convertir les heures de début/fin en minutes
    const [startH, startM] = autoThemeSchedule.value.dayStart.split(':').map(Number)
    const [endH, endM] = autoThemeSchedule.value.dayEnd.split(':').map(Number)
    const startTimeMinutes = startH * 60 + startM
    const endTimeMinutes = endH * 60 + endM

    let targetMode: 'light' | 'dark'

    // Cas standard : début < fin (ex: 08:00 - 18:00)
    if (startTimeMinutes < endTimeMinutes) {
      if (currentTimeMinutes >= startTimeMinutes && currentTimeMinutes < endTimeMinutes) {
        targetMode = 'light'
      } else {
        targetMode = 'dark'
      }
    }
    // Cas nocturne : début > fin (ex: 18:00 - 08:00)
    else {
      if (currentTimeMinutes >= startTimeMinutes || currentTimeMinutes < endTimeMinutes) {
        targetMode = 'light'
      } else {
        targetMode = 'dark'
      }
    }

    if (colorMode.preference !== targetMode) {
      colorMode.preference = targetMode
    }
  }

  const loadPreferences = () => {
    if (process.client) {
      const savedEnabled = localStorage.getItem('cps_theme_auto_time')
      if (savedEnabled !== null) {
        isAutoTimeEnabled.value = savedEnabled === 'true'
      }

      const savedSchedule = localStorage.getItem('cps_theme_schedule')
      if (savedSchedule) {
        try {
          const parsedSchedule = JSON.parse(savedSchedule);
          // Merge with default to ensure all properties exist
          autoThemeSchedule.value = { ...defaultSchedule, ...parsedSchedule };
        } catch (e) {
          console.error('Erreur lors du chargement de la planification du thème', e)
        }
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

  const updateSchedule = (newSchedule: Partial<ThemeSchedule>) => {
    autoThemeSchedule.value = { ...autoThemeSchedule.value, ...newSchedule }
    if (process.client) {
      localStorage.setItem('cps_theme_schedule', JSON.stringify(autoThemeSchedule.value))
      if (isAutoTimeEnabled.value) {
        checkTimeAndSetTheme()
      }
    }
  }

  onMounted(() => {
    loadPreferences()

    if (isAutoTimeEnabled.value) {
      checkTimeAndSetTheme()
    }

    // Singleton: Ne pas recréer si l'intervalle existe déjà au niveau global
    if (!timeCheckInterval && process.client) {
      timeCheckInterval = window.setInterval(() => {
        checkTimeAndSetTheme()
      }, 60000) // Chaque minute
    }
  })

  // On retire le clearInterval du onUnmounted pour que l'auto-thème survive 
  // à la navigation entre les pages (puisque c'est un état global)

  // Surveiller les changements et sauvegarder automatiquement
  watch(isAutoTimeEnabled, (newVal) => {
    savePreference(newVal)
  })

  return {
    isAutoTimeEnabled,
    autoThemeSchedule,
    savePreference,
    updateSchedule
  }
}
