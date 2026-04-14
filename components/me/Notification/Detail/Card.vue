<template>
  <UiBaseCard>
    <div class="flex flex-col gap-6">
      <div :class="[
        'w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mx-auto md:mx-0 transition-transform hover:scale-110',
        getTypeStyles(notification.type)
      ]">
        <component :is="getTypeIcon(notification.type)" class="w-8 h-8" />
      </div>

      <div class="space-y-2 text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-2 mb-2">
          <span
            :class="['text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest', getCategoryBadgeClass(notification.type)]">
            {{ getCategoryLabel(getCategory(notification.type)) }}
          </span>
          <span v-if="notification.priority === 'high'"
            class="text-[9px] font-black text-red-500 uppercase tracking-widest">
            Urgent
          </span>
        </div>
        <h2 class="text-2xl font-black text-BtW leading-tight">{{ notification.title }}</h2>
        <div class="flex items-center justify-center md:justify-start gap-2 text-xs text-hsa">
          <IconCalendar class="w-3.5 h-3.5" />
          <span>Reçu le {{ formatDate(notification.created_at) }}</span>
        </div>
      </div>

      <div class="py-8 border-t border-b border-ash text-BtW leading-relaxed text-sm md:text-base">
        {{ notification.message }}
      </div>

      <!-- Category Specific Recommendations -->
      <div class="space-y-4">
        <!-- Security Activity -->
        <div v-if="getCategory(notification.type) === 'SEC'"
          class="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
          <div class="p-2 rounded-xl bg-amber-500/10 text-amber-600 shrink-0 self-start">
            <IconShieldExclamation class="w-5 h-5" />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-bold text-BtW">Action de sécurité requise ?</p>
            <p class="text-xs text-hsa leading-relaxed">
              {{ getSecurityMessage(notification.type) }}
            </p>
            <NuxtLink v-if="notification.type === 'SEC_LOGIN' || notification.type === 'SEC_PWD_CHG'"
              to="/dashboard/settings"
              class="inline-block mt-2 text-[10px] font-black uppercase text-primary hover:underline">
              Vérifier mes paramètres de sécurité
            </NuxtLink>
          </div>
        </div>

        <!-- Documents Activity -->
        <div v-if="getCategory(notification.type) === 'DOC'"
          class="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 flex gap-4">
          <div class="p-2 rounded-xl bg-green-500/10 text-green-600 shrink-0 self-start">
            <IconFileText class="w-5 h-5" />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-bold text-BtW">Gestion documentaire</p>
            <p class="text-xs text-hsa leading-relaxed">
              {{ getDocumentMessage(notification.type) }}
            </p>
            <NuxtLink to="/dashboard/docsentry"
              class="inline-block mt-2 text-[10px] font-black uppercase text-primary hover:underline">
              Consulter mon coffre-fort
            </NuxtLink>
          </div>
        </div>

        <!-- Profile Activity -->
        <div v-if="getCategory(notification.type) === 'PRF'"
          class="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
          <div class="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0 self-start">
            <IconUser class="w-5 h-5" />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-bold text-BtW">Mise à jour du profil</p>
            <p class="text-xs text-hsa leading-relaxed">
              {{ getProfileMessage(notification.type) }}
            </p>
            <NuxtLink to="/dashboard/profile"
              class="inline-block mt-2 text-[10px] font-black uppercase text-primary hover:underline">
              Voir mon profil
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-4">
        <UiBaseButton variant="secondary" @click="$emit('delete')" class="flex-1">
          <IconTrash class="w-4 h-4 mr-2" /> Supprimer
        </UiBaseButton>
        <UiBaseButton variant="primary" to="/dashboard/notification" class="flex-1">
          Retour à la liste
        </UiBaseButton>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconCalendar, IconTrash, IconShieldExclamation, IconFileText, IconUser } from '@tabler/icons-vue'
import { useNotificationStyles } from '~/composables/useNotificationStyles'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  notification: any
}>()

defineEmits(['delete'])

const {
  getTypeIcon, getTypeStyles, getCategory, getCategoryLabel,
  getSecurityMessage, getDocumentMessage, getProfileMessage
} = useNotificationStyles()

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
</script>
