<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/dashboard/vigitech" class="p-2.5 rounded-xl hover:bg-ash/20 transition-colors text-hsa">
        <IconArrowLeft class="w-6 h-6" />
      </NuxtLink>
      <div>
        <h4>Mes interactions</h4>
        <p>Historique de vos interactions sur VigiTech</p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <!-- Target Type Filter -->
      <div class="relative group">
        <select :value="targetType" @change="handleTypeChange"
          class="appearance-none bg-ash/50 hover:bg-ash border border-ashAct text-BtW text-[10px] font-black uppercase tracking-[0.15em] py-2.5 pl-6 pr-10 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
          <option value="">Toutes les réactions</option>
          <option value="incident">Réactions incidents</option>
          <option value="comment">Réactions commentaires</option>
          <option value="my_comments">Mes commentaires</option>
        </select>
        <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-hsa">
          <IconChevronDown class="w-4 h-4" />
        </div>
      </div>

      <UiBaseButton variant="ghost" @click="$emit('refresh')" :loading="loading"
        class="!px-3 !rounded-xl !h-[42px] border border-ash/30" title="Actualiser">
        <IconRefresh class="w-4 h-4" />
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft, IconChevronDown, IconRefresh, IconMessage } from '@tabler/icons-vue'

defineProps<{
  userReactionsTotal?: number
  targetType: string
  loading?: boolean
}>()

const emit = defineEmits(['refresh', 'update:targetType'])

const handleTypeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  emit('update:targetType', value)
  emit('refresh')
}
</script>
