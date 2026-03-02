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
            <IconDeviceDesktop v-if="$colorMode.preference === 'system'" class="w-6 h-6 text-primary" />
            <IconMoon v-else-if="$colorMode.preference === 'dark'" class="w-6 h-6 text-primary" />
            <IconSun v-else class="w-6 h-6 text-warning" />
          </div>
          <!-- Label et description -->
          <div>
            <h3 class="font-bold text-BtW">Préférence d'affichage</h3>
            <p class="text-sm text-hsa">Choisissez manuellement votre thème préféré ou laissez le système s'adapter à
              votre périphérique.</p>
          </div>
        </div>
        <!-- Sélecteur de thème natif -->
        <ClientOnly>
          <select v-model="$colorMode.preference" :disabled="isAutoTimeEnabled"
            class="px-4 py-2 rounded-lg bg-WtB border border-ash focus:ring-2 focus:ring-primary outline-none text-BtW text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="system">Système</option>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
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
              <p class="text-sm text-hsa">La plateforme bascule automatiquement entre le mode clair et sombre selon
                l'heure de votre système.</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="isAutoTimeEnabled" class="sr-only peer">
            <div class="input-toggle-slider"></div>
          </label>
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
          </div>
        </Transition>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { IconSun, IconMoon, IconDeviceDesktop, IconSolarPanel2, IconChevronDown } from '@tabler/icons-vue'
import { useAutoTheme } from '~/composables/useAutoTheme'
import { useSettingsPrefStore } from '~/stores/settingsPref'

const { isAutoTimeEnabled, autoThemeSchedule, updateSchedule } = useAutoTheme()
const settingsPref = useSettingsPrefStore()

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
    if (currentDays.length > 1) { // Au moins un jour doit être actif
      currentDays.splice(index, 1)
    }
  } else {
    currentDays.push(dayId)
  }
  updateSchedule({ activeDays: currentDays })
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
