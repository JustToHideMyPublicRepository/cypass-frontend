<template>
  <div class="relative" ref="notificationRef">
    <!-- Bell Button -->
    <UiBaseButton @click="toggleDropdown" variant="ghost"
      class="!p-2 !rounded-xl text-hsa hover:!bg-ash transition-all relative group !h-auto !w-auto border-none"
      title="Notifications">
      <IconBellPlus v-if="store.unreadCount > 0"
        class="w-6 h-6 group-hover:scale-110 transition-transform text-primary" />
      <IconBell v-else class="w-6 h-6 group-hover:scale-110 transition-transform" />
      <div v-if="store.unreadCount > 0"
        class="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-WtB flex items-center justify-center">
        {{ formattedCount }}
      </div>
    </UiBaseButton>

    <!-- Dropdown -->
    <Teleport to="body" :disabled="!isMobile">
      <Transition enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-y-2" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-2">
        <div v-if="isOpen" :style="dynamicPosition" id="notification-dropdown"
          class="mt-3 w-[calc(100vw-2rem)] md:w-[380px] bg-WtB border border-ash rounded-2xl shadow-2xl z-[999] overflow-hidden flex flex-col max-h-[500px]"
          :class="isMobile ? 'fixed' : 'absolute right-0'">

          <!-- Header -->
          <div class="p-4 border-b border-ash flex items-center justify-between bg-ash/10">
            <h3 class="font-bold text-BtW">Notifications</h3>
            <UiBaseButton v-if="store.unreadCount > 0" @click="handleMarkAllAsRead" variant="ghost"
              class="!text-[10px] !font-black !uppercase tracking-widest !text-primary hover:!text-secondary transition-colors !p-0 !bg-transparent hover:!bg-transparent !h-auto border-none">
              Tout lire
            </UiBaseButton>
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
                    !notif.is_read ? getTypeStyles(notif.type) : 'bg-ash/50 text-hsa'
                  ]">
                    <component :is="notif.is_read ? IconCheck : getTypeIcon(notif.type)" class="w-5 h-5" />
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
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { IconBell, IconBellPlus, IconBellOff, IconCheck } from '@tabler/icons-vue'
import { useNotificationsStore } from '~/stores/notifications'
import { useToastStore } from '~/stores/toast'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

import { useNotificationStyles } from '~/composables/useNotificationStyles'

const store = useNotificationsStore()
const toastStore = useToastStore()
const { getTypeIcon, getTypeStyles } = useNotificationStyles()
const isOpen = ref(false)
const notificationRef = ref<HTMLElement | null>(null)
let refreshInterval: any = null

const formattedCount = computed(() => {
  if (store.unreadCount > 20) return '20+'
  return store.unreadCount.toString()
})

const handleMarkAllAsRead = async () => {
  const success = await store.markAsRead('all')
  if (success) {
    toastStore.showToast('success', 'Notifications lues', 'Toutes vos notifications sont marquées comme lues.')
  }
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const goToNotification = (id: string) => {
  isOpen.value = false
  navigateTo(`/dashboard/notifications/${id}`)
}

const formatRelativeDate = (date: string) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
  } catch (e) {
    return date
  }
}

const isMobile = ref(false)

const checkMobile = () => {
  if (import.meta.client) {
    isMobile.value = window.innerWidth < 768
  }
}

const dynamicPosition = computed(() => {
  if (isMobile.value) {
    return {
      top: '72px',
      left: '50%',
      transform: 'translateX(-50%)',
      margin: '0',
      position: 'fixed' as const
    }
  }
  return {}
})

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  // Check if click is on the bell button or within the dropdown
  const dropdown = document.getElementById('notification-dropdown')

  if (notificationRef.value && !notificationRef.value.contains(target) && dropdown && !dropdown.contains(target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)
  store.fetchNotifications(5, 0)

  // Setup background refresh every 60 seconds
  refreshInterval = setInterval(() => {
    store.fetchNotifications(5, 0)
  }, 60000)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleClickOutside)
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>
