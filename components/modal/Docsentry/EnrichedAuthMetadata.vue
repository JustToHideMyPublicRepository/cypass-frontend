<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Selected Category Reminder -->
    <div v-if="category"
      class="flex items-center gap-3 p-3 rounded-2xl bg-ash/20 border border-ash/50 mb-2">
      <div class="p-2 rounded-lg bg-primary/10 text-primary">
        <component :is="getDocCategoryIcon(category.key)" class="w-4 h-4" />
      </div>
      <div>
        <p class="text-[10px] text-hsa font-bold uppercase tracking-wider">Catégorie sélectionnée</p>
        <p class="text-sm font-bold text-BtW">{{ category.label }}</p>
      </div>
    </div>

    <div v-if="!category" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 6" :key="i" class="space-y-2">
        <UiAppSkeleton type="text" width="40%" height="10px" class="ml-1" />
        <UiAppSkeleton type="rect" height="44px" class="rounded-xl" />
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar py-2">
      <div v-for="field in category.fields" :key="field.key" class="space-y-1.5 px-0.5">
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

    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-ash/50">
      <UiBaseButton variant="ghost" class="!rounded-2xl border-none font-bold" :disabled="loading"
        @click="$emit('back')">
        Fichier
      </UiBaseButton>
      <UiBaseButton :loading="loading" class="!rounded-2xl font-black tracking-widest shadow-xl"
        @click="$emit('submit')">
        Lancer la certification
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getDocCategoryIcon } from '~/utils/docsentry'

const props = defineProps<{
  category: any
  modelValue: Record<string, any>
  loading?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'submit', 'back'])

const localMetadata = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
