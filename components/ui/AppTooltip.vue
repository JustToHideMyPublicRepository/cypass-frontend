<template>
  <div class="relative group/tooltip inline-block">
    <slot name="trigger">
      <IconInfoCircle class="w-3.5 h-3.5 cursor-help transition-opacity" :class="iconClass" />
    </slot>

    <div
      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-[100] leading-relaxed scale-95 group-hover/tooltip:scale-100 origin-bottom"
      :class="widthClass">
      <div v-if="title"
        class="font-black border-b border-white/10 pb-1.5 mb-1.5 text-white/90 uppercase tracking-tighter text-[10px]">
        {{ title }}
      </div>
      <div class="text-white/70 text-[10px] sm:text-[11px] font-medium" v-html="content"></div>

      <!-- Arrow -->
      <div class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/95"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconInfoCircle } from '@tabler/icons-vue'

withDefaults(defineProps<{
  content: string
  title?: string
  widthClass?: string
  iconClass?: string
}>(), {
  title: 'Information',
  widthClass: 'w-64',
  iconClass: 'text-hsa opacity-40 hover:opacity-100'
})
</script>
