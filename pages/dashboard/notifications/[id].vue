<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/dashboard/notifications" class="p-2 hover:bg-ash/50 rounded-lg transition-colors text-hsa">
        <IconArrowLeft class="w-5 h-5" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-BtW">Notification</h1>
    </div>

    <div v-if="store.loading && !notif" class="py-20 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-hsa">Chargement...</p>
    </div>

    <div v-else-if="notif" class="animate-fade-up">
      <UiBaseCard>
        <div class="flex flex-col gap-6">
          <div :class="[
            'w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mx-auto md:mx-0',
            getTypeStyles(notif.type)
          ]">
            <component :is="getTypeIcon(notif.type)" class="w-8 h-8" />
          </div>

          <div class="space-y-2 text-center md:text-left">
            <h2 class="text-2xl font-black text-BtW">{{ notif.title }}</h2>
            <div class="flex items-center justify-center md:justify-start gap-2 text-xs text-hsa">
              <IconCalendar class="w-3.5 h-3.5" />
              <span>{{ formatDate(notif.created_at) }}</span>
            </div>
          </div>

          <div class="py-6 border-t border-b border-ash text-BtW leading-relaxed">
            {{ notif.message }}
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <UiBaseButton variant="secondary" @click="handleDelete" class="flex-1">
              <IconTrash class="w-4 h-4 mr-2" /> Supprimer
            </UiBaseButton>
            <UiBaseButton variant="primary" to="/dashboard/notifications" class="flex-1">
              Retour à la liste
            </UiBaseButton>
          </div>
        </div>
      </UiBaseCard>

      <!-- Context Info -->
      <div v-if="notif.type === 'SEC_LOGIN'"
        class="mt-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
        <div class="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0 self-start">
          <IconShieldExclamation class="w-5 h-5" />
        </div>
        <div class="space-y-1">
          <p class="text-sm font-bold text-BtW">Alerte de sécurité</p>
          <p class="text-xs text-hsa">Si vous ne reconnaissez pas cette activité, nous vous recommandons de changer
            votre mot de passe immédiatement dans l'onglet Sécurité.</p>
        </div>
      </div>
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
import {
  IconArrowLeft, IconCalendar, IconCircleCheck, IconTrash,
  IconAlertTriangle, IconInfoCircle, IconShieldCheck, IconShieldExclamation
} from '@tabler/icons-vue'
import { useNotificationsStore } from '~/stores/notifications'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const store = useNotificationsStore()
const id = route.params.id as string

const notif = computed(() => store.currentNotification)

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

const confirmShow = ref(false)
const confirmLoading = ref(false)

const handleDelete = () => {
  confirmShow.value = true
}

const confirmDelete = async () => {
  confirmLoading.value = true
  await store.deleteNotification(id)
  confirmLoading.value = false
  confirmShow.value = false
  navigateTo('/dashboard/notifications')
}

onMounted(() => {
  store.fetchNotificationById(id)
})

useHead({
  title: notif.value ? notif.value.title : 'Notification'
})
</script>
