<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <MeNotificationDetailHeader :title="notif?.title" />

    <!-- Loading -->
    <div v-if="store.loading && !notif" class="py-10">
      <UiLogoLoader size="xl" />
    </div>

    <!-- Content -->
    <div v-else-if="notif" class="animate-fade-up">
      <MeNotificationDetailCard :notification="notif" @delete="handleDelete" />
    </div>

    <!-- Confirmation Modal -->
    <UiConfirmModal :show="confirmShow" title="Supprimer la notification"
      message="Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible."
      confirm-text="Supprimer" variant="danger" :icon="IconTrash" :loading="confirmLoading" @confirm="confirmDelete"
      @cancel="confirmShow = false" />
  </div>
</template>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconTrash } from '@tabler/icons-vue'
import { useNotificationsStore } from '~/stores/back/user/notifications'
import { useToastStore } from '~/stores/front/toast'

const route = useRoute()
const store = useNotificationsStore()
const toastStore = useToastStore()
const id = route.params.id as string

const notif = computed(() => store.currentNotification)

const confirmShow = ref(false)
const confirmLoading = ref(false)

const handleDelete = () => {
  confirmShow.value = true
}

const confirmDelete = async () => {
  confirmLoading.value = true
  const success = await store.notificationDelete(id)
  confirmLoading.value = false
  confirmShow.value = false
  if (success) {
    toastStore.showToast('success', 'Supprimé', 'La notification a été supprimée.')
    navigateTo('/dashboard/notification')
  }
}

onMounted(() => {
  store.notificationGet(id)
})

useHead({
  title: notif.value ? notif.value.title : 'Notification',
  meta: [
    { name: 'description', content: 'Détails et actions recommandées pour cette notification de sécurité.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
