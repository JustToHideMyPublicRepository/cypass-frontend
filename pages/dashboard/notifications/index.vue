<template>
  <div class="max-w-4xl mx-auto space-y-4 md:space-y-6">
    <!-- Header -->
    <MeNotificationsHeader :unread-count="store.unreadCount" @mark-all-read="handleMarkAllAsRead" />

    <!-- Stats -->
    <MeNotificationsStats :total="store.notifications.length" :counts="categoryCounts"
      :active-category="filterState.category"
      @filter-category="cat => filterState.category = filterState.category === cat ? '' : cat" />

    <!-- Filters -->
    <MeNotificationsFilters v-model="filterState" :has-active-filters="hasActiveFilters"
      @update:status="val => filterState.status = val" @update:priority="val => filterState.priority = val"
      @toggle-sort="toggleSort" @reset="resetFilters" />

    <!-- List -->
    <UiBaseCard class="p-0 overflow-hidden sm:rounded-2xl border-x-0 sm:border-x">
      <div v-if="store.loading && !store.notifications.length" class="py-10">
        <UiLogoLoader size="xl" />
      </div>

      <MeNotificationsEmpty v-else-if="!filteredNotifications.length" />

      <div v-else class="divide-y divide-ash">
        <MeNotificationsCard v-for="notif in filteredNotifications" :key="notif.id" :notification="notif"
          :is-mobile="isMobile" @click="goToDetail" @mark-read="handleMarkAsRead" @delete="handleDelete" />
      </div>

      <!-- Pagination -->
      <div v-if="store.pagination.has_more && !hasActiveFilters" class="p-6 border-t border-ash text-center">
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
import { onMounted, reactive, ref, onUnmounted, computed } from 'vue'
import { IconTrash } from '@tabler/icons-vue'
import { useNotificationsStore } from '~/stores/notifications'
import { useToastStore } from '~/stores/toast'

const store = useNotificationsStore()
const toastStore = useToastStore()
const { getCategory } = useNotificationStyles()

const filterState = reactive({
  status: 'all', // all, unread, read
  priority: 'all', // all, standard, medium, high
  category: '', // '', DOC, SEC, PRF
  order: 'desc' // desc (newest), asc (oldest)
})

const filteredNotifications = computed(() => {
  let list = [...store.notifications]

  // Filter by status
  if (filterState.status === 'unread') {
    list = list.filter(n => !n.is_read)
  } else if (filterState.status === 'read') {
    list = list.filter(n => n.is_read)
  }

  // Filter by priority
  if (filterState.priority !== 'all') {
    list = list.filter(n => n.priority === filterState.priority)
  }

  // Filter by category
  if (filterState.category) {
    list = list.filter(n => getCategory(n.type) === filterState.category)
  }

  // Sort by date
  list.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return filterState.order === 'desc' ? dateB - dateA : dateA - dateB
  })

  return list
})

const categoryCounts = computed(() => {
  return store.notifications.reduce((acc, n) => {
    const cat = getCategory(n.type)
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, { DOC: 0, SEC: 0, PRF: 0, OTHER: 0 } as Record<string, number>)
})

const hasActiveFilters = computed(() => {
  return filterState.status !== 'all' || filterState.priority !== 'all' || filterState.category !== '' || filterState.order !== 'desc'
})

const resetFilters = () => {
  filterState.status = 'all'
  filterState.priority = 'all'
  filterState.category = ''
  filterState.order = 'desc'
}

const toggleSort = () => {
  filterState.order = filterState.order === 'desc' ? 'asc' : 'desc'
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
  store.fetchNotifications(100, 0) // Fetch more for local filtering
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

useHead({
  title: 'Toutes les Notifications',
  meta: [
    { name: 'description', content: 'Consultez vos alertes de sécurité, mises à jour et notifications importantes.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
