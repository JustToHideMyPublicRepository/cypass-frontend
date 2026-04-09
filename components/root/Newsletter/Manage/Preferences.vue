<template>
  <div class="space-y-4">
    <h2 class="text-xs font-black uppercase tracking-[0.2em] text-hsa px-1">Préférences de réception</h2>

    <div class="grid gap-4">
      <div v-for="(pref, key) in preferences" :key="key"
        class="group relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 overflow-hidden"
        :class="pref.value ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-ash/10 border-ash/50 hover:border-ashAct'">

        <div class="flex items-center gap-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            :class="pref.value ? 'bg-primary text-WtB' : 'bg-ash text-hsa'">
            <component :is="pref.icon" class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-BtW">{{ pref.label }}</h3>
            <p class="text-[11px] text-hsa font-medium">{{ pref.desc }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 relative z-10">
          <UiLogoLoader v-if="loadingKey === (key as string)" size="xs" />
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" :checked="pref.value" @change="$emit('toggle', key as string, !pref.value)"
              class="sr-only peer" :disabled="loadingKey === (key as string)" />
            <div class="input-toggle-slider"></div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PreferenceItem {
  label: string
  desc: string
  icon: any
  value: boolean
}

defineProps<{
  preferences: Record<string, PreferenceItem>
  loadingKey: string | null
}>()

defineEmits<{
  (e: 'toggle', key: string, value: boolean): void
}>()
</script>
