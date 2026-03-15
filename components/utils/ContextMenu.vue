<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="scale-100 opacity-100" leave-to-class="scale-95 opacity-0">
      <div v-if="isOpen" ref="menuRef"
        class="fixed z-[9999] min-w-[220px] bg-WtB/80 backdrop-blur-xl border border-ash/50 shadow-2xl rounded-2xl overflow-hidden py-1.5 ring-1 ring-white/5"
        :style="menuStyle">
        <!-- Metadata Header -->
        <div v-if="metadata" class="px-4 py-3 border-b border-ash/50 bg-ash/5 mb-1.5">
          <div v-if="metadata.title" class="text-[10px] uppercase font-black tracking-widest text-hsa mb-2 opacity-60">
            {{ metadata.title }}
          </div>
          <div v-for="info in metadata.infos" :key="info.label" class="flex justify-between items-center gap-4 py-0.5">
            <span class="text-[10px] text-hsa font-bold">{{ info.label }}</span>
            <span class="text-[10px] text-BtW font-black text-right">{{ info.value }}</span>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="px-1.5 space-y-0.5">
          <button v-for="(item, index) in items" :key="index" @click="handleAction(item)"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all group relative overflow-hidden"
            :class="[
              item.variant === 'danger'
                ? 'text-danger hover:bg-danger/10'
                : 'text-BtW hover:bg-primary/10 hover:text-primary'
            ]">
            <component :is="item.icon" v-if="item.icon"
              class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
            <span class="flex-1 text-left">{{ item.label }}</span>

            <!-- Hover indicator -->
            <div
              class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-current rounded-full translate-x-[-2px] group-hover:translate-x-0 transition-transform" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useContextMenu } from '~/composables/useContextMenu'

const { isOpen, position, items, metadata, closeMenu } = useContextMenu()
const menuRef = ref<HTMLElement | null>(null)
const adjustedPosition = ref({ x: 0, y: 0 })

const menuStyle = computed(() => ({
  top: `${adjustedPosition.value.y}px`,
  left: `${adjustedPosition.value.x}px`
}))

const handleAction = (item: any) => {
  item.action()
  closeMenu()
}

// Adjust position to stay within viewport
const adjustPosition = async () => {
  if (!isOpen.value) return

  await nextTick()
  if (!menuRef.value) return

  const menuRect = menuRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let x = position.x
  let y = position.y

  // Right edge check
  if (x + menuRect.width > viewportWidth) {
    x = viewportWidth - menuRect.width - 10
  }

  // Bottom edge check
  if (y + menuRect.height > viewportHeight) {
    y = viewportHeight - menuRect.height - 10
  }

  // Left/Top safety
  x = Math.max(10, x)
  y = Math.max(10, y)

  adjustedPosition.value = { x, y }
}

watch([isOpen, position], () => {
  if (isOpen.value) {
    adjustPosition()
  }
})

const handleClickOutside = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    closeMenu()
  }
}

const handleScroll = () => {
  if (isOpen.value) closeMenu()
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', closeMenu)
})
</script>
