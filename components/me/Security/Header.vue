<template>
  <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div class="space-y-1.5 md:space-y-2">
      <h1 class="text-xl md:text-2xl font-bold text-BtW tracking-tight">Centre de sécurité</h1>
      <p class="text-hsa text-[11px] md:text-sm font-medium leading-relaxed max-w-xl">
        Gérez vos méthodes de double authentification et renforcez la protection de vos actifs numériques contre les
        accès non autorisés.
      </p>
    </div>

    <!-- MFA Toggle Card -->
    <div
      class="flex items-center gap-4 bg-ash/30 border border-ashAct/50 p-2 pl-5 rounded-2xl md:rounded-[2rem] min-w-[280px] shadow-sm animate-fade-in backdrop-blur-sm">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <span class="relative flex h-2 w-2" v-if="mfaActive && !mfaDisabledUntil">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span class="h-2 w-2 rounded-full bg-hsa/30" v-else-if="!mfaActive"></span>
          <span class="h-2 w-2 rounded-full bg-warning" v-else></span>

          <h4 class="text-[10px] font-black uppercase tracking-widest text-BtW">Double Authentification</h4>
        </div>
        <p class="text-[10px] font-bold mt-0.5" :class="statusClass">
          {{ statusLabel }}
        </p>
      </div>

      <div
        class="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-2 pr-3 rounded-xl md:rounded-[1.5rem] border border-white/80 dark:border-white/5">
        <UiLogoLoader v-if="loadingMfa" size="xs" />
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" :checked="mfaActive" @change="$emit('toggle-mfa', !mfaActive)" class="sr-only peer"
            :disabled="loadingMfa">
          <div class="input-toggle-slider scale-90">
          </div>
        </label>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  mfaActive: boolean
  loadingMfa: boolean
  mfaDisabledUntil?: string | null
}>()

defineEmits(['toggle-mfa'])

const statusLabel = computed(() => {
  if (props.mfaDisabledUntil) return `Suspendue jusqu'au ${formatDate(props.mfaDisabledUntil)}`
  return props.mfaActive ? 'Protection active' : 'Non configurée'
})

const statusClass = computed(() => {
  if (props.mfaDisabledUntil) return 'text-warning'
  return props.mfaActive ? 'text-success' : 'text-hsa opacity-70'
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
