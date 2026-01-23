<template>
  <UiBaseModal :show="show" title="Photo de profil" @close="$emit('close')">
    <div class="space-y-6">
      <div class="flex flex-col items-center">
        <!-- Current/New Preview -->
        <div class="relative w-40 h-40 rounded-full overflow-hidden bg-ash border-4 border-ash/20 shadow-inner mb-6">
          <img :src="previewUrl || currentAvatar || '/images/default-avatar.png'" alt="Preview"
            class="w-full h-full object-cover" />
          <div v-if="isLoading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
            <IconRefresh class="w-8 h-8 animate-spin text-white" />
          </div>
        </div>

        <p class="text-sm text-center text-slate-500 mb-8 max-w-[280px]">
          Choisissez une image (JPG, PNG ou WebP). Taille maximale conseillée : 2 Mo.
        </p>

        <!-- Selection Area -->
        <label
          class="w-full h-32 border-2 border-dashed border-ash/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
          :class="{ 'opacity-50 pointer-events-none': isLoading }">
          <input type="file" class="hidden" accept="image/*" @change="handleFileChange" />
          <IconPhoto class="w-8 h-8 text-ash group-hover:text-primary transition-colors mb-2" />
          <span class="text-sm font-bold text-BtW/60 group-hover:text-primary transition-colors">
            {{ selectedFile ? 'Changer le fichier' : 'Sélectionner une photo' }}
          </span>
          <span v-if="selectedFile" class="text-[10px] text-hsa truncate max-w-[200px] mt-1">{{ selectedFile.name
            }}</span>
        </label>
      </div>

      <div class="flex flex-col gap-3">
        <button @click="submit" :disabled="!selectedFile || isLoading"
          class="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50">
          Mettre à jour la photo
        </button>
        <button @click="$emit('close')" :disabled="isLoading"
          class="w-full py-4 text-[10px] font-black uppercase tracking-widest text-hsa hover:text-BtW transition-colors">
          Annuler
        </button>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconPhoto, IconRefresh } from '@tabler/icons-vue'

const props = defineProps<{
  show: boolean
  currentAvatar?: string | null
  isLoading: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (!file.type.startsWith('image/')) {
    // We can't use toast directly here easily if we want to keep it pure, 
    // but the parent will handle it if we emit or just check here.
    return
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const submit = () => {
  if (selectedFile.value) {
    emit('submit', selectedFile.value)
  }
}

// Cleanup preview URL to avoid memory leaks
watch(() => props.show, (newVal) => {
  if (!newVal) {
    selectedFile.value = null
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
  }
})
</script>
