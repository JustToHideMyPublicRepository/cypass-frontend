<template>
  <div class="space-y-6">
    <!-- Affichage si des commentaires existent -->
    <div v-if="comments.length" class="overflow-x-auto px-1">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Carte de commentaire individuelle -->
        <div v-for="comment in paginatedItems" :key="comment.id"
          class="group bg-ash p-6 rounded-[2.5rem] border border-primary/20 hover:border-primary/50 hover:bg-WtB hover:shadow-2xl transition-all duration-500">

          <!-- En-tête du commentaire : Date et lien vers l'incident -->
          <div class="flex items-start justify-between mb-4">
            <div class="text-[9px] font-black text-hsa uppercase tracking-[0.2em] bg-ash/10 px-3 py-1 rounded-full">
              {{ formatDateShort(comment.created_at) }}
            </div>
            <NuxtLink :to="`/vigitech/${comment.incident_id}`" class="text-primary hover:scale-110 transition-transform"
              title="Ouvrir l'incident">
              <IconExternalLink class="w-4 h-4" />
            </NuxtLink>
          </div>

          <!-- Corps du commentaire : Contenu textuel -->
          <p class="text-sm text-BtW leading-relaxed font-medium mb-6 line-clamp-3">
            "{{ comment.content }}"
          </p>

          <!-- Pied de carte : Référence à l'incident lié -->
          <div class="pt-4 border-t border-ash/10 flex items-center justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-[8px] font-black text-hsa uppercase tracking-widest mb-1">Sur l'Incident</p>
              <p class="text-[11px] font-black text-BtW truncate pr-4">
                {{ decodeHtmlEntities(comment.incident_title) }}
              </p>
            </div>
            <NuxtLink :to="`/vigitech/${comment.incident_id}`">
              <UiBaseButton variant="ghost" size="sm"
                class="!px-3 !py-1.5 !rounded-xl !text-[9px] !bg-primary/5 hover:!bg-primary !text-primary hover:!text-WtB transition-all">
                Voir
              </UiBaseButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-center">
      <div class="w-24 h-24 bg-ash/5 rounded-[3rem] flex items-center justify-center mb-8 border border-ash/10">
        <IconMessage class="w-10 h-10 text-ash/30" />
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

// Propriétés reçues
const props = defineProps<{
  comments: any[]
}>()

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
