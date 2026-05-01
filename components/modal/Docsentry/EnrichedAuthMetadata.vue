<template>
  <div class="space-y-6 animate-fade-in">
    <div v-if="!category" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 6" :key="i" class="space-y-2">
        <UiAppSkeleton type="text" width="40%" height="10px" class="ml-1" />
        <UiAppSkeleton type="rect" height="44px" class="rounded-xl" />
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
      <div v-for="field in category.fields" :key="field.key" class="space-y-1.5">
        <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.15em] ml-1">
          {{ field.label }}
          <span v-if="field.required" class="text-danger">*</span>
        </label>
        <input v-if="field.type === 'text' || field.type === 'date'" v-model="localMetadata[field.key]"
          :type="field.type" :placeholder="field.label"
          class="w-full h-11 px-4 rounded-xl border border-ash bg-ash/50 focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all outline-none"
          :required="field.required" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  category: any
  modelValue: Record<string, any>
}>()

const emit = defineEmits(['update:modelValue'])

const localMetadata = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
