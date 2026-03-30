<template>
  <div class="mt-8 pt-6 border-t border-ash/50 text-center">
    <button @click="goBack"
      class="text-[10px] text-hsa hover:text-primary transition-all font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 group">
      <IconArrowLeft class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
      {{ activeMethod ? 'Retour aux méthodes' : 'Retour à la connexion' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'

const authStore = useAuthStore()

const activeMethod = computed(() => authStore.mfaSession?.active_method)

const goBack = () => {
  if (activeMethod.value) {
    if (authStore.mfaSession) {
      authStore.mfaSession.active_method = null
    }
  } else {
    authStore.mfaSession = null
    navigateTo('/auth/login')
  }
}
</script>
