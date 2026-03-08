<template>
  <div class="flex p-1 bg-ash/50 rounded-[1.2rem] border border-ash max-w-fit">
    <button v-for="t in tabs" :key="t.id" @click="$emit('update:modelValue', t.id)"
      class="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden group"
      :class="modelValue === t.id ? 'bg-WtB text-BtW shadow-md' : 'text-hsa hover:text-BtW'">
      {{ t.label }}
      <div v-if="modelValue === t.id" class="absolute bottom-0 left-0 w-full h-0.5 bg-danger"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'sent' | 'received'
  tabs: { id: 'sent' | 'received'; label: string }[]
}>()

defineEmits(['update:modelValue'])
</script>
