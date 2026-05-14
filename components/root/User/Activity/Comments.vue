<template>
  <div class="space-y-6">
    <!-- Affichage si des commentaires existent -->
    <div v-if="comments.length" class="px-1">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Carte de commentaire individuelle -->
        <UiBaseCard v-for="comment in paginatedItems" :key="comment.id"
          class="group transition-all hover:shadow-md border-ash/30 bg-WtB p-3 relative overflow-hidden">

          <div class="flex items-center gap-4">
            <!-- Icon / Incident Avatar Source -->
            <NuxtLink :to="`/vigitech/${comment.incident_id}`"
              class="w-10 h-10 rounded-xl overflow-hidden border border-ash bg-ash/10 shrink-0 shadow-sm block hover:ring-2 hover:ring-primary/20 transition-all">
              <img :src="userAvatarUrl" :alt="comment.incident_title" class="w-full h-full object-cover" />
            </NuxtLink>

            <!-- Info -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 overflow-hidden">
                <h5>{{ comment.content }}</h5>
              </div>

              <div class="flex items-center gap-2 mt-1">
                <span class="inline-flex items-center gap-1 text-[9px] tracking-tighter">
                  {{ decodeHtmlEntities(comment.incident_title) }}
                </span>

                <span class="inline-flex items-center gap-1 text-[9px] text-hsa/60">
                  <IconCalendar class="w-2.5 h-2.5" />
                  {{ formatShortDate(comment.created_at) }}
                </span>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center gap-1 shrink-0">
              <NuxtLink :to="`/vigitech/${comment.incident_id}`"
                class="p-2 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all"
                title="Voir l'incident">
                <IconExternalLink class="w-3.5 h-3.5" />
              </NuxtLink>
            </div>
          </div>
        </UiBaseCard>
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-16 h-16 bg-hsa/10 rounded-3xl flex items-center justify-center mb-6 border border-ash/10">
        <IconMessage class="w-7 h-7 text-hsa" />
      </div>
      <h4 class="text-lg font-black text-BtW">Aucun commentaire</h4>
      <p class="text-xs font-bold text-hsa mt-1">Cet utilisateur n'a pas encore participé aux discussions.</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 pt-6 border-t border-ash/10">
      <UiBaseButton variant="ghost" size="sm" :disabled="page === 1" @click="page--"
        class="!p-2.5 !rounded-xl hover:!bg-primary/10 hover:!text-primary transition-all">
        <IconChevronLeft class="w-4 h-4" />
      </UiBaseButton>
      <div class="px-4 py-1.5 rounded-xl bg-ash/5 text-[9px] font-black text-BtW tracking-widest uppercase">
        Page <span class="text-primary">{{ page }}</span> / {{ totalPages }}
      </div>
      <UiBaseButton variant="ghost" size="sm" :disabled="page === totalPages" @click="page++"
        class="!p-2.5 !rounded-xl hover:!bg-primary/10 hover:!text-primary transition-all">
        <IconChevronRight class="w-4 h-4" />
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMessage, IconExternalLink, IconChevronLeft, IconChevronRight, IconCalendar } from '@tabler/icons-vue'
import { formatShortDate } from '~/utils/date'
import { decodeHtmlEntities } from '~/utils/format'
import { useAuthStore } from '~/stores/back/user/auth'

// Propriétés reçues
const props = defineProps<{
  comments: any[]
  userAvatarUrl: string
}>()

const authStore = useAuthStore()

// Logique de pagination
const page = ref(1)
const pageSize = 6
const totalPages = computed(() => Math.ceil(props.comments.length / pageSize))
const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return props.comments.slice(start, start + pageSize)
})
</script>
