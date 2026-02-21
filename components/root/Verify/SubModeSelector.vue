<template>
  <div class="flex justify-center mb-8 animate-fade-in px-2">
    <div
      class="flex flex-col md:flex-row items-center gap-2 md:gap-4 bg-ash/5 p-3 md:p-2 md:pr-4 rounded-2xl md:rounded-3xl border border-ash/50 w-full md:w-auto">
      <div class="flex items-center gap-2 px-2">
        <IconSettings class="w-3.5 h-3.5 text-primary opacity-60 hidden md:block" />
        <label class="text-[9px] md:text-[10px] font-black text-hsa uppercase tracking-[0.2em] whitespace-nowrap">
          Méthode de vérification
        </label>
      </div>

      <div class="relative group w-full md:min-w-[180px]">
        <select :value="modelValue"
          @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value as any)"
          class="w-full h-10 md:h-11 pl-4 pr-10 py-2 rounded-xl bg-WtB border border-ash/50 focus:ring-2 focus:ring-primary outline-none transition-all font-bold md:font-black text-[11px] appearance-none cursor-pointer">
          <option value="original">Document original</option>
          <option value="certificate">Certificat CYPASS</option>
        </select>
        <IconChevronDown
          class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none group-focus-within:text-primary transition-colors" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconChevronDown, IconSettings } from '@tabler/icons-vue'

defineProps<{
  modelValue: 'original' | 'certificate'
}>()

defineEmits(['update:modelValue'])
</script>
