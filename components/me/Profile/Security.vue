<template>
  <div class="space-y-6">
    <UiBaseCard title="Sécurité et Accès" class="border-l-4 border-l-warning">
      <div class="space-y-6">
        <!-- Change Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiBaseButton @click="showEmailModal = true" variant="ghost"
            class="!flex !items-center !justify-between !p-4 !rounded-xl !bg-ash border border-ashAct hover:!border-primary/50 transition-all group !h-auto w-full">
            <div class="flex items-center gap-3 text-left">
              <div class="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <IconMail class="w-5 h-5 text-primary" />
              </div>
              <div class="text-left">
                <p class="font-bold text-BtW">Adresse email</p>
                <p class="text-xs text-hsa">Changer votre email de connexion</p>
              </div>
            </div>
            <IconChevronRight class="w-5 h-5 text-hsa group-hover:text-primary transition-colors" />
          </UiBaseButton>

          <UiBaseButton @click="showPasswordModal = true" variant="ghost"
            class="!flex !items-center !justify-between !p-4 !rounded-xl !bg-ash border border-ashAct hover:!border-warning/50 transition-all group !h-auto w-full">
            <div class="flex items-center gap-3 text-left">
              <div class="p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-colors">
                <IconLock class="w-5 h-5 text-warning" />
              </div>
              <div class="text-left">
                <p class="font-bold text-BtW">Mot de passe</p>
                <p class="text-xs text-hsa">Sécurisez votre compte</p>
              </div>
            </div>
            <IconChevronRight class="w-5 h-5 text-hsa group-hover:text-warning transition-colors" />
          </UiBaseButton>
        </div>

        <hr class="border-ashAct" />

        <!-- 2FA -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-BtW">Double Authentification (2FA)</h3>
            <p class="text-sm text-hsa">Sécurisez votre compte avec une étape supplémentaire.</p>
          </div>
          <div class="flex items-center gap-3">
            <UiLogoLoader v-if="loadingMfa" size="xs" />
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="mfaEnabled" class="sr-only peer" :disabled="loadingMfa">
              <div class="input-toggle-slider">
              </div>
            </label>
          </div>
        </div>
      </div>
    </UiBaseCard>

    <!-- Modals -->
    <ModalProfileEmail :show="showEmailModal" :loading="profilStore.loading" @close="showEmailModal = false"
      @submit="handleEmailUpdate" />

    <ModalProfilePassword :show="showPasswordModal" :loading="profilStore.loading" @close="showPasswordModal = false"
      @submit="handlePasswordUpdate" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconMail, IconLock, IconChevronRight } from '@tabler/icons-vue'
import { useProfilStore } from '~/stores/back/user/profil'
import { useToastStore } from '~/stores/front/toast'

const profilStore = useProfilStore()
const toastStore = useToastStore()

const showEmailModal = ref(false)
const showPasswordModal = ref(false)
const loadingMfa = ref(false)

const mfaEnabled = computed({
  get: () => profilStore.profile?.mfa_enabled ?? false,
  set: async (val) => {
    loadingMfa.value = true
    const success = await profilStore.toggleMfa(val)

    if (success) {
      toastStore.showToast('success', 'Sécurité mise à jour', `La double authentification est désormais ${val ? 'activée' : 'désactivée'}.`)
    } else {
      toastStore.showToast('error', 'Erreur', profilStore.error || 'Impossible de modifier le paramètre MFA.')
    }
    loadingMfa.value = false
  }
})

const handleEmailUpdate = async (data: any) => {
  const success = await profilStore.changeEmail(data.newEmail, data.password)
  if (success) {
    toastStore.showToast('success', 'Email modifié', profilStore.message || 'Vérifiez votre nouvelle adresse.')
    showEmailModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur', profilStore.error || 'Échec du changement d\'email.')
  }
}

const handlePasswordUpdate = async (data: any) => {
  const success = await profilStore.changePassword(data.current, data.new, data.confirm)
  if (success) {
    toastStore.showToast('success', 'Mot de passe mis à jour', profilStore.message || 'Votre mot de passe a été changé.')
    showPasswordModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur', profilStore.error || 'Échec du changement de mot de passe.')
  }
}
</script>
