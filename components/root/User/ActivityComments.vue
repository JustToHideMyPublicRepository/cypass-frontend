<template>
  <div class="space-y-6">
    <!-- Affichage si des commentaires existent -->
    <div v-if="comments.length" class="overflow-x-auto px-1">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Carte de commentaire individuelle -->
        <NuxtLink v-for="comment in paginatedItems" :key="comment.id" :to="`/vigitech/${comment.incident_id}`"
          class="group relative flex flex-col bg-ash/80 backdrop-blur-xl p-6 md:p-7 rounded-[3rem] border border-ash hover:border-primary/40 hover:bg-WtB hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)] transition-all duration-500 overflow-hidden">

          <!-- Effet de brillance au survol -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          </div>

          <!-- En-tête du commentaire : Date -->
          <div class="relative flex items-center justify-between mb-5">
            <div
              class="text-[9px] font-black text-hsa uppercase tracking-[0.2em] bg-ash/10 px-4 py-1.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
              {{ formatDateShort(comment.created_at) }}
            </div>
            <div
              class="p-2.5 rounded-2xl bg-hsa/20 border border-ash/20 group-hover:bg-primary group-hover:text-WtB transition-all duration-500 shadow-sm">
              <IconExternalLink class="w-4 h-4" />
            </div>
          </div>

          <!-- Corps du commentaire : Contenu textuel -->
          <div class="relative flex-1">
            <p
              class="text-[13px] text-BtW leading-relaxed font-bold mb-7 line-clamp-3 italic opacity-85 group-hover:opacity-100 transition-opacity">
              "{{ comment.content }}"
            </p>
          </div>

          <!-- Pied de carte : Référence à l'incident lié -->
          <div class="relative pt-6 border-t border-ash/20 flex items-center gap-4">
            <!-- Icone de l'auteur de l'incident -->
            <div class="relative">
              <div
                class="w-10 h-10 rounded-2xl overflow-hidden border-2 border-WtB shadow-lg bg-ash/20 shrink-0 transform group-hover:rotate-6 transition-transform duration-500">
                <img :src="userAvatarUrl" class="w-full h-full object-cover" />
              </div>
              <div
                class="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center border-2 border-WtB shadow-sm">
                <IconMessage class="w-2.5 h-2.5 text-WtB" />
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <p
                class="text-[9px] font-black text-hsa uppercase tracking-[0.2em] mb-1 group-hover:text-primary transition-colors">
                Sur l'Incident</p>
              <h4
                class="text-xs font-black text-BtW truncate leading-tight group-hover:translate-x-1 transition-transform">
                {{ decodeHtmlEntities(comment.incident_title) }}
              </h4>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-center">
      <div class="w-24 h-24 bg-hsa rounded-[3rem] flex items-center justify-center mb-8 border border-ash/10">
        <IconMessage class="w-10 h-10 text-ash" />
      </div>
      <h3 class="text-xl font-black text-BtW">Aucun commentaire</h3>
      <p class="text-sm font-bold text-hsa mt-2">Cet utilisateur n'a pas encore participé aux discussions.</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 pt-8 border-t border-ash/10">
      <UiBaseButton variant="ghost" size="sm" :disabled="page === 1" @click="page--"
        class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
        <IconChevronLeft class="w-5 h-5" />
      </UiBaseButton>
      <div class="px-6 py-2 rounded-2xl bg-ash/5 text-[10px] font-black text-BtW tracking-[0.2em]">
        <span class="text-primary">{{ page }}</span> / {{ totalPages }}
      </div>
      <UiBaseButton variant="ghost" size="sm" :disabled="page === totalPages" @click="page++"
        class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
        <IconChevronRight class="w-5 h-5" />
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMessage, IconExternalLink, IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { decodeHtmlEntities } from '~/utils/format'
import { getUserAvatarUrl } from '~/utils/user'
import { useAuthStore } from '~/stores/back/user/auth'

// Propriétés reçues
const props = defineProps<{
  comments: any[]
  userAvatarUrl: string
}>()

const authStore = useAuthStore()

// Logique de pagination
const page = ref(1)
const pageSize = 4
const totalPages = computed(() => Math.ceil(props.comments.length / pageSize))
const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return props.comments.slice(start, start + pageSize)
})


/**
 * Formate la date de création du commentaire en français.
 */
const formatDateShort = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), 'dd MMM yyyy', { locale: fr })
  } catch {
    return ''
  }
}
</script>
