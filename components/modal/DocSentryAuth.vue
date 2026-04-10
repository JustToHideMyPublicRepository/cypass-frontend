<template>
  <UiBaseModal :show="show" title="Authentifier un document" maxWidth="2xl" @close="$emit('close')">
    <div class="max-h-[60vh] overflow-y-auto pr-2 no-scrollbar space-y-6 py-2">
      <!-- Zone de dépôt de fichier -->
      <div v-if="!file"
        class="relative border-4 border-dashed border-primary/10 rounded-[2.5rem] p-12 text-center hover:border-primary/40 transition-all cursor-pointer bg-ash/20 hover:bg-primary/5 group overflow-hidden"
        @click="triggerFileSelect">

        <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">

        <div class="pointer-events-none relative z-10">
          <div
            class="w-20 h-20 bg-WtB rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-ash">
            <IconUpload class="w-10 h-10" />
          </div>
          <p class="text-xl font-black text-BtW tracking-tighter">Cliquez ou glissez un fichier</p>
          <p class="text-[10px] text-hsa mt-2 font-black tracking-widest opacity-60">PDF uniquement • Max 3 Mo
          </p>
        </div>

        <!-- Effet de background subtil au survol -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        </div>
      </div>

      <!-- Aperçu du fichier sélectionné -->
      <div v-else class="bg-ash/30 rounded-[2rem] p-5 border border-ashAct/30 backdrop-blur-sm">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <IconFileText class="w-7 h-7" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-black text-BtW truncate text-sm tracking-tight">{{ file.name }}</p>
            <p class="text-[10px] text-hsa font-bold tracking-widest opacity-70">{{ (file.size / 1024 /
              1024).toFixed(2) }} MB</p>
          </div>
          <UiBaseButton @click="file = null" variant="ghost"
            class="!text-hsa hover:!text-danger !p-3 !h-auto !w-auto !rounded-xl transition-colors">
            <IconX class="w-6 h-6" />
          </UiBaseButton>
        </div>
      </div>

      <!-- Résultat de l'authentification -->
      <div v-if="uploadResult" class="space-y-6">
        <div
          class="p-6 rounded-[2rem] bg-success/5 border-2 border-success/20 animate-fade-up shadow-lg shadow-success/5">
          <div class="flex items-center gap-4 text-success mb-5">
            <div class="p-2 bg-success/10 rounded-xl">
              <IconCircleCheck class="w-6 h-6" />
            </div>
            <span class="font-black text-sm tracking-widest">Document certifié avec succès</span>
          </div>

          <div class="space-y-4 text-[11px]">
            <div class="flex justify-between items-center py-2 border-b border-success/10">
              <span class="text-hsa font-bold tracking-widest">ID Document</span>
              <span class="font-code text-BtW bg-success/5 px-2 py-1 rounded-lg border border-success/10">{{
                uploadResult.document_id }}</span>
            </div>

            <div class="space-y-1.5 pt-1">
              <div class="flex justify-between items-center group/hash">
                <span class="text-hsa font-bold tracking-widest">Hash (SHA-256)</span>
                <UiBaseButton @click="copyHash(uploadResult.doc_hash)" variant="ghost"
                  class="!p-1.5 hover:!bg-primary/10 text-primary rounded-lg transition-all !h-auto !w-auto flex items-center gap-2"
                  title="Copier le hash">
                  <span class="text-[9px] font-black uppercase">{{ copied ? 'Copié' : 'Copier' }}</span>
                  <IconCopy v-if="!copied" class="w-3.5 h-3.5" />
                  <IconCheck v-else class="w-3.5 h-3.5 text-success" />
                </UiBaseButton>
              </div>
              <div
                class="font-code text-BtW break-all bg-WtB/50 p-3 rounded-xl border border-ashAct/30 leading-relaxed shadow-sm">
                {{ uploadResult.doc_hash }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 py-3">
              <div class="p-3 bg-ash/20 rounded-xl border border-ashAct/20">
                <span class="text-[9px] text-hsa font-black block mb-1">Algorithme</span>
                <span class="font-black text-BtW uppercase">{{ uploadResult.cryptographic_proof.algorithm }}</span>
              </div>
              <div class="p-3 bg-ash/20 rounded-xl border border-ashAct/20 text-right">
                <span class="text-[9px] text-hsa font-black block mb-1">Empreinte Clé</span>
                <span class="font-code text-BtW">{{ uploadResult.cryptographic_proof.key_fingerprint }}</span>
              </div>
            </div>

            <div class="space-y-2 mt-2">
              <p class="text-[10px] text-hsa font-black tracking-[0.2em] ml-1">Signature Numérique</p>
              <p
                class="font-code text-[10px] text-BtW break-all bg-WtB/50 p-4 rounded-2xl border border-ashAct/30 shadow-inner">
                {{ uploadResult.cryptographic_proof.digital_signature }}
              </p>
            </div>
          </div>
        </div>

        <!-- Section Multi-version (Génération de versions enfants) -->
        <div v-if="!multiVersionSuccess" class="animate-fade-up" style="animation-delay: 0.2s;">
          <button @click="showMultiVersion = !showMultiVersion"
            class="w-full flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/20 hover:bg-primary/10 transition-all text-primary">
            <div class="flex items-center gap-3">
              <IconFiles class="w-5 h-5" />
              <span class="font-black text-xs tracking-widest uppercase">Générer des versions personnalisées</span>
            </div>
            <IconChevronDown class="w-5 h-5 transition-transform" :class="{ 'rotate-180': showMultiVersion }" />
          </button>

          <div v-if="showMultiVersion" class="mt-4 p-6 bg-ash/20 rounded-[2rem] border border-ashAct/30 space-y-6">
            <div class="flex p-1 bg-ash/30 rounded-xl border border-ashAct/20">
              <button @click="multiVersionType = 'csv'"
                class="flex-1 py-2 px-4 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all"
                :class="multiVersionType === 'csv' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
                Via Fichier CSV
              </button>
              <button @click="multiVersionType = 'manual'"
                class="flex-1 py-2 px-4 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all"
                :class="multiVersionType === 'manual' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
                Saisie Manuelle
              </button>
            </div>

            <!-- Upload CSV -->
            <div v-if="multiVersionType === 'csv'" class="space-y-4">
              <div v-if="!csvFile"
                class="border-2 border-dashed border-primary/20 rounded-2xl p-8 text-center bg-WtB/50 hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer group"
                @click="triggerCsvSelect">
                <input type="file" ref="csvInput" class="hidden" accept=".csv" @change="handleCsvChange">
                <IconCloudUpload
                  class="w-8 h-8 text-primary/40 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p class="text-[11px] font-bold text-BtW">Cliquez pour importer votre CSV</p>
                <p class="text-[9px] text-hsa mt-1 uppercase tracking-tighter">Noms des destinataires uniquement</p>
              </div>
              <div v-else class="flex items-center gap-4 bg-WtB/50 p-4 rounded-xl border border-primary/20">
                <IconFileDescription class="w-6 h-6 text-primary" />
                <span class="flex-1 text-xs font-bold text-BtW truncate">{{ csvFile.name }}</span>
                <button @click="csvFile = null" class="text-hsa hover:text-danger p-1">
                  <IconX class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Saisie Manuelle -->
            <div v-if="multiVersionType === 'manual'" class="space-y-2">
              <label class="text-[10px] text-hsa font-black tracking-widest uppercase ml-1">Noms des
                destinataires</label>
              <textarea v-model="recipientsManual" placeholder="Ex: Jean Dupont, Alice Martin, Bob Smith..."
                class="w-full bg-WtB border border-ashAct/30 rounded-2xl p-4 text-xs font-medium text-BtW placeholder:text-hsa/50 focus:outline-none focus:ring-2 focus:ring-primary/20 h-24 no-scrollbar resize-none"></textarea>
              <p class="text-[9px] text-hsa font-medium italic">* Séparez les noms par des virgules</p>
            </div>

            <UiBaseButton variant="primary" class="w-full !rounded-xl font-black py-3 h-auto shadow-lg"
              :loading="multiVersionLoading" :disabled="!isMultiVersionValid" @click="handleMultiVersionSubmit">
              Lancer la génération
            </UiBaseButton>
          </div>
        </div>

        <!-- Succès Multi-version -->
        <div v-else
          class="p-6 rounded-[2rem] bg-primary/5 border-2 border-primary/20 animate-bounce-in flex flex-col items-center text-center">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <IconRocket class="w-8 h-8" />
          </div>
          <h4 class="font-black text-BtW text-sm mb-2 uppercase tracking-tighter">Traitement lancé !</h4>
          <p class="text-[11px] text-hsa font-medium leading-relaxed">
            Les versions enfants sont en cours de génération. <br>
            Vous recevrez une notification dès que l'archive sera prête.
          </p>
        </div>
      </div>

      <!-- État de chargement (Progression) -->
      <div v-if="loading && !uploadResult" class="py-4 animate-fade-in">
        <div class="mb-6 p-6 bg-primary/5 rounded-[2rem] border-2 border-primary/10 shadow-xl shadow-primary/5">
          <p class="text-xs font-black text-primary tracking-[0.2em] mb-6 flex items-center gap-3">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Certification en cours sur la Blockchain
          </p>
          <UtilsStepProgress :steps="activeSteps" />
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="error"
        class="p-5 rounded-[1.5rem] bg-danger/5 border-2 border-danger/20 text-danger text-sm flex items-center gap-4 animate-shake">
        <div class="p-2 bg-danger/10 rounded-xl">
          <IconAlertCircle class="w-6 h-6 shrink-0" />
        </div>
        <p class="font-bold">{{ error }}</p>
      </div>
    </div>

    <!-- Actions du pied de page -->
    <template #footer>
      <div v-if="uploadResult" class="w-full">
        <UiBaseButton variant="primary" class="w-full !rounded-2xl font-black py-4 h-auto shadow-xl" @click="close">
          D'accord
        </UiBaseButton>
      </div>
      <div v-else class="flex flex-col sm:flex-row gap-4 w-full">
        <UiBaseButton variant="ghost" class="flex-1 !rounded-2xl font-bold py-4 h-auto border-none" @click="close">
          Annuler
        </UiBaseButton>
        <UiBaseButton variant="primary" class="flex-1 !rounded-2xl font-black py-4 h-auto shadow-xl" :loading="loading"
          :disabled="!file" @click="handleUpload">
          Signer le document
        </UiBaseButton>
      </div>
    </template>
  </UiBaseModal>

  <!-- Modale d'erreur de fichier -->
  <ModalGlobalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage"
    :file-name="errorFileName" :file-type="errorFileType" :file-size="errorFileSize"
    :accepted-formats="'PDF uniquement (Max 3 Mo)'" @close="showFileError = false" />
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import {
  IconUpload, IconFileText, IconCircleCheck, IconAlertCircle, IconX,
  IconCopy, IconCheck, IconFiles, IconChevronDown, IconCloudUpload,
  IconFileDescription, IconRocket
} from '@tabler/icons-vue'
import { authSteps, type Step } from '~/utils/docsentry'
import { useGlobalDropZone } from '~/composables/useDropZone'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'

// Propriétés de la modale DocSentryAuth
const props = defineProps<{
  show: boolean
  loading: boolean
  error: string | null
  uploadResult: any
}>()

const emit = defineEmits(['close', 'upload', 'update:error', 'error-clear'])

const docsentryStore = useUserDocsentryStore()

// États locaux
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const copied = ref(false)
const activeSteps = ref<Step[]>(JSON.parse(JSON.stringify(authSteps)))

// États Multi-version
const showMultiVersion = ref(false)
const multiVersionType = ref<'csv' | 'manual'>('csv')
const csvFile = ref<File | null>(null)
const csvInput = ref<HTMLInputElement | null>(null)
const recipientsManual = ref('')
const multiVersionLoading = ref(false)
const multiVersionSuccess = ref(false)

const isMultiVersionValid = computed(() => {
  if (multiVersionType.value === 'csv') return !!csvFile.value
  return recipientsManual.value.trim().length > 0
})

const triggerCsvSelect = () => csvInput.value?.click()

const handleCsvChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    csvFile.value = target.files[0]
  }
}

const handleMultiVersionSubmit = async () => {
  if (!props.uploadResult?.document_id) return

  multiVersionLoading.value = true
  try {
    const success = await docsentryStore.generateMultiVersion({
      document_id: props.uploadResult.document_id,
      recipients_csv: multiVersionType.value === 'csv' ? csvFile.value! : undefined,
      recipients_manual: multiVersionType.value === 'manual' ? recipientsManual.value : undefined
    })

    if (success) {
      multiVersionSuccess.value = true
    }
  } finally {
    multiVersionLoading.value = false
  }
}

const { enable, disable } = useGlobalDropZone()

// Gestion des fichiers déposés via le DropZone global
const onDroppedFile = (droppedFile: File) => {
  if (!props.loading) {
    if (validateFile(droppedFile)) {
      file.value = droppedFile
      emit('error-clear')
    }
  }
}

// Surveillance de la visibilité pour activer/désactiver le DropZone
watch(() => props.show, (newVal) => {
  if (newVal) {
    enable(onDroppedFile)
  } else {
    disable(onDroppedFile)
  }
}, { immediate: true })

onUnmounted(() => {
  disable(onDroppedFile)
})

// États pour la modale d'erreur spécifique au fichier
const showFileError = ref(false)
const fileErrorTitle = ref('Format non supporté')
const fileErrorMessage = ref('')
const errorFileName = ref('')
const errorFileType = ref('')
const errorFileSize = ref('')

/**
 * Affiche la modale d'erreur personnalisée
 */
const showError = (title: string, message: string, file: File) => {
  fileErrorTitle.value = title
  fileErrorMessage.value = message
  errorFileName.value = file.name
  errorFileType.value = file.name.split('.').pop()?.toUpperCase() || 'Inconnu'
  errorFileSize.value = (file.size / 1024 / 1024).toFixed(2) + ' Mo'
  showFileError.value = true
}

/**
 * Réinitialise les étapes de progression
 */
const resetSteps = () => {
  activeSteps.value = JSON.parse(JSON.stringify(authSteps))
}

/**
 * Simule visuellement l'avancement des étapes (pour l'UI)
 */
const runSteps = async () => {
  for (let i = 0; i < activeSteps.value.length; i++) {
    activeSteps.value[i].status = 'loading'
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
    activeSteps.value[i].status = 'completed'
  }
}

const triggerFileSelect = () => fileInput.value?.click()

/**
 * Validation robuste du fichier sélectionné
 */
const validateFile = (selectedFile: File): boolean => {
  emit('error-clear')

  if (selectedFile.type !== 'application/pdf') {
    showError(
      'Format non supporté',
      `Le fichier "${selectedFile.name}" n'est pas un PDF. Seuls les fichiers PDF sont acceptés pour l'authentification.`,
      selectedFile
    )
    emit('update:error', 'Seuls les fichiers PDF sont acceptés.')
    return false
  }

  if (selectedFile.size > 3 * 1024 * 1024) {
    showError(
      'Fichier trop volumineux',
      `Le fichier fait ${(selectedFile.size / 1024 / 1024).toFixed(2)} Mo. La taille maximale autorisée est de 3 Mo.`,
      selectedFile
    )
    emit('update:error', 'La taille du fichier ne doit pas dépasser 3 Mo.')
    return false
  }

  return true
}

/**
 * Gestion du changement d'input fichier standard
 */
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const selectedFile = target.files[0]
    if (validateFile(selectedFile)) {
      file.value = selectedFile
    } else {
      file.value = null
      if (fileInput.value) fileInput.value.value = ''
    }
  }
}

/**
 * Lance le processus d'upload et signature
 */
const handleUpload = async () => {
  if (file.value) {
    resetSteps()
    emit('upload', file.value)
    await runSteps()
  }
}

/**
 * Copie le hash dans le presse-papier
 */
const copyHash = (hash: string) => {
  navigator.clipboard.writeText(hash)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

/**
 * Ferme la modale et réinitialise l'état
 */
const close = () => {
  file.value = null
  copied.value = false
  showMultiVersion.value = false
  multiVersionSuccess.value = false
  csvFile.value = null
  recipientsManual.value = ''
  resetSteps()
  emit('close')
}
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
