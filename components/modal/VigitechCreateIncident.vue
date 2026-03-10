<template>
  <UiBaseModal :show="show" :title="isEditMode ? 'Modifier l\'incident' : 'Signaler un Incident'" maxWidth="2xl"
    @close="closeModal">
    <div class="space-y-6 py-2">
      <!-- Information -->
      <div class="p-5 rounded-[1.5rem] bg-danger/5 border border-danger/10 flex gap-4 backdrop-blur-sm">
        <div class="shrink-0 p-2.5 bg-danger/10 rounded-xl h-fit text-danger shadow-inner">
          <IconAlertTriangle class="w-6 h-6" />
        </div>
        <div class="space-y-1">
          <p class="text-sm text-hsa font-medium leading-relaxed">
            Votre signalement aide à protéger la communauté béninoise.
            Veuillez fournir des informations précises et si possible une preuve tangible.
          </p>
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-danger/60">
            Preuves acceptées: JPG, PNG, PDF • Max 3 Mo
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Titre -->
        <div class="md:col-span-2 space-y-2 text-left">
          <label class="text-xs font-black text-hsa uppercase tracking-widest px-1">Titre de l'incident</label>
          <input v-model="form.title" type="text" placeholder="Ex: Tentative de phishing WhatsApp"
            class="w-full h-12 px-4 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" />
        </div>

        <!-- Type d'incident -->
        <div class="space-y-2 text-left">
          <label class="text-xs font-black text-hsa uppercase tracking-widest px-1">Type</label>
          <div class="relative group">
            <select v-model="form.type"
              class="w-full h-12 pl-4 pr-10 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm appearance-none cursor-pointer">
              <option value="phishing">Phishing</option>
              <option value="ransomware">Ransomware</option>
              <option value="fake_profile">Faux Profil</option>
              <option value="harassment">Harcèlement</option>
              <option value="other">Autre</option>
            </select>
            <IconChevronDown
              class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none opacity-60" />
          </div>
        </div>

        <!-- Niveau de menace -->
        <div class="space-y-2 text-left">
          <label class="text-xs font-black text-hsa uppercase tracking-widest px-1">Niveau de menace</label>
          <div class="relative group">
            <select v-model="form.threat_level"
              class="w-full h-12 pl-4 pr-10 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm appearance-none cursor-pointer">
              <option value="low">Faible</option>
              <option value="medium">Moyen</option>
              <option value="critical">Critique</option>
            </select>
            <IconChevronDown
              class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none opacity-60" />
          </div>
        </div>

        <!-- Localisation -->
        <div class="space-y-2 text-left">
          <label class="text-xs font-black text-hsa uppercase tracking-widest px-1">Localisation (Ville, Pays)</label>
          <div class="relative">
            <IconMapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa opacity-50" />
            <input v-model="form.location" type="text" placeholder="Ex: Cotonou, Bénin"
              class="w-full h-12 pl-11 pr-4 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" />
          </div>
        </div>

        <!-- Anonymat -->
        <div class="flex items-center justify-between p-4 bg-ash/10 rounded-xl border border-ash/50">
          <div class="space-y-0.5 text-left">
            <p class="text-xs font-bold text-BtW">Signalement Anonyme</p>
            <p class="text-[10px] text-hsa uppercase tracking-wider">Masquer votre identité</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.is_anonymous" class="sr-only peer">
            <div
              class="w-11 h-6 bg-ash/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary uppercase text-[10px]">
            </div>
          </label>
        </div>

        <!-- Description -->
        <div class="md:col-span-2 space-y-2 text-left">
          <label class="text-xs font-black text-hsa uppercase tracking-widest px-1">Description Détailée</label>
          <textarea v-model="form.description" rows="4"
            placeholder="Décrivez l'incident avec le plus de précisions possibles..."
            class="w-full p-4 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm resize-none"></textarea>
        </div>

        <!-- Drop Zone -->
        <div class="md:col-span-2 space-y-2 text-left">
          <label class="text-xs font-black text-hsa uppercase tracking-widest px-1">Preuve / Capture d'écran</label>
          <div class="relative group">
            <div @click="triggerFileUpload"
              class="w-full p-8 border-2 border-dashed rounded-[1.5rem] bg-ash/5 transition-all duration-500 flex flex-col items-center justify-center gap-4 cursor-pointer"
              :class="[
                form.evidence ? 'border-success/40 bg-success/5' : 'border-ash hover:border-primary/40 hover:bg-primary/5',
                isOver ? 'border-primary ring-4 ring-primary/10 bg-primary/5 scale-[0.99]' : ''
              ]">

              <!-- Aperçue -->
              <div v-if="!form.evidence"
                class="w-16 h-16 bg-ash/10 rounded-2xl flex items-center justify-center text-hsa group-hover:text-primary transition-colors">
                <IconCloudUpload class="w-8 h-8" />
              </div>
              <div v-else class="relative w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-2 border-WtB">
                <img v-if="isImage" :src="previewUrl" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-ash/20 flex flex-col items-center justify-center">
                  <IconFileTypePdf class="w-10 h-10 text-danger" />
                  <span class="text-[8px] font-black uppercase mt-1">PDF</span>
                </div>
                <div
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <IconRefresh class="w-6 h-6 text-white" />
                </div>
              </div>

              <div class="text-center">
                <p v-if="!form.evidence" class="text-sm font-bold text-BtW">
                  Glissez-déposez ou <span class="text-primary">parcourez</span>
                </p>
                <p v-else class="text-sm font-bold text-success truncate max-w-[250px]">
                  {{ form.evidence.name }}
                </p>
                <p class="text-[10px] text-hsa font-bold uppercase tracking-widest mt-1">
                  {{ form.evidence ? (form.evidence.size / 1024 / 1024).toFixed(2) + ' MB'
                    : 'Formats supportés: PNG, JPG, PDF (3Mo max)' }}
                </p>
              </div>
            </div>
            <input type="file" ref="fileInput" class="hidden" accept="image/*,.pdf" @change="handleFileChange" />
          </div>
        </div>
      </div>

      <div class="pt-4 flex gap-4">
        <UiBaseButton variant="ghost" class="flex-1 !rounded-2xl font-bold" @click="closeModal">Annuler</UiBaseButton>
        <UiBaseButton variant="primary" class="flex-1 !rounded-2xl font-black tracking-widest shadow-xl"
          :loading="submitting || store.loading" @click="submit">
          {{ isEditMode ? 'Enregistrer' : 'Publier l\'alerte' }}
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>

  <!-- Modal d'erreur -->
  <ModalGlobalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage"
    :file-name="errorFileName" :file-type="errorFileType" :file-size="errorFileSize"
    :accepted-formats="'JPG, PNG, PDF (Max 3 Mo)'" @close="showFileError = false" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { IconChevronDown, IconCloudUpload, IconAlertTriangle, IconMapPin, IconFileTypePdf, IconRefresh } from '@tabler/icons-vue'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { useToastStore } from '~/stores/front/toast'
import { useGlobalDropZone } from '~/composables/useDropZone'
import type { CreateIncidentRequest, Incident } from '~/types/vigitech'

const props = defineProps<{
  show: boolean
  incident?: Incident | null
}>()

const isEditMode = computed(() => !!props.incident)

const emit = defineEmits(['close', 'success'])
const store = useUserVigitechStore()
const toast = useToastStore()
const { enable, disable } = useGlobalDropZone()

// État initial du formulaire
const form = ref<CreateIncidentRequest>({
  title: '',
  description: '',
  type: 'phishing',
  threat_level: 'medium',
  is_anonymous: false,
  location: '',
  evidence: null
})

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string>('')
const isOver = ref(false)

// Gestion des fichiers et validation
const isImage = computed(() => form.value.evidence?.type.startsWith('image/'))
const MAX_FILE_SIZE = 3 * 1024 * 1024 // Limite de 3 Mo

/**
 * Déclenche l'explorateur de fichiers natif
 */
const triggerFileUpload = () => fileInput.value?.click()

/**
 * Traite le changement de fichier via l'input
 */
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    processFile(target.files[0])
  }
}

/**
 * Callback pour la DropZone globale
 */
const onDroppedFile = (file: File) => {
  if (props.show && !store.loading) {
    processFile(file)
  }
}

// Gestion des erreurs d'upload
const showFileError = ref(false)
const fileErrorTitle = ref('')
const fileErrorMessage = ref('')
const errorFileName = ref('')
const errorFileType = ref('')
const errorFileSize = ref('')

/**
 * Affiche la modale d'erreur pour un fichier invalide
 */
const showError = (title: string, message: string, file: File) => {
  fileErrorTitle.value = title
  fileErrorMessage.value = message
  errorFileName.value = file.name
  errorFileType.value = file.name.split('.').pop()?.toUpperCase() || '?'
  errorFileSize.value = (file.size / 1024 / 1024).toFixed(2) + ' MB'
  showFileError.value = true
}

/**
 * Valide le type et la taille du fichier avant de l'accepter
 */
const processFile = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    showError('Format non supporté', 'Veuillez sélectionner une image (JPG, PNG) ou un fichier PDF.', file)
    return
  }
  if (file.size > MAX_FILE_SIZE) {
    showError('Fichier trop lourd', 'La taille maximale autorisée est de 3 Mo.', file)
    return
  }

  form.value.evidence = file
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  if (file.type.startsWith('image/')) {
    previewUrl.value = URL.createObjectURL(file)
  } else {
    previewUrl.value = ''
  }
}

const closeModal = () => {
  emit('close')
}

/**
 * Soumet le formulaire (création ou mise à jour) vers le store Vigitech
 */
const submitting = ref(false)
const submit = async () => {
  if (!form.value.title || !form.value.description) {
    toast.showToast('error', 'Champs requis', 'Veuillez remplir le titre et la description.')
    return
  }

  submitting.value = true

  if (isEditMode.value && props.incident) {
    // Mode édition
    try {
      const result = await store.updateIncident(props.incident.id, {
        title: form.value.title,
        description: form.value.description,
        type: form.value.type,
        threat_level: form.value.threat_level,
        is_anonymous: form.value.is_anonymous,
        location: form.value.location
      })
      if (result.success) {
        toast.showToast('success', 'Incident modifié', result.message || 'L\'incident a été mis à jour avec succès.')
        emit('success')
        emit('close')
        resetForm()
      } else {
        toast.showToast('error', 'Erreur', result.message || 'Impossible de mettre à jour l\'incident.')
      }
    } catch (err: any) {
      toast.showToast('error', 'Erreur', err.data?.message || err.message || 'Une erreur inattendue est survenue.')
    }
  } else {
    // Mode création
    const result = await store.createIncident(form.value)
    if (result) {
      emit('success')
      emit('close')
      resetForm()
    }
  }
  submitting.value = false
}

/**
 * Réinitialise les champs du formulaire et les URLs de prévisualisation
 */
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    type: 'phishing',
    threat_level: 'medium',
    is_anonymous: false,
    location: '',
    evidence: null
  }
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}

// Intégration du hook DropZone globale
watch(() => props.show, (isVisible) => {
  if (isVisible) {
    enable(onDroppedFile)
    // Pré-remplissage en mode édition
    if (props.incident) {
      form.value = {
        title: props.incident.title,
        description: props.incident.description,
        type: props.incident.type,
        threat_level: props.incident.threat_level,
        is_anonymous: !!props.incident.is_anonymous,
        // is_anonymous: String(props.incident.is_anonymous) === 'true' || String(props.incident.is_anonymous) === '1',
        location: props.incident.location || '',
        evidence: null
      }
    }
  } else {
    disable(onDroppedFile)
  }
})

// Nettoyage lors de la destruction
onUnmounted(() => {
  disable(onDroppedFile)
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>
