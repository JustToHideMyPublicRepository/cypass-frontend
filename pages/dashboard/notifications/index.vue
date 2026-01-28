<template>
  <div class="max-w-4xl mx-auto space-y-4 md:space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-0">
      <h1 class="text-2xl md:text-3xl font-black text-BtW">Notifications</h1>
      <div class="flex gap-2">
        <button v-if="store.unreadCount > 0" @click="handleMarkAllAsRead"
          class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold text-[10px] md:text-xs uppercase tracking-widest border border-primary/20">
          Tout marquer comme lu
        </button>
      </div>
    </div>

    <!-- Filters/Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 sm:px-0">
      <UiBaseCard class="bg-primary/5 border-primary/20 p-4 md:p-6">
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <IconBell class="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p class="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-hsa">Non lues</p>
            <p class="text-xl md:text-2xl font-black text-BtW">{{ store.unreadCount }}</p>
          </div>
        </div>
      </UiBaseCard>
    </div>

    <!-- List -->
    <UiBaseCard class="p-0 overflow-hidden sm:rounded-2xl border-x-0 sm:border-x">
      <div v-if="store.loading && !store.notifications.length" class="p-12 md:p-20 text-center">
        <div class="animate-spin rounded-full h-10 md:h-12 w-10 md:w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-sm text-hsa">Chargement de vos notifications...</p>
      </div>

      <div v-else-if="!store.notifications.length" class="p-12 md:p-20 text-center">
        <IconBellOff class="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 opacity-10" />
        <h3 class="text-lg md:text-xl font-bold text-BtW">Aucune notification</h3>
        <p class="text-xs md:text-sm text-hsa mt-2">Vous recevrez des alertes ici lors de nouvelles activités.</p>
      </div>

      <div v-else class="divide-y divide-ash">
        <div v-for="notif in store.notifications" :key="notif.id"
          :class="['p-4 md:p-6 flex gap-3 md:gap-4 transition-colors relative group cursor-pointer', !notif.is_read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-ash/20']"
          @click="goToDetail(notif.id)">

          <div v-if="!notif.is_read" class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>

          <div :class="[
            'w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0',
            !notif.is_read ? getTypeStyles(notif.type) : 'bg-ash/50 text-hsa'
          ]">
            <component :is="notif.is_read ? IconCheck : getTypeIcon(notif.type)" class="w-5 h-5 md:w-6 md:h-6" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-1 gap-4">
              <h3 class="font-bold text-BtW truncate text-sm md:text-base">{{ notif.title }}</h3>
              <span class="text-[10px] md:text-xs text-hsa whitespace-nowrap">{{ formatDate(notif.created_at) }}</span>
            </div>
            <p class="text-xs md:text-sm text-hsa line-clamp-2 leading-relaxed">{{ notif.message }}</p>

            <div class="flex items-center gap-4 mt-4">
              <button v-if="!notif.is_read" @click.stop="handleMarkAsRead(notif.id)"
                class="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                Marquer comme lu
              </button>
              <button @click.stop="handleDelete(notif.id)"
                class="text-[10px] font-black uppercase tracking-widest text-danger transition-opacity"
                :class="isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="store.pagination.has_more" class="p-6 border-t border-ash text-center">
        <UiBaseButton variant="secondary" @click="loadMore" :loading="store.loading" block class="sm:w-auto">
          Charger plus
        </UiBaseButton>
      </div>
    </UiBaseCard>

    <!-- Confirmation Modal -->
    <UiConfirmModal :show="confirmModal.show" title="Supprimer la notification"
      message="Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible."
      confirm-text="Supprimer" variant="danger" :icon="IconTrash" :loading="confirmModal.loading"
      @confirm="confirmDelete" @cancel="confirmModal.show = false" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, onUnmounted } from 'vue'
import {
  IconBell, IconBellOff, IconCircleCheck, IconCheck,
  IconAlertTriangle, IconInfoCircle, IconShieldCheck, IconTrash
} from '@tabler/icons-vue'
import { useNotificationsStore } from '~/stores/notifications'
import { useToastStore } from '~/stores/toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

definePageMeta({
  layout: 'default'
})
const store = useNotificationsStore()
const toastStore = useToastStore()

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'SEC_LOGIN': return IconShieldCheck
    case 'DOC_CERTIFIED': return IconCircleCheck
    case 'ALERT': return IconAlertTriangle
    default: return IconInfoCircle
  }
}

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'SEC_LOGIN': return 'bg-blue-500/10 text-blue-500'
    case 'DOC_CERTIFIED': return 'bg-green-500/10 text-green-500'
    case 'ALERT': return 'bg-amber-500/10 text-amber-500'
    default: return 'bg-primary/10 text-primary'
  }
}

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd MMMM yyyy à HH:mm', { locale: fr })
  } catch (e) {
    return date
  }
}

const handleMarkAllAsRead = async () => {
  const success = await store.markAsRead('all')
  if (success) {
    toastStore.showToast('success', 'Élément mis à jour', 'Toutes les notifications ont été marquées comme lues.')
  }
}

const handleMarkAsRead = async (id: string) => {
  const success = await store.markAsRead(id)
  if (success) {
    toastStore.showToast('success', 'Élément mis à jour', 'La notification a été marquée comme lue.')
  }
}

const confirmModal = reactive({
  show: false,
  id: '',
  loading: false
})

const handleDelete = (id: string) => {
  confirmModal.id = id
  confirmModal.show = true
}

const confirmDelete = async () => {
  confirmModal.loading = true
  const success = await store.deleteNotification(confirmModal.id)
  confirmModal.loading = false
  confirmModal.show = false
  if (success) {
    toastStore.showToast('success', 'Supprimé', 'La notification a été supprimée.')
  }
}

const loadMore = () => {
  const newOffset = store.pagination.offset + store.pagination.limit
  store.fetchNotifications(store.pagination.limit, newOffset, true)
}

const goToDetail = (id: string) => {
  navigateTo(`/dashboard/notifications/${id}`)
}

const isMobile = ref(false)
const checkMobile = () => {
  if (import.meta.client) isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  store.fetchNotifications(20, 0)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

useHead({
  title: 'Toutes les Notifications'
})
</script>
