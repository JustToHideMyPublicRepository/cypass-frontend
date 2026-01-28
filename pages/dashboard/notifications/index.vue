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

    <!-- Stats Cards / Categories -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 sm:px-0">
      <UiBaseCard class="bg-primary/5 border-primary/20 p-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <IconBell class="w-4 h-4" />
          </div>
          <div>
            <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Total</p>
            <p class="text-lg font-black text-BtW">{{ store.notifications.length }}</p>
          </div>
        </div>
      </UiBaseCard>

      <UiBaseCard class="bg-green-500/5 border-green-500/20 p-4 cursor-pointer hover:bg-green-500/10 transition-all"
        @click="filterState.category = filterState.category === 'DOC' ? '' : 'DOC'">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
            <IconFileText class="w-4 h-4" />
          </div>
          <div>
            <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Documents</p>
            <p class="text-lg font-black text-BtW">{{ categoryCounts.DOC }}</p>
          </div>
        </div>
      </UiBaseCard>

      <UiBaseCard class="bg-amber-500/5 border-amber-500/20 p-4 cursor-pointer hover:bg-amber-500/10 transition-all"
        @click="filterState.category = filterState.category === 'SEC' ? '' : 'SEC'">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <IconShieldLock class="w-4 h-4" />
          </div>
          <div>
            <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Sécurité</p>
            <p class="text-lg font-black text-BtW">{{ categoryCounts.SEC }}</p>
          </div>
        </div>
      </UiBaseCard>

      <UiBaseCard class="bg-blue-500/5 border-blue-500/20 p-4 cursor-pointer hover:bg-blue-500/10 transition-all"
        @click="filterState.category = filterState.category === 'PRF' ? '' : 'PRF'">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <IconUser class="w-4 h-4" />
          </div>
          <div>
            <p class="text-[8px] font-black uppercase tracking-widest text-hsa">Profil</p>
            <p class="text-lg font-black text-BtW">{{ categoryCounts.PRF }}</p>
          </div>
        </div>
      </UiBaseCard>
    </div>

    <!-- Filters Bar -->
    <div class="px-4 sm:px-0 flex flex-wrap gap-2 items-center">
      <div class="flex items-center gap-2 bg-ash/30 p-1 rounded-xl border border-ash">
        <button v-for="status in ['all', 'unread', 'read']" :key="status" @click="filterState.status = status" :class="[
          'px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all',
          filterState.status === status ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'
        ]">
          {{ status === 'all' ? 'Toutes' : status === 'unread' ? 'Non lues' : 'Lues' }}
        </button>
      </div>

      <select v-model="filterState.priority"
        class="bg-ash/30 border border-ash rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-hsa outline-none hover:border-primary/30 transition-all cursor-pointer">
        <option value="all">Priorité (Toutes)</option>
        <option value="standard">Standard</option>
        <option value="medium">Moyenne</option>
        <option value="high">Haute</option>
      </select>

      <button @click="toggleSort"
        class="bg-ash/30 border border-ash rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-hsa flex items-center gap-1.5 hover:border-primary/30 transition-all">
        <IconArrowsSort class="w-3 h-3" />
        {{ filterState.order === 'desc' ? 'Plus récents' : 'Plus anciens' }}
      </button>

      <div class="flex-1"></div>

      <button v-if="hasActiveFilters" @click="resetFilters"
        class="text-[9px] font-black uppercase text-hsa hover:text-danger flex items-center gap-1 transition-colors">
        <IconX class="w-3 h-3" />
        Réinitialiser
      </button>
    </div>

    <!-- List -->
    <UiBaseCard class="p-0 overflow-hidden sm:rounded-2xl border-x-0 sm:border-x">
      <div v-if="store.loading && !store.notifications.length" class="p-12 md:p-20 text-center">
        <div class="animate-spin rounded-full h-10 md:h-12 w-10 md:w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-sm text-hsa">Chargement de vos notifications...</p>
      </div>

      <div v-else-if="!filteredNotifications.length" class="p-12 md:p-20 text-center">
        <IconBellOff class="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 opacity-10" />
        <h3 class="text-lg md:text-xl font-bold text-BtW">Aucune notification</h3>
        <p class="text-xs md:text-sm text-hsa mt-2">Aucune notification ne correspond à vos filtres.</p>
      </div>

      <div v-else class="divide-y divide-ash">
        <div v-for="notif in filteredNotifications" :key="notif.id"
          :class="['p-4 md:p-6 flex gap-3 md:gap-4 transition-colors relative group cursor-pointer', !notif.is_read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-ash/20']"
          @click="goToDetail(notif.id)">

          <div v-if="!notif.is_read" class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>

          <div :class="[
            'w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
            !notif.is_read ? getTypeStyles(notif.type) : 'bg-ash/50 text-hsa'
          ]">
            <component :is="notif.is_read ? IconCheck : getTypeIcon(notif.type)" class="w-5 h-5 md:w-6 md:h-6" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-1 gap-4">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <span
                    :class="['text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-thighter', getCategoryBadgeClass(notif.type)]">
                    {{ getCategoryLabel(getCategory(notif.type)) }}
                  </span>
                  <span v-if="notif.priority === 'high'" class="text-[8px] font-black text-red-500 animate-pulse">
                    PRIORITÉ HAUTE
                  </span>
                </div>
                <h3 class="font-bold text-BtW truncate text-sm md:text-base">{{ notif.title }}</h3>
              </div>
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

      <!-- Pagination (Only if no local filtering, or if has_more) -->
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
import {
  IconBell, IconBellOff, IconCircleCheck, IconCheck,
  IconAlertTriangle, IconInfoCircle, IconShieldCheck, IconTrash,
  IconFileText, IconShieldLock, IconUser, IconArrowsSort, IconX
} from '@tabler/icons-vue'
import { useNotificationsStore } from '~/stores/notifications'
import { useToastStore } from '~/stores/toast'
import { useNotificationStyles } from '~/composables/useNotificationStyles'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

definePageMeta({
  layout: 'default'
})

const store = useNotificationsStore()
const toastStore = useToastStore()
const { getTypeIcon, getTypeStyles, getCategory, getCategoryLabel } = useNotificationStyles()

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

const getCategoryBadgeClass = (type: string) => {
  const cat = getCategory(type)
  switch (cat) {
    case 'DOC': return 'bg-green-500/10 text-green-600'
    case 'SEC': return 'bg-amber-500/10 text-amber-600'
    case 'PRF': return 'bg-blue-500/10 text-blue-600'
    default: return 'bg-ash text-hsa'
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
  store.fetchNotifications(100, 0) // Fetch more for local filtering
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

useHead({
  title: 'Toutes les Notifications'
})
</script>
