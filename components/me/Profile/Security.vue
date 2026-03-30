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
          <div class="flex items-center gap-3">
            <div>
              <h3 class="font-bold text-BtW flex items-center gap-2">
                Double authentification (2FA)
                <UiAppTooltip v-if="mfaDisabledUntil"
                  :content="`Votre MFA est suspendu. Son statut sera automatiquement mis à jour le <b>${formatDate(mfaDisabledUntil)}</b>.`"
                  title="Suspension temporaire" icon-class="text-warning opacity-100" />
              </h3>
              <p class="text-sm text-hsa">
                <template v-if="mfaDisabledUntil">
                  <span class="text-warning font-medium">Suspendu jusqu'au {{ formatDate(mfaDisabledUntil) }}</span>
                </template>
                <template v-else>
                  Sécurisez votre compte avec une étape supplémentaire.
                </template>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <template v-if="profilStore.loading">
              <UiAppSkeleton type="text" width="40px" height="24px" class="rounded-2xl" />
            </template>
            <template v-else>
              <UiLogoLoader v-if="loadingMfa" size="xs" />
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" :checked="mfaActive" @change="handleMfaToggle" class="sr-only peer"
                  :disabled="loadingMfa">
                <div class="input-toggle-slider">
                </div>
              </label>
            </template>
          </div>
        </div>
      </div>
    </UiBaseCard>

    <!-- Modals -->
    <ModalProfileEmail :show="showEmailModal" :loading="securityStore.loading" @close="showEmailModal = false"
      @submit="handleEmailUpdate" />

    <ModalProfilePassword :show="showPasswordModal" :loading="securityStore.loading" @close="showPasswordModal = false"
      @submit="handlePasswordUpdate" />

    <!-- Modal Désactivation MFA -->
    <ModalProfileMfaDisable :show="showMfaDurationModal" :loading="loadingMfa" @close="showMfaDurationModal = false"
      @confirm="confirmMfaDisable" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconMail, IconLock, IconChevronRight } from '@tabler/icons-vue'
import { useProfilStore } from '~/stores/back/user/profil'
import { useSecurityStore } from '~/stores/back/user/security'
import { useToastStore } from '~/stores/front/toast'

const profilStore = useProfilStore()
const securityStore = useSecurityStore()
const toastStore = useToastStore()

const showEmailModal = ref(false)
const showPasswordModal = ref(false)
const showMfaDurationModal = ref(false)
const loadingMfa = ref(false)

const mfaActive = computed(() => profilStore.profile?.mfa_active ?? false)
const mfaDisabledUntil = computed(() => profilStore.profile?.mfa_disabled_until)

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleMfaToggle = (event: Event) => {
  const checkbox = event.target as HTMLInputElement
  const newVal = checkbox.checked

  if (newVal) {
    // Activation directe
    executeMfaToggle(true)
  } else {
    // Demander la durée
    checkbox.checked = true // Garder coché jusqu'à confirmation
    showMfaDurationModal.value = true
  }
}

const confirmMfaDisable = async (days: number) => {
  await executeMfaToggle(false, days)
  showMfaDurationModal.value = false
}

const executeMfaToggle = async (val: boolean, days?: number) => {
  loadingMfa.value = true
  const success = await securityStore.toggleMfa(val, days)

  if (success) {
    toastStore.showToast('success', 'Sécurité mise à jour', `La double authentification est désormais ${val ? 'activée' : 'suspendue'}.`)
  } else {
    toastStore.showToast('error', 'Erreur', securityStore.error || 'Impossible de modifier le paramètre MFA.')
  }
  loadingMfa.value = false
}

const handleEmailUpdate = async (data: any) => {
  const success = await securityStore.changeEmail(data.newEmail, data.password)
  if (success) {
    toastStore.showToast('success', 'Email modifié', securityStore.message || 'Vérifiez votre nouvelle adresse.')
    showEmailModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur', securityStore.error || 'Échec du changement d\'email.')
  }
}

const handlePasswordUpdate = async (data: any) => {
  const success = await securityStore.changePassword(data.current, data.new, data.confirm)
  if (success) {
    toastStore.showToast('success', 'Mot de passe mis à jour', securityStore.message || 'Votre mot de passe a été changé.')
    showPasswordModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur', securityStore.error || 'Échec du changement de mot de passe.')
  }
}
</script>
