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
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer">
            <div
              class="w-11 h-6 bg-ash peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
            </div>
          </label>
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
import { ref } from 'vue'
import { IconMail, IconLock, IconChevronRight } from '@tabler/icons-vue'
import { useProfilStore } from '~/stores/profil'
import { useToastStore } from '~/stores/toast'

const profilStore = useProfilStore()
const toastStore = useToastStore()

const showEmailModal = ref(false)
const showPasswordModal = ref(false)

const handleEmailUpdate = async (data: any) => {
  const success = await profilStore.updateEmail(data.newEmail, data.password)
  if (success) {
    toastStore.showToast('success', 'Email modifié', profilStore.message || 'Vérifiez votre nouvelle adresse.')
    showEmailModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur', profilStore.error || 'Échec du changement d\'email.')
  }
}

const handlePasswordUpdate = async (data: any) => {
  const success = await profilStore.updatePassword(data.current, data.new, data.confirm)
  if (success) {
    toastStore.showToast('success', 'Mot de passe mis à jour', profilStore.message || 'Votre mot de passe a été changé.')
    showPasswordModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur', profilStore.error || 'Échec du changement de mot de passe.')
  }
}
</script>
