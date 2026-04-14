<template>
  <div class="space-y-4">
    <div v-for="(group, gIndex) in groupedResults" :key="group.name">
      <div class="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ group.name }}
      </div>
      <div class="space-y-1">
        <button v-for="(result, rIndex) in group.items.slice(0, 3)" :key="result.id"
          @click="$emit('select-result', result)"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left" :class="[
            selectedIndex === getAbsoluteIndex(gIndex, rIndex)
              ? (result.isShortcut ? 'bg-ash/50 ring-1 ring-ashAct' : 'bg-primary/10 ring-1 ring-primary/20')
              : 'hover:bg-ash',
            result.isShortcut ? 'cursor-help' : 'cursor-pointer'
          ]" @mouseenter="$emit('update:selectedIndex', getAbsoluteIndex(gIndex, rIndex))">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            :class="getSearchIconStyle(result.type)">
            <component :is="getSearchIcon(result.type)" class="w-4.5 h-4.5" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold text-BtW truncate">{{ result.title }}</div>
            <div class="text-xs text-hsa truncate">{{ result.description }}</div>
          </div>
          <div v-if="selectedIndex === getAbsoluteIndex(gIndex, rIndex) && !result.isShortcut" class="text-primary">
            <IconCornerDownLeft class="w-4 h-4" />
          </div>
          <div v-else-if="result.isShortcut" class="text-hsa/40">
            <IconSquareF1 class="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>

    <!-- Lien pour voir tous les résultats -->
    <div class="p-2">
      <button @click="$emit('view-all')"
        class="w-full py-3 rounded-xl border-2 border-dashed border-ash hover:border-primary/30 hover:bg-primary/5 text-sm font-bold text-hsa hover:text-primary transition-all flex items-center justify-center gap-2">
        <IconExternalLink class="w-4 h-4" />
        Voir tous les résultats pour "{{ searchQuery }}"
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCornerDownLeft, IconSquareF1, IconExternalLink } from '@tabler/icons-vue'
import { getSearchIcon, getSearchIconStyle } from '~/utils/search'

const props = defineProps<{
  groupedResults: any[]
  selectedIndex: number
  searchQuery: string
}>()

defineEmits(['select-result', 'update:selectedIndex', 'view-all'])

const getAbsoluteIndex = (gIndex: any, rIndex: any) => {
  let count = 0
  const gi = Number(gIndex)
  const ri = Number(rIndex)
  for (let i = 0; i < gi; i++) {
    count += props.groupedResults[i].items.length
  }
  return count + ri
}
</script>
