<template>
  <UiBaseCard
    class="group transition-all hover:shadow-md border-ash/30 bg-WtB p-3 relative overflow-hidden h-full flex flex-col justify-center min-h-[100px]">

    <div class="relative flex-1">
      <!-- Normal View -->
      <div v-if="!isEditing" class="flex items-center gap-3">
        <!-- Icon -->
        <div
          :class="['w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all duration-500 transform group-hover:rotate-6 shadow-sm', config.bgClass, config.textClass]">
          <span v-if="!isComment" class="text-xl leading-none">{{ config.emoji }}</span>
          <IconMessage v-else class="w-5 h-5" />
        </div>

        <!-- Info -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 overflow-hidden">
            <p class="text-[10px] font-black truncate">
              {{ config.headerPrefix }}
              <span v-if="config.typeLabel" :class="config.textClass">
                {{ config.typeLabel }}
              </span>
            </p>
          </div>

          <h5 class="text-xs block font-bold text-BtW tracking-tight mt-1 truncate">
            {{ displayTitle || 'Sans titre' }}
          </h5>

          <!-- Meta -->
          <div class="flex items-center gap-2 mt-1.5">
            <span class="inline-flex items-center gap-1 text-[9px] font-bold text-hsa/60 uppercase tracking-tighter">
              <IconClock class="w-2.5 h-2.5" />
              {{ relativeTime }}
            </span>
            <span class="inline-flex items-center gap-1 text-[9px] font-black text-primary/80 uppercase tracking-tighter">
              <component :is="isComment ? IconMessage : IconCircleCheck" class="w-2.5 h-2.5" />
              {{ categoryLabel }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 shrink-0">
          <!-- Edit/Delete for My Comments tab -->
          <template v-if="isComment">
            <button v-if="canEdit" @click="$emit('edit', item)"
              class="p-2 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-colors" title="Modifier">
              <IconEdit class="w-3.5 h-3.5" />
            </button>
            <button @click="$emit('delete', item.id)"
              class="p-2 rounded-lg hover:bg-danger/10 text-hsa hover:text-danger transition-colors" title="Supprimer">
              <IconTrash class="w-3.5 h-3.5" />
            </button>
          </template>

          <!-- Remove Reaction Button -->
          <button v-else @click="$emit('remove-reaction', item)" :disabled="loading"
            class="p-2 rounded-lg hover:bg-danger/10 text-hsa hover:text-danger transition-colors group/remove disabled:opacity-50"
            title="Retirer la réaction">
            <div class="relative w-4 h-4 flex items-center justify-center">
              <UiLogoLoader v-if="loading" size="xs" />
              <IconMoodOff v-else class="w-3.5 h-3.5 group-hover/remove:scale-110 transition-transform" />
            </div>
          </button>

          <NuxtLink :to="targetUrl"
            class="p-2 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-WtB transition-all" title="Voir">
            <IconExternalLink class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </div>

      <!-- Editing Mode -->
      <div v-else class="space-y-3 animate-fade-in py-1">
        <textarea v-model="localEditContent" rows="3"
          class="w-full p-3 rounded-xl bg-ash/5 border border-ashAct text-xs font-bold text-BtW outline-none focus:border-primary/40 transition-all resize-none shadow-inner"
          placeholder="Modifier votre commentaire..." />
        <div class="flex gap-2 justify-end">
          <UiBaseButton variant="ghost" size="sm" @click="$emit('cancel')" class="!h-8 !px-3 !text-[10px] uppercase font-black tracking-widest bg-ash/10 hover:bg-ash/20">
            Annuler
          </UiBaseButton>
          <UiBaseButton variant="primary" size="sm" @click="$emit('save', localEditContent)"
            :disabled="!localEditContent.trim() || saving" class="!h-8 !px-4 !text-[10px] uppercase font-black tracking-widest shadow-lg shadow-primary/20">
            {{ saving ? '...' : 'Sauvegarder' }}
          </UiBaseButton>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconExternalLink, IconMessage, IconClock, IconCircleCheck, IconMoodOff, IconEdit, IconTrash } from '@tabler/icons-vue'
import { formatRelativeTime } from '~/utils/date'
import { getReactionEmoji, getReactionLabel, getReactionColor, getReactionTextColorOnly } from '~/utils/vigitech'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  item: any
  type: 'reaction' | 'comment'
  loading?: boolean
  isEditing?: boolean
  saving?: boolean
  editContent?: string
}>()

const emit = defineEmits(['remove-reaction', 'edit', 'delete', 'save', 'cancel'])

const isComment = computed(() => props.type === 'comment')
const localEditContent = ref(props.editContent || '')

watch(() => props.editContent, (val) => {
  localEditContent.value = val || ''
})

const categoryLabel = computed(() => {
  if (isComment.value) return 'Commentaire'
  return props.item.target_type === 'comment' ? 'Commentaire' : 'Incident'
})

const displayTitle = computed(() => {
  if (isComment.value) return props.item.content
  return props.item.target_title
})

const targetUrl = computed(() => {
  const id = props.item.incident_id || props.item.target_id
  return `/vigitech/${id}`
})

const relativeTime = computed(() => {
  return formatRelativeTime(props.item.created_at)
})

const canEdit = computed(() => {
  if (!isComment.value) return false
  const createdAt = new Date(props.item.created_at).getTime()
  const now = Date.now()
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60)
  return hoursDiff <= 24
})

const config = computed(() => {
  if (isComment.value) {
    return {
      headerPrefix: 'A ajouté un',
      typeLabel: 'commentaire',
      bgClass: 'bg-primary/10',
      textClass: 'text-primary'
    }
  }

  const type = props.item.type
  return {
    emoji: getReactionEmoji(type),
    headerPrefix: 'A réagi avec',
    typeLabel: getReactionLabel(type),
    bgClass: getReactionColor(type).split(' ').find(c => c.startsWith('bg-')) || 'bg-primary/5',
    textClass: getReactionTextColorOnly(type)
  }
})
</script>
