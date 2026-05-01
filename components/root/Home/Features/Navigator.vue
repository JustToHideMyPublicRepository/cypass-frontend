<template>
  <div class="relative flex items-center p-1.5 bg-WtB/50 backdrop-blur-xl rounded-full border border-ash/30 shadow-inner overflow-x-auto no-scrollbar max-w-full">
    <div
      class="absolute h-[calc(100%-12px)] rounded-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-0"
      :class="theme === 'green' ? 'bg-success/20 shadow-[0_0_15px_rgba(var(--color-success),0.3)]' : 'bg-primary/20 shadow-[0_0_15px_rgba(var(--color-primary),0.3)]'"
      :style="{
        width: pillWidth + 'px',
        transform: `translateX(${pillLeft}px)`
      }"
    />
    <button
      v-for="(item, i) in items"
      :key="i"
      ref="tabRefs"
      @click="$emit('select', i)"
      class="relative z-10 px-5 py-2 text-sm font-bold transition-all duration-400 rounded-full cursor-pointer whitespace-nowrap"
      :class="[
        i === active
          ? theme === 'green' ? 'text-success' : 'text-primary'
          : 'text-hsa hover:text-BtW'
      ]"
      :aria-label="`Aller au module ${item.title}`"
    >
      {{ item.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUpdated } from 'vue'

interface NavItem {
  title: string
}

const props = defineProps<{
  items: NavItem[]
  active: number
  theme: 'green' | 'blue'
}>()

defineEmits<{
  select: [index: number]
}>()

const tabRefs = ref<HTMLElement[]>([])
const pillWidth = ref(0)
const pillLeft = ref(0)

const updatePill = async () => {
  await nextTick()
  if (tabRefs.value && tabRefs.value[props.active]) {
    const el = tabRefs.value[props.active] as HTMLElement
    pillWidth.value = el.offsetWidth
    pillLeft.value = el.offsetLeft
  }
}

watch(() => props.active, updatePill)
// For dynamic fonts loading or resizing
onMounted(updatePill)
onUpdated(updatePill)
</script>
