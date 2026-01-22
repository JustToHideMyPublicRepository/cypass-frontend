<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="$emit('close')">
        <div
          :class="['bg-WtB rounded-2xl shadow-2xl w-full p-6 space-y-4 border border-ash transition-all', maxWidthClass]">
          <div v-if="title || $slots.header" class="flex justify-between items-center">
            <slot name="header">
              <h3 class="text-xl font-bold text-BtW">{{ title }}</h3>
            </slot>
            <button @click="$emit('close')"
              class="text-hsa hover:text-danger transition-colors p-1 rounded-lg hover:bg-danger/10">
              <IconCircleX class="w-6 h-6" />
            </button>
          </div>
          <div class="relative">
            <slot />
          </div>
          <div v-if="$slots.footer" class="pt-2">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconCircleX } from '@tabler/icons-vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: 'md'
  }
})

defineEmits(['close'])

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'xs': return 'max-w-xs'
    case 'sm': return 'max-w-sm'
    case 'md': return 'max-w-md'
    case 'lg': return 'max-w-lg'
    case 'xl': return 'max-w-xl'
    case '2xl': return 'max-w-2xl'
    default: return 'max-w-md'
  }
})
</script>
