<template>
  <UiBaseModal :show="show" title="Suppression du compte" @close="closeModal">
    <div class="space-y-6">

      <!-- Step 1: Conditions -->
      <div v-if="step === 1" class="space-y-4">
        <div class="p-4 bg-danger/5 border border-danger/20 rounded-xl flex gap-4">
          <IconAlertTriangle class="w-6 h-6 text-danger shrink-0" />
          <div class="text-sm text-BtW space-y-2">
            <p class="font-bold text-danger">Action irréversible (après délai)</p>
            <ul class="list-disc list-inside space-y-1 text-hsa ml-1">
              <li>Suppression définitive après <strong>48 heures</strong>.</li>
              <li>Possibilité d'annuler la suppression en vous reconnectant avant ce délai.</li>
              <li>Les documents authentifiés resteront valides et vérifiables publiquement.</li>
              <li>Vos contributions aux incidents seront anonymisées mais conservées.</li>
              <li>Toutes les autres données de profil seront perdues.</li>
            </ul>
          </div>
        </div>
        <div class="flex justify-end">
          <UiBaseButton variant="primary" @click="nextStep">
            J'accepte ces conditions
          </UiBaseButton>
        </div>
      </div>

      <!-- Step 2: Verification -->
      <div v-else-if="step === 2" class="space-y-4">
        <div class="bg-primary/5 p-4 rounded-xl border border-primary/10">
          <p class="text-sm text-BtW font-medium">Vérification de sécurité</p>
          <p class="text-xs text-hsa mt-1">
            Vous disposez actuellement de <strong class="text-primary">{{ profilStore.statistics?.total_documents || 0
            }}</strong> documents et
            <strong class="text-primary">{{ profilStore.statistics?.total_incidents || 0 }}</strong> incidents.
          </p>
          <p class="text-xs text-hsa mt-2">
            Veuillez saisir ces nombres pour continuer.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-xs font-bold text-hsa uppercase">Documents</label>
            <input type="number" v-model="verificationStats.documents" placeholder="0"
              class="w-full px-4 py-3 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none font-mono text-center font-bold" />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold text-hsa uppercase">Incidents</label>
            <input type="number" v-model="verificationStats.incidents" placeholder="0"
              class="w-full px-4 py-3 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none font-mono text-center font-bold" />
          </div>
        </div>

        <div v-if="profilStore.statistics" class="text-xs text-center">
          <span v-if="isValidStats" class="text-success font-bold flex items-center justify-center gap-1">
            <IconCheck class="w-4 h-4" /> Correspondance validée
          </span>
          <span v-else class="text-hsa opacity-50">
            En attente de validation...
          </span>
        </div>

        <div class="flex justify-end">
          <UiBaseButton variant="primary" :disabled="!isValidStats" @click="nextStep">
            Valider les statistiques
          </UiBaseButton>
        </div>
      </div>

      <!-- Step 3: Password Confirmation -->
      <div v-else-if="step === 3" class="space-y-4">
        <p class="text-sm text-hsa font-medium">
          Dernière étape : saisissez votre mot de passe pour lancer la suppression.
        </p>

        <div class="space-y-2">
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Votre mot de passe actuel"
              class="w-full pl-4 pr-10 py-3 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-danger outline-none"
              @keyup.enter="confirmDelete" />
            <button @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-hsa hover:text-BtW focus:outline-none">
              <component :is="showPassword ? IconEyeOff : IconEye" class="w-5 h-5" />
            </button>
          </div>
          <p v-if="error" class="text-xs text-danger font-bold flex items-center gap-1">
            <IconX class="w-3 h-3" /> {{ error }}
          </p>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <UiBaseButton variant="ghost" @click="closeModal" :disabled="loading">
            Annuler
          </UiBaseButton>
          <UiBaseButton variant="danger" :loading="loading" :disabled="!password" @click="confirmDelete">
            Confirmer la suppression
          </UiBaseButton>
        </div>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { IconAlertTriangle, IconCheck, IconX, IconEye, IconEyeOff } from '@tabler/icons-vue'
import { useProfilStore } from '~/stores/profil'
import { useToastStore } from '~/stores/toast'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

const profilStore = useProfilStore()
const toastStore = useToastStore()
const step = ref(1)
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const verificationStats = reactive({
  documents: null as number | null,
  incidents: null as number | null
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    resetState()
    profilStore.fetchProfile()
  }
})

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

const nextStep = () => {
  if (step.value === 1) {
    step.value = 2
  } else if (step.value === 2) {
    if (isValidStats.value) {
      step.value = 3
    }
  }
}

const isValidStats = computed(() => {
  if (!profilStore.statistics) return false
  return verificationStats.documents === profilStore.statistics.total_documents &&
    verificationStats.incidents === profilStore.statistics.total_incidents
})

const confirmDelete = async () => {
  if (!password.value) return

  loading.value = true
  error.value = null

  const success = await profilStore.deleteAccount(password.value)
  if (!success) {
    error.value = profilStore.error || 'Mot de passe incorrect ou erreur serveur.'
    toastStore.showToast('error', 'Erreur', error.value)
  } else {
    toastStore.showToast('success', 'Compte supprimé', profilStore.message || 'Votre demande de suppression a été prise en compte.')
    closeModal()
  }
  // On success, store handles logout/redirect
  loading.value = false
}
</script>
