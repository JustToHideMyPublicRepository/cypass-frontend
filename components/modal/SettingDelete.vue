<template>
  <UiBaseModal :show="show" title="Suppression du compte" @close="closeModal">
    <div class="space-y-8 py-2">

      <!-- Étape 1 : Conditions et Impact -->
      <ModalSettingDeleteStep1 v-if="step === 1" @cancel="closeModal" @next="nextStep" />

      <!-- Étape 2 : Validation des Statistiques -->
      <ModalSettingDeleteStep2 v-else-if="step === 2" v-model="verificationStats" :statistics="profilStore.statistics"
        :is-valid="isValidStats" @cancel="closeModal" @next="nextStep" />

      <!-- Étape 3 : Confirmation par Mot de Passe -->
      <ModalSettingDeleteStep3 v-else-if="step === 3" v-model:password="password" :show-password="showPassword"
        :error="error" :loading="loading" @toggle-password="showPassword = !showPassword" @cancel="closeModal"
        @confirm="confirmDelete" />
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useProfilStore } from '~/stores/profil'
import { useToastStore } from '~/stores/toast'

/**
 * Modale de suppression de compte orchestrant un processus en 3 étapes.
 */
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

const profilStore = useProfilStore()
const toastStore = useToastStore()

// États de navigation et données de validation
const step = ref(1)
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const verificationStats = reactive({
  documents: null as number | null,
  incidents: null as number | null
})

/**
 * Gère les raccourcis clavier pour une navigation fluide
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.show) return
  const key = e.key.toLowerCase()

  // Touche 'N' pour annuler (hors saisie active)
  if (key === 'n') {
    const isTyping = document.activeElement instanceof HTMLInputElement
    if (!isTyping) {
      e.preventDefault()
      closeModal()
      return
    }
  }

  // Touche 'Enter' pour valider l'étape
  if (key === 'enter') {
    if (step.value === 1) {
      e.preventDefault()
      nextStep()
    } else if (step.value === 2 && isValidStats.value) {
      e.preventDefault()
      nextStep()
    }
  }
}

// Installation des écouteurs de touches
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

// Rafraîchissement des données lors de l'ouverture
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetState()
    profilStore.fetchProfile()
  }
})

/**
 * Réinitialise complètement l'état de la modale
 */
const resetState = () => {
  step.value = 1
  password.value = ''
  showPassword.value = false
  verificationStats.documents = null
  verificationStats.incidents = null
  error.value = null
  loading.value = false
}

/**
 * Ferme la modale et réinitialise son état
 */
const closeModal = () => {
  emit('close')
  resetState()
}

/**
 * Avancement dans les étapes du processus
 */
const nextStep = () => {
  if (step.value === 1) step.value = 2
  else if (step.value === 2 && isValidStats.value) step.value = 3
}

/**
 * Vérification de la correspondance des statistiques saisies
 */
const isValidStats = computed(() => {
  if (!profilStore.statistics) return false
  return verificationStats.documents === profilStore.statistics.total_documents &&
    verificationStats.incidents === profilStore.statistics.total_incidents
})

/**
 * Validation finale et envoi de la requête de suppression
 */
const confirmDelete = async () => {
  if (!password.value) return

  loading.value = true
  error.value = null

  const success = await profilStore.deleteAccount(password.value)
  if (!success) {
    error.value = profilStore.error || 'Mot de passe incorrect ou erreur réseau.'
    toastStore.showToast('error', 'Échec de validation', error.value)
  } else {
    toastStore.showToast('success', 'Procédure lancée', profilStore.message || 'Suppression programmée sous 48h.')
    closeModal()
  }
  loading.value = false
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
