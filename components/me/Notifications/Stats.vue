<template>
  <div class="grid grid-cols-2 md:grid-cols-5 gap-4 px-4 sm:px-0">
    <UiBaseCard class="bg-hsa/5 border-hsa/20 p-4 cursor-pointer hover:bg-hsa/10 transition-all"
      :class="{ '!bg-hsa/10 border-hsa/40': activeCategory === 'all' }" @click="$emit('filter-category', 'all')">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-hsa/10 flex items-center justify-center text-hsa">
          <IconBell class="w-4 h-4" />
        </div>
        <div>
          <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Total</p>
          <p class="text-lg font-black text-BtW">{{ total }}</p>
        </div>
      </div>
    </UiBaseCard>

    <UiBaseCard class="bg-success/5 border-success/20 p-4 cursor-pointer hover:bg-success/10 transition-all"
      :class="{ '!bg-success/10 border-success/40': activeCategory === 'DOC' }"
      @click="$emit('filter-category', 'DOC')">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-success/10 text-success flex items-center justify-center">
          <IconFileText class="w-4 h-4" />
        </div>
        <div>
          <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Documents</p>
          <p class="text-lg font-black text-BtW">{{ counts.DOC }}</p>
        </div>
      </div>
    </UiBaseCard>

    <UiBaseCard class="bg-warning/5 border-warning/20 p-4 cursor-pointer hover:bg-warning/10 transition-all"
      :class="{ '!bg-warning/10 border-warning/40': activeCategory === 'SEC' }"
      @click="$emit('filter-category', 'SEC')">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
          <IconShieldLock class="w-4 h-4" />
        </div>
        <div>
          <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Sécurité</p>
          <p class="text-lg font-black text-BtW">{{ counts.SEC }}</p>
        </div>
      </div>
    </UiBaseCard>

    <UiBaseCard class="bg-danger/5 border-danger/20 p-4 cursor-pointer hover:bg-danger/10 transition-all"
      :class="{ '!bg-danger/10 border-danger/40': activeCategory === 'INC' }" @click="$emit('filter-category', 'INC')">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
          <IconAlertOctagon class="w-4 h-4" />
        </div>
        <div>
          <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Incidents</p>
          <p class="text-lg font-black text-BtW">{{ counts.INC }}</p>
        </div>
      </div>
    </UiBaseCard>

    <UiBaseCard class="bg-primary/5 border-primary/20 p-4 cursor-pointer hover:bg-primary/10 transition-all"
      :class="{ '!bg-primary/10 border-primary/40': activeCategory === 'PRF' }"
      @click="$emit('filter-category', 'PRF')">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
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
import { IconBell, IconFileText, IconShieldLock, IconUser, IconAlertOctagon } from '@tabler/icons-vue'

defineProps<{
  total: number
  counts: Record<string, number>
  activeCategory: string
}>()

defineEmits(['filter-category'])
</script>
