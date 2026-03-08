<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 sm:px-0">
    <UiBaseCard class="bg-primary/5 border-primary/20 p-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <IconBell class="w-4 h-4" />
        </div>
        <div>
          <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Total</p>
          <p class="text-lg font-black text-BtW">{{ total }}</p>
        </div>
      </div>
    </UiBaseCard>

    <UiBaseCard class="bg-green-500/5 border-green-500/20 p-4 cursor-pointer hover:bg-green-500/10 transition-all"
      :class="{ '!bg-green-500/10 border-green-500/40': activeCategory === 'DOC' }"
      @click="$emit('filter-category', 'DOC')">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
          <IconFileText class="w-4 h-4" />
        </div>
        <div>
          <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Documents</p>
          <p class="text-lg font-black text-BtW">{{ counts.DOC }}</p>
        </div>
      </div>
    </UiBaseCard>

    <UiBaseCard class="bg-amber-500/5 border-amber-500/20 p-4 cursor-pointer hover:bg-amber-500/10 transition-all"
      :class="{ '!bg-amber-500/10 border-amber-500/40': activeCategory === 'SEC' }"
      @click="$emit('filter-category', 'SEC')">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
          <IconShieldLock class="w-4 h-4" />
        </div>
        <div>
          <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Sécurité</p>
          <p class="text-lg font-black text-BtW">{{ counts.SEC }}</p>
        </div>
      </div>
    </UiBaseCard>

    <UiBaseCard class="bg-blue-500/5 border-blue-500/20 p-4 cursor-pointer hover:bg-blue-500/10 transition-all"
      :class="{ '!bg-blue-500/10 border-blue-500/40': activeCategory === 'PRF' }"
      @click="$emit('filter-category', 'PRF')">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
          <IconUser class="w-4 h-4" />
        </div>
        <div>
          <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Profil</p>
          <p class="text-lg font-black text-BtW">{{ counts.PRF }}</p>
        </div>
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { IconBell, IconFileText, IconShieldLock, IconUser } from '@tabler/icons-vue'

defineProps<{
  total: number
  counts: Record<string, number>
  activeCategory: string
}>()

defineEmits(['filter-category'])
</script>
