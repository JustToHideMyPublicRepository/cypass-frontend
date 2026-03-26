<template>
  <UiBaseModal :show="show" @close="$emit('close')" title="Détails du commentaire" maxWidth="2xl">
    <div v-if="comment" class="space-y-6">
      <!-- Incident Title Header -->
      <div class="p-5 rounded-[2.5rem] bg-ash/5 border border-ash/30 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4 min-w-0">
          <div class="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <IconMessageChatbot class="w-6 h-6 text-primary" />
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-black uppercase tracking-widest text-hsa mb-0.5">Incident associé</p>
            <NuxtLink 
              v-if="comment.incident_id"
              :to="`/vigitech/${comment.incident_id}`"
              class="text-sm font-black text-BtW hover:text-primary transition-colors hover:underline block truncate"
            >
              {{ comment.incident_title || 'Incident inconnu' }}
            </NuxtLink>
            <p v-else class="text-sm font-black text-BtW">Incident non spécifié</p>
          </div>
        </div>
        <div class="text-right shrink-0">
          <p class="text-[10px] font-black uppercase tracking-widest text-hsa mb-0.5">Date de publication</p>
          <p class="text-xs font-bold text-BtW">{{ formatDate(comment.created_at) }}</p>
        </div>
      </div>

      <!-- Author info -->
      <div class="p-6 rounded-[2.5rem] bg-ash/5 border border-ash/20 space-y-4">
        <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
          <IconUserCheck class="w-4 h-4" /> Auteur du commentaire
        </h3>
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl overflow-hidden border-2 border-WtB shadow-lg bg-ash/20">
            <img :src="getAvatar(comment)" class="w-full h-full object-cover" />
          </div>
          <div class="min-w-0">
            <p class="text-base font-black text-BtW">
              {{ [comment.first_name, comment.last_name].filter(Boolean).join(' ') || 'Utilisateur anonyme' }}
            </p>
            <p v-if="comment.organization_name" class="text-xs font-bold text-hsa italic">
              {{ comment.organization_name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Full content -->
      <div class="space-y-3">
        <h4 class="text-[10px] font-black uppercase tracking-widest text-hsa px-1">Analyse complète</h4>
        <div class="p-8 rounded-[3rem] bg-WtB border border-ash shadow-inner relative overflow-hidden group">
          <!-- Background accent -->
          <div class="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
          
          <p class="relative text-sm text-BtW whitespace-pre-wrap leading-relaxed font-medium break-words">
            {{ comment.content }}
          </p>
        </div>
      </div>

      <!-- Simple Footer -->
      <div class="flex justify-end pt-4 border-t border-ash/40">
        <UiBaseButton variant="ghost" @click="$emit('close')" class="!rounded-2xl !px-8">
          Fermer
        </UiBaseButton>
      </div>
    </div>

    <!-- Skeleton Loading -->
    <div v-else class="space-y-6">
      <UiAppSkeleton height="80px" radius="2.5rem" />
      <UiAppSkeleton height="100px" radius="2.5rem" />
      <UiAppSkeleton height="200px" radius="3rem" />
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { IconMessageChatbot, IconUserCheck } from '@tabler/icons-vue'
import type { Comment } from '~/types/vigitech'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getUserAvatarUrl } from '~/utils/user'

defineProps<{
  show: boolean
  comment: Comment | null
}>()

defineEmits(['close'])

const getAvatar = (comment: Comment) => {
  return getUserAvatarUrl(comment.avatar_url || null, comment.first_name || null, comment.last_name || null)
}

const formatDate = (dateStr: string) => {
  try {
    return format(new Date(dateStr), "d MMMM yyyy 'à' HH:mm", { locale: fr })
  } catch {
    return dateStr
  }
}
</script>
