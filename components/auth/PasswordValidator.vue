<template>
  <div class="space-y-3 p-4 bg-ash/30 rounded-lg border border-ash">
    <div class="text-xs font-bold text-hsa uppercase tracking-wide">Sécurité du mot de passe</div>

    <div class="space-y-2">
      <div v-for="(req, index) in requirements" :key="index"
        class="flex items-center gap-2 text-sm transition-colors duration-200"
        :class="req.met ? 'text-success' : 'text-hsa'">
        <div class="w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200"
          :class="req.met ? 'bg-success/20' : 'bg-ashAct'">
          <IconCheck v-if="req.met" class="w-3 h-3 text-success" />
          <IconX v-else class="w-3 h-3 text-hsa" />
        </div>
        <span>{{ req.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconCheck, IconX } from '@tabler/icons-vue'

const props = defineProps<{
  password: string
}>()

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
    label: 'Au moins un caractère spécial (!@#$%^&*...)',
    met: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(props.password)
  }
])
</script>
