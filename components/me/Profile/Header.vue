<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="space-y-1">
      <h1 class="text-2xl md:text-3xl font-black text-BtW tracking-tight uppercase">Mon profil</h1>
      <p class="text-hsa text-sm font-medium">Gérez vos informations personnelles et de sécurité.</p>
    </div>
    <div class="flex">
      <NuxtLink v-if="user?.id" :to="`/user/${user.id}`" class="w-full sm:w-auto">
        <UiBaseButton variant="ghost" size="sm"
          class="!rounded-xl w-full sm:w-auto !py-2.5 sm:!py-1.5 border border-ash/50 sm:border-transparent hover:border-primary/20">
          <IconExternalLink class="w-4 h-4 mr-2" />
          Voir mon profil public
        </UiBaseButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconExternalLink } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { computed } from 'vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>
