<template>
  <div class="glass-panel p-6 rounded-[2rem] border border-ashAct space-y-6 shadow-sm">
    <h3 class="text-[10px] font-black text-hsa uppercase tracking-[0.2em]">Filtrer les incidents</h3>

    <div class="space-y-4">
      <div class="space-y-1.5">
        <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Recherche</label>
        <div class="relative group">
          <span
            class="absolute left-3 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
            <IconSearch class="w-4 h-4" />
          </span>
          <input :value="modelValue.search" @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Mot-clé..."
            class="w-full h-10 pl-9 pr-4 rounded-xl bg-WtB border border-ash/50 font-bold text-xs outline-none focus:ring-2 focus:ring-primary transition-all placeholder-hsa/50" />
        </div>
      </div>

      <!-- Type -->
      <div class="space-y-1.5">
        <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Type de menace</label>
        <div class="relative group">
          <select :value="modelValue.type" @change="updateFilter('type', ($event.target as HTMLSelectElement).value)"
            class="w-full h-10 px-4 rounded-xl bg-WtB border border-ash/50 font-bold text-xs outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer">
            <option value="">Tous les types</option>
            <option value="phishing">Phishing</option>
            <option value="ransomware">Ransomware</option>
            <option value="fake_profile">Faux Profil</option>
            <option value="harassment">Harcèlement</option>
          </select>
          <IconChevronDown
            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none group-focus-within:text-primary transition-colors" />
        </div>
      </div>

      <!-- Gravité -->
      <div class="space-y-1.5">
        <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Gravité</label>
        <div class="relative group">
          <select :value="modelValue.level" @change="updateFilter('level', ($event.target as HTMLSelectElement).value)"
            class="w-full h-10 px-4 rounded-xl bg-WtB border border-ash/50 font-bold text-xs outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer">
            <option value="">Toutes les gravités</option>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="critical">Critique</option>
          </select>
          <IconChevronDown
            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none group-focus-within:text-primary transition-colors" />
        </div>
      </div>

      <!-- Date range -->
      <div class="space-y-4 pt-2 border-t border-ash">
        <div class="space-y-1.5">
          <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Depuis le</label>
          <input :value="modelValue.date_start"
            @input="updateFilter('date_start', ($event.target as HTMLInputElement).value)" type="datetime-local"
            class="w-full h-10 px-3 rounded-xl bg-WtB border border-ash/50 text-xs font-bold outline-none focus:ring-2 focus:ring-primary transition-all" />
        </div>
        <div class="space-y-1.5">
          <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Jusqu'au</label>
          <input :value="modelValue.date_end"
            @input="updateFilter('date_end', ($event.target as HTMLInputElement).value)" type="datetime-local"
            class="w-full h-10 px-3 rounded-xl bg-WtB border border-ash/50 text-xs font-bold outline-none focus:ring-2 focus:ring-primary transition-all" />
        </div>
      </div>
    </div>

    <div class="flex gap-2">
      <UiBaseButton variant="ghost" block size="sm" class="!text-[9px] !font-black !uppercase" @click="$emit('reset')"
        :disabled="!hasActiveFilters">
        Réinitialiser
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconSearch, IconChevronDown } from '@tabler/icons-vue'

const props = defineProps<{
  modelValue: {
    search: string
    type: string
    level: string
    date_start: string
    date_end: string
  }
  hasActiveFilters: boolean
}>()

const emit = defineEmits(['update:modelValue', 'reset'])

const updateFilter = (key: string, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>
