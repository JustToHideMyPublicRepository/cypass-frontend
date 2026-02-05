<template>
  <div class="space-y-4 p-5 bg-ash/20 rounded-[1.5rem] border border-ash/50 backdrop-blur-sm">
    <!-- En-tête du validateur -->
    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
      <IconShieldLock class="w-3.5 h-3.5" />
      Sécurité du mot de passe
    </div>

    <!-- Liste des critères de sécurité -->
    <div class="grid grid-cols-1 gap-2.5">
      <div v-for="(req, index) in requirements" :key="index"
        class="flex items-center gap-3 text-xs md:text-sm transition-all duration-300 group"
        :class="req.met ? 'text-success' : 'text-hsa'">
        <!-- Indicateur d'état (Cercle) -->
        <div class="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 border shadow-sm"
          :class="req.met ? 'bg-success/10 border-success/20 animate-scale-in' : 'bg-ash/50 border-ashAct/50'">
          <IconCheck v-if="req.met" class="w-3 h-3 text-success stroke-[3]" />
          <IconCircle v-else class="w-2 h-2 text-ashAct/50 fill-current" />
        </div>

        <!-- Libellé du critère -->
        <span class="font-medium tracking-tight group-hover:translate-x-1 transition-transform"
          :class="{ 'font-bold': req.met }">
          {{ req.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconCheck, IconShieldLock, IconCircle } from '@tabler/icons-vue'

// Props du composant pour le mot de passe à valider
const props = defineProps<{
  password: string
}>()

// Calcul des critères de validation en temps réel
const requirements = computed(() => [
  {
    label: '12 caractères minimum',
    met: props.password.length >= 12
  },
  {
    label: 'Au moins une majuscule',
    met: /[A-Z]/.test(props.password)
  },
  {
    label: 'Au moins une minuscule',
    met: /[a-z]/.test(props.password)
  },
  {
    label: 'Au moins un chiffre',
    met: /[0-9]/.test(props.password)
  },
  {
    label: 'Au moins un caractère spécial',
    met: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(props.password)
  }
])
</script>

<style scoped>
@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
