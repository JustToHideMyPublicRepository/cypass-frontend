<template>
  <UiBaseCard class="text-center py-8">
    <div class="relative w-32 h-32 mx-auto mb-4">
      <div class="w-full h-full rounded-full overflow-hidden border-4 border-ash bg-ash">
        <img :src="`https://api.dicebear.com/9.x/icons/svg?seed=${user?.name || 'User'}`" alt="Avatar"
          class="w-full h-full object-cover" />
      </div>
      <button
        class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors">
        <IconCamera class="w-5 h-5" />
      </button>
    </div>
    <h2 class="text-xl font-bold text-BtW">{{ user?.name || 'Utilisateur' }}</h2>
    <p class="text-hsa mb-2">{{ user?.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}</p>
    <p class="text-xs text-hsa mb-4">Membre depuis {{ formatDate(user?.created_at) }}</p>
    <div class="flex justify-center gap-2">
      <UiStatusBadge :status="emailVerified ? 'Verified' : 'Pending'">
        {{ emailVerified ? 'Vérifié' : 'En attente' }}
      </UiStatusBadge>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconCamera } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

defineProps<{
  user: any
  emailVerified: boolean
}>()

const formatDate = (dateString?: string) => {
  if (!dateString) return '...'
  try {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: fr })
  } catch {
    return '...'
  }
}
</script>
