<template>
  <div class="flex justify-center mb-16 relative z-10 scale-90 sm:scale-100 origin-center transition-transform">
    <div class="bg-ash/50 backdrop-blur-xl p-1.5 rounded-lg border border-ash/60 inline-flex items-center shadow-lg">
      <button v-for="tab in tabs" :key="tab.id" @click="$emit('update:modelValue', tab.id)"
        class="relative px-6 sm:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 outline-none flex items-center gap-2"
        :class="modelValue === tab.id ? 'text-BtW' : 'text-hsa hover:text-primary/50'">
        <!-- Background Indicator -->
        <span v-if="modelValue === tab.id"
          class="absolute inset-0 bg-WtB shadow mt-0.5 rounded-lg -z-10 ring-1 ring-ash/20 transition-all"></span>

        <component :is="tab.icon" v-if="tab.icon" class="w-4 h-4 shrink-0 transition-transform"
          :class="modelValue === tab.id ? 'scale-110 text-primary' : 'opacity-70'" />
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  tabs: Array<{ id: string, label: string, icon?: any }>
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
