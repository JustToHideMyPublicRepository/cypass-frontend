<template>
  <UiBaseCard class="!rounded-[2rem]">
    <!-- Custom Header for Collapse/Expand -->
    <template #header>
      <div class="flex-1 flex items-center justify-between cursor-pointer group"
        @click="settingsPref.toggleSection('appearance')">
        <h3 class="text-xl font-black text-BtW tracking-tight uppercase">Apparence</h3>
        <button class="p-2 rounded-full hover:bg-ash transition-colors text-hsa group-hover:text-primary">
          <IconChevronDown class="w-5 h-5 transition-transform duration-300"
            :class="{ '-rotate-180': settingsPref.display.appearance }" />
        </button>
      </div>
    </template>

    <div v-show="settingsPref.display.appearance" class="space-y-4 animate-fade-in">
      <div class="flex items-center justify-between p-4 rounded-xl bg-ash/30 border border-ash">
        <div class="flex items-center gap-4">
          <!-- Icône dynamique selon la préférence actuelle -->
          <div class="p-2 bg-WtB rounded-lg shadow-sm">
            <IconDeviceDesktop v-if="colorMode.preference === 'system'" class="w-6 h-6 text-primary" />
            <IconMoon v-else-if="colorMode.preference === 'dark'" class="w-6 h-6 text-primary" />
            <IconSun v-else class="w-6 h-6 text-warning" />
          </div>
          <!-- Label et description -->
          <div>
            <h3 class="font-bold text-BtW">Préférence d'affichage</h3>
            <p class="text-sm text-hsa">Choisissez manuellement votre thème préféré ou laissez le système s'adapter à
              votre périphérique.</p>
          </div>
        </div>
        <!-- Sélecteur de thème -->
        <ClientOnly>
          <div class="flex gap-3">
            <button v-for="mode in ['system', 'light', 'dark']" :key="mode" @click="colorMode.preference = mode"
              :disabled="isAutoTimeEnabled"
              class="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 group"
              :class="[
                colorMode.preference === mode
                  ? 'bg-primary/10 border-primary text-primary shadow-sm scale-[1.02]'
                  : 'bg-WtB border-ash text-hsa hover:border-ashAct hover:bg-ash/10',
                isAutoTimeEnabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'
              ]">
              <div class="p-2 rounded-xl transition-colors"
                :class="colorMode.preference === mode ? 'bg-primary/20' : 'bg-ash/30 group-hover:bg-ash/50'">
                <IconDeviceDesktop v-if="mode === 'system'" class="w-5 h-5" />
                <IconSun v-else-if="mode === 'light'" class="w-5 h-5 text-warning" />
                <IconMoon v-else class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-black uppercase tracking-widest">{{
                mode === 'system' ? 'Système' : mode === 'light' ? 'Clair' : 'Sombre'
              }}</span>
            </button>
          </div>
        </ClientOnly>
      </div>

      <!-- Option Auto basculement selon l'heure -->
      <div class="flex flex-col gap-4 p-4 rounded-xl bg-ash/30 border border-ash">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-WtB rounded-lg shadow-sm">
              <IconSolarPanel2 class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 class="font-bold text-BtW">Planification automatique</h3>
              <p class="text-sm text-hsa">
                La plateforme bascule automatiquement entre le mode clair et sombre selon l'heure de votre système.</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <div v-if="isAutoTimeEnabled"
              class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
              <IconHistory class="w-3 h-3" />
              Prochain : {{ nextSwitchInfo }}
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="isAutoTimeEnabled" class="sr-only peer">
              <div class="input-toggle-slider"></div>
            </label>
          </div>
        </div>

        <!-- Section Personnalisation (Visible uniquement si Auto est activé) -->
        <Transition name="expand">
          <div v-if="isAutoTimeEnabled" class="pt-4 mt-4 border-t border-ash/50 space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Heure de début (Clair) -->
              <div class="space-y-2">
                <label class="text-[10px] font-black text-hsa uppercase tracking-widest px-1">Heure de début
                  (Jour)</label>
                <input type="time" :value="autoThemeSchedule.dayStart"
                  @input="updateSchedule({ dayStart: ($event.target as HTMLInputElement).value })"
                  class="w-full px-4 py-2 rounded-xl bg-WtB border border-ash focus:ring-2 focus:ring-primary outline-none text-BtW text-sm">
              </div>
              <!-- Heure de fin (Nuit) -->
              <div class="space-y-2">
                <label class="text-[10px] font-black text-hsa uppercase tracking-widest px-1">Heure de fin
                  (Nuit)</label>
                <input type="time" :value="autoThemeSchedule.dayEnd"
                  @input="updateSchedule({ dayEnd: ($event.target as HTMLInputElement).value })"
                  class="w-full px-4 py-2 rounded-xl bg-WtB border border-ash focus:ring-2 focus:ring-primary outline-none text-BtW text-sm">
              </div>
            </div>

            <!-- Sélection des jours -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-hsa uppercase tracking-widest px-1">Jours d'activation</label>
              <div class="flex flex-wrap gap-2">
                <button v-for="day in days" :key="day.id" @click="toggleDay(day.id)"
                  class="px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all" :class="autoThemeSchedule.activeDays.includes(day.id)
                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                    : 'bg-WtB border-ash text-hsa hover:border-ashAct'">
                  {{ day.label }}
                </button>
              </div>
            </div>

            <!-- Restaurer les paramètres par défaut -->
            <div class="pt-4 flex justify-end">
              <UiBaseButton @click="resetScheduleDefaults" variant="ghost"
                class="!inline-flex !items-center !gap-2 !px-3 !py-1.5 !text-[11px] !font-bold !uppercase tracking-wider">
                <IconRotate class="w-4 h-4" />
                Restaurer Defaults
              </UiBaseButton>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { IconSun, IconMoon, IconDeviceDesktop, IconSolarPanel2, IconChevronDown, IconRotate, IconHistory } from '@tabler/icons-vue'
import { useAutoTheme } from '~/composables/useAutoTheme'
import { useSettingsPrefStore } from '~/stores/front/settingsPref'
import { useToastStore } from '~/stores/front/toast'
import { computed } from 'vue'

const colorMode = useColorMode()
const { isAutoTimeEnabled, autoThemeSchedule, updateSchedule } = useAutoTheme()
const settingsPref = useSettingsPrefStore()
const toast = useToastStore()

/**
 * Calcule l'heure du prochain basculement automatique.
 */
const nextSwitchInfo = computed(() => {
  const now = new Date()
  const [startH, startM] = autoThemeSchedule.value.dayStart.split(':').map(Number)
  const [endH, endM] = autoThemeSchedule.value.dayEnd.split(':').map(Number)

  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes()
  const startTimeMinutes = startH * 60 + startM
  const endTimeMinutes = endH * 60 + endM

  if (currentTimeMinutes < startTimeMinutes) return autoThemeSchedule.value.dayStart
  if (currentTimeMinutes < endTimeMinutes) return autoThemeSchedule.value.dayEnd
  return autoThemeSchedule.value.dayStart
})

const days = [
  { id: 1, label: 'Lun' },
  { id: 2, label: 'Mar' },
  { id: 3, label: 'Mer' },
  { id: 4, label: 'Jeu' },
  { id: 5, label: 'Ven' },
  { id: 6, label: 'Sam' },
  { id: 0, label: 'Dim' }
]

const toggleDay = (dayId: number) => {
  const currentDays = [...autoThemeSchedule.value.activeDays]
  const index = currentDays.indexOf(dayId)
  if (index > -1) {
    if (currentDays.length > 1) {
      currentDays.splice(index, 1)
    } else {
      // Au moins un jour doit rester actif
      toast.showToast('warning', 'Action impossible', 'Au moins un jour doit rester actif pour la planification automatique.')
      return
    }
  } else {
    currentDays.push(dayId)
  }
  updateSchedule({ activeDays: currentDays })
}

// Restaurer les paramètres de planification par défaut
const resetScheduleDefaults = () => {
  updateSchedule({
    dayStart: '08:00',
    dayEnd: '18:00',
    activeDays: [1, 2, 3, 4, 5]
  })
}

// Écouter si l'utilisateur modifie le thème manuellement via ThemeToggle.vue
const handleManualOverride = () => {
  isAutoTimeEnabled.value = false
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('theme-manual-override', handleManualOverride)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('theme-manual-override', handleManualOverride)
  }
})
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}
</style>
