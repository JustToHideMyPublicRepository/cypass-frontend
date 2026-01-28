<template>
  <div class="relative" ref="notificationRef">
    <!-- Bell Button -->
    <button @click="toggleDropdown" class="p-2 rounded-xl text-hsa hover:bg-ash transition-all relative group"
      title="Notifications">
      <IconBell class="w-6 h-6 group-hover:scale-110 transition-transform" />
      <div v-if="store.unreadCount > 0"
        class="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-WtB flex items-center justify-center">
        {{ formattedCount }}
      </div>
    </button>

    <!-- Dropdown -->
    <Transition enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2" enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2">
      <div v-if="isOpen"
        class="absolute right-0 mt-3 w-[380px] bg-WtB border border-ash rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[500px]">

        <!-- Header -->
        <div class="p-4 border-b border-ash flex items-center justify-between bg-ash/10">
          <h3 class="font-bold text-BtW">Notifications</h3>
          <button v-if="store.unreadCount > 0" @click="store.markAsRead('all')"
            class="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors">
            Tout lire
          </button>
        </div>

        <!-- List -->
        <div class="overflow-y-auto flex-1 scrollbar-hide">
          <div v-if="store.loading && !store.notifications.length" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p class="text-xs text-hsa text-BtW">Chargement...</p>
          </div>

          <div v-else-if="!store.notifications.length" class="p-12 text-center">
            <div
              class="w-16 h-16 bg-ash/30 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-20">
              <IconBellOff class="w-8 h-8" />
            </div>
            <p class="text-sm font-medium text-BtW">Aucune notification</p>
            <p class="text-xs text-hsa mt-1">Vous êtes à jour !</p>
          </div>

          <div v-else class="divide-y divide-ash/50">
            <div v-for="notif in store.notifications.slice(0, 5)" :key="notif.id"
              :class="['p-4 transition-all cursor-pointer relative group', !notif.is_read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-ash/30']"
              @click="goToNotification(notif.id)">
              <div v-if="!notif.is_read"
                class="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>

              <div class="flex gap-3 pl-2">
                <div :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  getTypeStyles(notif.type)
                ]">
                  <component :is="getTypeIcon(notif.type)" class="w-5 h-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start gap-2">
                    <p class="text-sm font-bold text-BtW truncate leading-none mb-1">{{ notif.title }}</p>
                    <span class="text-[9px] text-hsa font-medium whitespace-nowrap">{{
                      formatRelativeDate(notif.created_at) }}</span>
                  </div>
                  <p class="text-xs text-hsa line-clamp-2 leading-snug">{{ notif.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <NuxtLink to="/dashboard/notifications" @click="isOpen = false"
          class="p-4 border-t border-ash text-center text-xs font-black uppercase tracking-[0.2em] text-hsa hover:text-primary hover:bg-ash/10 transition-all">
          Tout voir
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  IconBell, IconBellOff, IconCheck, IconX, IconCircleCheck,
  IconAlertTriangle, IconInfoCircle, IconShieldCheck, IconLogout
} from '@tabler/icons-vue'
import { useNotificationsStore } from '~/stores/notifications'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const store = useNotificationsStore()
const isOpen = ref(false)
const notificationRef = ref<HTMLElement | null>(null)

const formattedCount = computed(() => {
  if (store.unreadCount > 20) return '20+'
  return store.unreadCount.toString()
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    store.fetchNotifications(20, 0)
  }
}

const goToNotification = (id: string) => {
  isOpen.value = false
  navigateTo(`/dashboard/notifications/${id}`)
}

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

const formatRelativeDate = (date: string) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
  } catch (e) {
    return date
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (notificationRef.value && !notificationRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  store.fetchNotifications(5, 0) // Pre-fetch for count
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
