<template>
  <UiBaseModal :show="show" title="Ajouter une Passkey" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <div class="p-5 rounded-[1.5rem] bg-primary/5 border border-primary/20 backdrop-blur-sm">
        <div class="flex gap-4">
          <div class="shrink-0 p-2.5 bg-primary/10 rounded-xl h-fit text-primary shadow-inner">
            <IconExclamationCircle class="w-6 h-6" />
          </div>
          <p class="text-sm text-hsa font-medium leading-relaxed">
            Les Passkeys vous permettent de vous connecter en toute sécurité avec votre empreinte digitale, votre visage
            ou le code de votre appareil. C'est la méthode la plus rapide et la plus sûre.
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-BtW tracking-widest pl-1">Nom de la clé</label>
          <input v-model="keyName" type="text" placeholder="Ex: Mon iPhone, Clé USB..."
            class="w-full px-4 py-3 rounded-2xl bg-ash/5 border border-ashAct focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-BtW font-bold placeholder:text-hsa/30" />
        </div>

        <div class="p-4 rounded-2x border border-primary/20 bg-primary/5 flex items-start gap-3">
          <IconPasswordFingerprint class="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p class="text-[10px] font-medium text-BtW leading-relaxed">
            Une fois que vous aurez cliqué sur le bouton ci-dessous, votre navigateur vous demandera de confirmer votre
            identité.
          </p>
        </div>

        <UiBaseButton class="w-full" :loading="loading" :disabled="!keyName.trim()" @click="handleStartCeremony">
          <IconPasswordFingerprint class="w-4 h-4 mr-2" />
          Créer ma passkey
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconPasswordFingerprint, IconExclamationCircle } from '@tabler/icons-vue'
import { useSecurityStore } from '~/stores/back/user/security'
import { useProfilStore } from '~/stores/back/user/profil'
import { useToastStore } from '~/stores/front/toast'
import { prepareCreationOptions, prepareCredentialResponse } from '~/utils/webauthn'

const props = defineProps<{
  show: boolean
  loading: boolean
}>()

const emit = defineEmits(['close', 'success'])

const securityStore = useSecurityStore()
const profilStore = useProfilStore()
const toastStore = useToastStore()

const getDefaultName = () => {
  const firstName = profilStore.profile?.first_name || ''
  return firstName ? `CYPASS - ${firstName}` : 'CYPASS clé'
}

const keyName = ref(getDefaultName())

const handleStartCeremony = async () => {
  try {
    // 1. Get options from server
    const options = await securityStore.getPasskeyOptions()
    if (!options) throw new Error(securityStore.error || 'Erreur lors de la récupération des options.')

    // 2. Prepare options (convert base64url to Uint8Array)
    const publicKey = prepareCreationOptions(options)

    // 3. Trigger browser ceremony
    const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential
    if (!credential) throw new Error('Aucune information de clé reçue.')

    // 4. Prepare response (convert ArrayBuffers to base64url)
    const responseData = {
      ...prepareCredentialResponse(credential),
      alias: keyName.value,
      name: keyName.value
    }

    // 5. Register on server
    const result = await securityStore.registerPasskey(responseData)
    if (result) {
      toastStore.showToast('success', 'Passkey enregistrée', 'Votre clé de sécurité est maintenant active.')
      emit('success')
    } else {
      throw new Error(securityStore.error || 'Erreur lors de l\'enregistrement final.')
    }
  } catch (err: any) {
    if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
      toastStore.showToast('warning', 'Annulé', 'L\'enregistrement de la clé a été annulé.')
    } else {
      toastStore.showToast('error', 'Erreur', err.message || 'Une erreur est survenue lors de la création.')
    }
  }
}

// Reset naming when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    keyName.value = getDefaultName()
  }
})
</script>
