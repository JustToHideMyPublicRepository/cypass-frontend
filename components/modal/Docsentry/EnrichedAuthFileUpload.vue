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

    <div class="space-y-4">
      <ModalDocsentryAuthDropZone v-if="!file" @select-file="triggerFileSelect" />
      <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">
      <ModalDocsentryAuthFilePreview v-if="file" :file="file" @remove="$emit('update:file', null)" />
    </div>

    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-ash/50">
      <UiBaseButton variant="ghost" class="!rounded-2xl border-none font-bold" @click="$emit('back')">
        Retour
      </UiBaseButton>
      <UiBaseButton :disabled="!file" class="!rounded-2xl font-black tracking-widest shadow-xl"
        @click="$emit('next')">
        Continuer
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getDocCategoryIcon } from '~/utils/docsentry'

const props = defineProps<{
  file: File | null
  category: any
}>()

const emit = defineEmits(['update:file', 'next', 'back', 'error'])

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileSelect = () => fileInput.value?.click()

const handleFileChange = (e: any) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const selectedFile = target.files[0]
    if (validateFile(selectedFile)) {
      emit('update:file', selectedFile)
    } else {
      emit('update:file', null)
      if (fileInput.value) fileInput.value.value = ''
    }
  }
}

const validateFile = (selectedFile: File): boolean => {
  if (selectedFile.type !== 'application/pdf') {
    emit('error', {
      title: 'Format non supporté',
      message: `Le fichier "${selectedFile.name}" n'est pas un PDF. Seuls les fichiers PDF sont acceptés pour la certification.`,
      file: selectedFile
    })
    return false
  }

  if (selectedFile.size > 3 * 1024 * 1024) {
    emit('error', {
      title: 'Fichier trop volumineux',
      message: `Le fichier fait ${(selectedFile.size / 1024 / 1024).toFixed(2)} Mo. La taille maximale autorisée est de 3 Mo.`,
      file: selectedFile
    })
    return false
  }

  return true
}
</script>
