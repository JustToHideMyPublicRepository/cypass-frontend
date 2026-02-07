<template>
  <UiBaseModal :show="show" title="Suppression du compte" @close="closeModal">
    <div class="space-y-8 py-2">

      <!-- Étape 1 : Conditions et Impact -->
      <div v-if="step === 1" class="space-y-6 animate-fade-in">
        <div class="p-6 bg-danger/5 border-2 border-danger/10 rounded-[2rem] flex gap-5 shadow-inner backdrop-blur-sm">
          <div class="shrink-0 p-3 bg-danger/10 rounded-2xl h-fit text-danger shadow-xl shadow-danger/5">
            <IconAlertTriangle class="w-8 h-8" />
          </div>
          <div class="text-sm space-y-4">
            <p class="font-black text-danger uppercase tracking-widest text-base">Action de Haute Sécurité</p>
            <ul class="space-y-3 text-hsa font-medium">
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-danger/40 mt-1.5 shrink-0"></span>
                <span>Suppression définitive effective après un délai de <strong>48 heures</strong>.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-danger/40 mt-1.5 shrink-0"></span>
                <span>Possibilité d'annuler la procédure en vous reconnectant avant l'échéance.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-danger/40 mt-1.5 shrink-0"></span>
                <span>Les documents authentifiés resteront valides sur le réseau pour préserver l'intégrité de la
                  chaîne.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-danger/40 mt-1.5 shrink-0"></span>
                <span>Toutes vos autres données de profil et préférences seront définitivement effacées.</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-ash/50">
          <UiBaseButton variant="ghost" @click="closeModal" v-tooltip="getLinkTooltip('modal_cancel')"
            class="!rounded-2xl border-none font-bold">
            Conserver mon compte
          </UiBaseButton>
          <UiBaseButton variant="primary" @click="nextStep" v-tooltip="getLinkTooltip('modal_next')"
            class="!rounded-2xl font-black tracking-widest shadow-xl">
            J'ai compris les risques
          </UiBaseButton>
        </div>
      </div>

      <!-- Étape 2 : Validation des Statistiques -->
      <div v-else-if="step === 2" class="space-y-6 animate-fade-in">
        <div class="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 shadow-inner">
          <p class="text-sm text-BtW font-black uppercase tracking-widest mb-2">Vérification de sécurité</p>
          <p class="text-xs text-hsa leading-relaxed font-medium">
            Pour confirmer votre identité, veuillez saisir le nombre exact d'éléments liés à votre compte.
            Actuellement : <strong class="text-primary">{{ profilStore.statistics?.total_documents || 0 }}</strong>
            documents certifiés et
            <strong class="text-primary">{{ profilStore.statistics?.total_incidents || 0 }}</strong> incidents reportés.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Documents</label>
            <input type="number" v-model="verificationStats.documents" placeholder="0"
              class="input font-code text-center text-lg font-black" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Incidents</label>
            <input type="number" v-model="verificationStats.incidents" placeholder="0"
              class="input font-code text-center text-lg font-black" />
          </div>
        </div>

        <div v-if="profilStore.statistics" class="text-[10px] text-center h-4">
          <span v-if="isValidStats"
            class="text-success font-black uppercase tracking-widest flex items-center justify-center gap-2 animate-bounce">
            <IconCheck class="w-4 h-4" /> Correspondance exacte
          </span>
          <span v-else class="text-hsa/40 font-bold uppercase tracking-widest">
            En attente de saisie exacte...
          </span>
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-ash/50">
          <UiBaseButton variant="ghost" @click="closeModal" v-tooltip="getLinkTooltip('modal_cancel')"
            class="!rounded-2xl border-none font-bold">
            Annuler
          </UiBaseButton>
          <UiBaseButton variant="primary" :disabled="!isValidStats" @click="nextStep"
            v-tooltip="getLinkTooltip('modal_next')" class="!rounded-2xl font-black tracking-widest shadow-xl">
            Étape finale
          </UiBaseButton>
        </div>
      </div>

      <!-- Étape 3 : Confirmation par Mot de Passe -->
      <div v-else-if="step === 3" class="space-y-6 animate-fade-in">
        <div class="p-6 bg-ash/30 rounded-[2rem] border border-ashAct/30">
          <p class="text-sm text-hsa font-medium leading-relaxed">
            Dernière confirmation requise. Saisissez votre mot de passe pour initier la suppression irréversible de
            votre compte CYPASS.
          </p>
        </div>

        <div class="space-y-3">
          <div class="relative group">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Mot de passe actuel"
              class="input pr-14 !border-danger/30 focus:!ring-danger/20" @keyup.enter="confirmDelete" />
            <UiBaseButton @click="showPassword = !showPassword" variant="ghost"
              class="!absolute !right-2 !top-1/2 !-translate-y-1/2 text-hsa hover:!text-BtW !rounded-xl !p-2 !h-auto !w-auto !bg-transparent">
              <component :is="showPassword ? IconEyeOff : IconEye" class="w-5 h-5" />
            </UiBaseButton>
          </div>
          <div class="h-6">
            <p v-if="error"
              class="text-[10px] text-danger font-black uppercase tracking-widest flex items-center gap-2 animate-shake pl-1">
              <IconX class="w-4 h-4" /> {{ error }}
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-ash/50">
          <UiBaseButton variant="ghost" @click="closeModal" :disabled="loading"
            v-tooltip="getLinkTooltip('modal_cancel')" class="!rounded-2xl border-none font-bold">
            Annuler
          </UiBaseButton>
          <UiBaseButton variant="danger" :loading="loading" :disabled="!password" @click="confirmDelete"
            v-tooltip="getLinkTooltip('modal_confirm')"
            class="!rounded-2xl font-black tracking-widest shadow-2xl shadow-danger/20">
            Confirmer la suppression
          </UiBaseButton>
        </div>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { IconAlertTriangle, IconCheck, IconX, IconEye, IconEyeOff } from '@tabler/icons-vue'
import { useProfilStore } from '~/stores/profil'
import { useToastStore } from '~/stores/toast'
import { useShortcutsStore } from '~/stores/shortcuts'
import { getLinkTooltip } from '~/data/shortcuts'

// Propriétés de la modale SettingDelete
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

const profilStore = useProfilStore()
const toastStore = useToastStore()
const shortcutStore = useShortcutsStore()

// États locaux de navigation et validation
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
 * Gère les raccourcis clavier globaux lors de l'interaction
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.show) return
  const key = e.key.toLowerCase()

  // 'N' pour annuler (hors champs de saisie)
  if (key === 'n') {
    const isTyping = document.activeElement instanceof HTMLInputElement
    if (!isTyping) {
      e.preventDefault()
      closeModal()
      return
    }
  }

  // 'Enter' pour avancer
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

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Réinitialise et rafraîchit les données à chaque ouverture
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetState()
    profilStore.fetchProfile()
  }
})

/**
 * Remet à zéro toutes les variables de contrôle
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

const closeModal = () => {
  emit('close')
  resetState()
}

/**
 * Passe à l'étape suivante du flux de suppression
 */
const nextStep = () => {
  if (step.value === 1) {
    step.value = 2
  } else if (step.value === 2) {
    if (isValidStats.value) {
      step.value = 3
    }
  }
}

/**
 * Valide que les nombres saisis correspondent aux stats réelles du profil
 */
const isValidStats = computed(() => {
  if (!profilStore.statistics) return false
  return verificationStats.documents === profilStore.statistics.total_documents &&
    verificationStats.incidents === profilStore.statistics.total_incidents
})

/**
 * Exécute la requête finale de suppression vers l'API
 */
const confirmDelete = async () => {
  if (!password.value) return

  loading.value = true
  error.value = null

  const success = await profilStore.deleteAccount(password.value)
  if (!success) {
    error.value = profilStore.error || 'Mot de passe incorrect ou erreur réseau.'
    toastStore.showToast('error', 'Erreur de validation', error.value)
  } else {
    toastStore.showToast('success', 'Suppression programmée', profilStore.message || 'Votre demande a été enregistrée. Le compte sera supprimé dans 48h.')
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
