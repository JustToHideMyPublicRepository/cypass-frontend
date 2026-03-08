<template>
  <div class="px-4 sm:px-0 flex flex-wrap gap-2 items-center">
    <div class="flex items-center gap-2 bg-ash/30 p-1 rounded-xl border border-ash">
      <UiBaseButton v-for="status in ['all', 'unread', 'read']" :key="status" @click="$emit('update:status', status)"
        variant="ghost"
        class="!px-3 !py-1.5 !rounded-lg !text-[10px] !font-black uppercase tracking-tighter transition-all !h-auto"
        :class="modelValue.status === status ? '!bg-WtB !text-primary shadow-sm' : 'text-hsa hover:!text-BtW'">
        {{ status === 'all' ? 'Toutes' : status === 'unread' ? 'Non lues' : 'Lues' }}
      </UiBaseButton>
    </div>

    <select :value="modelValue.priority" @change="e => $emit('update:priority', (e.target as HTMLSelectElement).value)"
      class="bg-ash/30 border border-ash rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-hsa outline-none hover:border-primary/30 transition-all cursor-pointer">
      <option value="all">Priorité (Toutes)</option>
      <option value="standard">Standard</option>
      <option value="medium">Moyenne</option>
      <option value="high">Haute</option>
    </select>

    <UiBaseButton @click="$emit('toggle-sort')" variant="ghost"
      class="!bg-ash/30 border border-ash !rounded-xl !px-3 !py-1.5 !text-[10px] !font-black uppercase tracking-tighter text-hsa !flex !items-center !gap-1.5 hover:!border-primary/30 transition-all !h-auto">
      <IconArrowsSort class="w-3 h-3" />
      {{ modelValue.order === 'desc' ? 'Plus récents' : 'Plus anciens' }}
    </UiBaseButton>

    <div class="flex-1"></div>

    <UiBaseButton v-if="hasActiveFilters" @click="$emit('reset')" variant="ghost"
      class="!text-[9px] !font-black uppercase text-hsa hover:!text-danger !flex !items-center !gap-1 transition-colors !p-0 !bg-transparent hover:!bg-transparent !h-auto">
      <IconX class="w-3 h-3" />
      Réinitialiser
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { IconArrowsSort, IconX } from '@tabler/icons-vue'

defineProps<{
  modelValue: {
    status: string
    priority: string
    order: string
  }
  hasActiveFilters: boolean
}>()

defineEmits(['update:status', 'update:priority', 'toggle-sort', 'reset'])
</script>
