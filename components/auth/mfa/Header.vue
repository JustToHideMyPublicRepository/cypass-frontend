<template>
  <div class="mb-8 text-center text-BtW">
    <div class="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
      <IconShieldCheck v-if="!activeMethod || !activeMethodInfo" class="w-8 h-8" />
      <component v-else :is="activeMethodInfo.icon" class="w-8 h-8" />
    </div>
    <h2 class="text-3xl font-black tracking-tight mb-2 uppercase">
      {{ activeMethod && activeMethodInfo ? activeMethodInfo.label : 'Vérification' }}
    </h2>
    <p class="text-hsa font-medium leading-relaxed">
      {{ subTitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconShieldCheck } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { getMfaMethodInfo } from '~/utils/mfa'

const authStore = useAuthStore()

const activeMethod = computed(() => authStore.mfaSession?.active_method)
const activeMethodInfo = computed(() => activeMethod.value ? getMfaMethodInfo(activeMethod.value) : null)

const maskedEmail = computed(() => {
  const email = authStore.mfaSession?.email || ''
  if (!email.includes('@')) return email
  const [local, domain] = email.split('@')
  return local.length <= 2 ? `${local[0]}***@${domain}` : `${local[0]}***${local[local.length - 1]}@${domain}`
})

const subTitle = computed(() => {
  if (!activeMethod.value) return 'Choisissez une méthode pour confirmer votre identité.'
  if (activeMethod.value === 'totp') return `Un code a été envoyé à ${maskedEmail.value}`
  if (activeMethod.value === 'authenticator') return 'Ouvrez votre application authenticator.'
  if (activeMethod.value === 'magic_link') return `Un lien a été envoyé à ${maskedEmail.value}`
  if (activeMethod.value === 'security_code') return 'Saisissez l\'un de vos codes de secours.'
  return 'Vérification de sécurité requise.'
})
</script>
