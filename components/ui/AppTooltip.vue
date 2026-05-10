<template>
  <div class="relative group/tooltip inline-block">
    <slot name="trigger">
      <IconInfoCircle class="w-3.5 h-3.5 cursor-help transition-opacity" :class="iconClass" />
    </slot>

    <div
      class="absolute mb-2 p-3 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-[100] leading-relaxed scale-95 group-hover/tooltip:scale-100"
      :class="[widthClass, positionClasses[position], originClasses[position]]">
      <div v-if="title"
        class="font-black border-b border-white/10 pb-1.5 mb-1.5 text-white/90 uppercase tracking-tighter text-[10px]">
        {{ title }}
      </div>
      <div class="text-white/70 text-[10px] sm:text-[11px] font-medium" v-html="content"></div>

      <!-- Arrow -->
      <div class="absolute border-8 border-transparent" :class="arrowClasses[position]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconInfoCircle } from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  content: string
  title?: string
  widthClass?: string
  iconClass?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}>(), {
  title: 'Information',
  widthClass: 'w-64',
  iconClass: 'text-hsa opacity-40 hover:opacity-100',
  position: 'top'
})

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2'
}

const originClasses = {
  top: 'origin-bottom',
  bottom: 'origin-top',
  left: 'origin-right',
  right: 'origin-left'
}

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900/95',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900/95',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900/95',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-900/95'
}
</script>
