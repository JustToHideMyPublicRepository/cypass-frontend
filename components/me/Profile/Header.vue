<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-BtW">Mon profil</h1>
      <p class="text-hsa">Gérez vos informations personnelles et de sécurité.</p>
    </div>
    <NuxtLink v-if="user?.id" :to="`/user/${user.id}`">
      <UiBaseButton variant="ghost" size="sm" class="!rounded-xl">
        <IconExternalLink class="w-4 h-4 mr-2" />
        Voir profil public
      </UiBaseButton>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconExternalLink } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>
