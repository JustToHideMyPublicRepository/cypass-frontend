<template>
  <div class="space-y-8 text-center py-4">
    <div class="flex justify-center">
      <div
        class="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center animate-pulse">
        <IconMailFast class="w-10 h-10" />
      </div>
    </div>
    <div class="space-y-2">
      <h3 class="font-black text-BtW uppercase tracking-tighter text-xl">Lien envoyé !</h3>
      <p class="text-sm text-hsa font-medium">Consultez votre boîte mail et cliquez sur le lien pour vous connecter.
      </p>
    </div>

    <div class="pt-4 space-y-4">
      <UiBaseButton @click="handleMagicLink" :loading="loading" variant="secondary"
        class="w-full py-4 text-xs font-black uppercase tracking-widest">
        Renvoyer le lien
      </UiBaseButton>
      <button @click="resetSelection"
        class="text-[10px] text-secondary hover:text-primary hover:underline font-black uppercase tracking-widest transition-colors">
        Essayer une autre méthode
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconMailFast } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'

const authStore = useAuthStore()
const toastStore = useToastStore()

const loading = ref(false)

const handleMagicLink = async () => {
  loading.value = true
  const success = await authStore.loginWithMagicLink()
  if (success) {
    toastStore.showToast('success', 'Email envoyé', 'Le lien magique est en route.')
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || 'Impossible d\'envoyer l\'email.')
  }
  loading.value = false
}

const resetSelection = () => {
  if (authStore.mfaSession) {
    authStore.mfaSession.active_method = null
  }
}

onMounted(() => {
  handleMagicLink()
})
</script>
