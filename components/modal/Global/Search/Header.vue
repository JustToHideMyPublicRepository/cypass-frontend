<template>
  <div class="relative p-4 border-b border-ash/50">
    <IconSearch class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
    <input ref="inputRef" :value="modelValue" type="text" :placeholder="currentPlaceholder"
      class="w-full pl-12 pr-12 py-3 bg-transparent text-BtW text-lg placeholder-slate-500 outline-none"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown="$emit('keydown', $event)" />
    <div class="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
      <button v-if="modelValue" @click="$emit('update:modelValue', ''); $emit('clear')"
        class="p-1 text-hsa hover:text-primary transition-colors">
        <IconCircleX class="w-5 h-5" />
      </button>
      <kbd class="kbd-hint">Esc</kbd>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconSearch, IconCircleX } from '@tabler/icons-vue'
import { searchPlaceholders, PLACEHOLDER_INTERVAL } from '~/utils/search'

defineProps<{
  modelValue: string
}>()

defineEmits(['update:modelValue', 'keydown', 'clear'])

const inputRef = ref<HTMLInputElement | null>(null)

const currentPlaceholder = ref(searchPlaceholders[0])
let placeholderInterval: any = null

onMounted(() => {
  let index = 0
  placeholderInterval = setInterval(() => {
    index = (index + 1) % searchPlaceholders.length
    currentPlaceholder.value = searchPlaceholders[index]
  }, PLACEHOLDER_INTERVAL)
})

onUnmounted(() => {
  if (placeholderInterval) clearInterval(placeholderInterval)
})


defineExpose({
  focus: () => inputRef.value?.focus()
})
</script>
