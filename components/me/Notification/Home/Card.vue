<template>
  <div
    :class="['p-4 md:p-6 flex gap-3 md:gap-4 transition-colors relative group cursor-pointer', !notification.is_read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-ash/20']"
    @click="$emit('click', notification.id)">

    <div v-if="!notification.is_read" class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>

    <div :class="[
      'w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
      !notification.is_read ? getTypeStyles(notification.type) : 'bg-ash/50 text-hsa'
    ]">
      <component :is="notification.is_read ? IconCheck : getTypeIcon(notification.type)"
        class="w-5 h-5 md:w-6 md:h-6" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start mb-1 gap-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span
              :class="['text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-thighter', getCategoryBadgeClass(notification.type)]">
              {{ getCategoryLabel(getCategory(notification.type)) }}
            </span>
            <span v-if="notification.priority === 'high'" class="text-[8px] font-black text-red-500 animate-pulse">
              PRIORITÉ HAUTE
            </span>
          </div>
          <h3 class="font-bold text-BtW truncate text-sm md:text-base">{{ notification.title }}</h3>
        </div>
        <span class="text-[10px] md:text-xs text-hsa whitespace-nowrap">{{ formatDate(notification.created_at) }}</span>
      </div>
      <p class="text-xs md:text-sm text-hsa line-clamp-2 leading-relaxed">{{ notification.message }}</p>

      <div class="flex items-center gap-4 mt-4">
        <UiBaseButton v-if="!notification.is_read" @click.stop="$emit('mark-read', notification.id)" variant="ghost"
          class="!text-[10px] !font-black uppercase tracking-widest !text-primary hover:!underline !p-0 !min-h-0 !h-auto !bg-transparent hover:!bg-transparent">
          Marquer comme lu
        </UiBaseButton>
        <UiBaseButton @click.stop="$emit('delete', notification.id)" variant="ghost"
          class="!text-[10px] !font-black uppercase tracking-widest text-danger transition-opacity !p-0 !min-h-0 !h-auto !bg-transparent hover:!bg-transparent"
          :class="isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">
          Supprimer
        </UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'
import { useNotificationStyles } from '~/composables/useNotificationStyles'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  notification: any
  isMobile: boolean
}>()

defineEmits(['click', 'mark-read', 'delete'])

const { getTypeIcon, getTypeStyles, getCategory, getCategoryLabel } = useNotificationStyles()

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
