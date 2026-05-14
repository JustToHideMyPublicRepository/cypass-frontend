<template>
  <UiBaseCard
    class="group transition-all hover:shadow-md border-ash/30 bg-WtB p-3 relative overflow-hidden h-full flex flex-col justify-center">

    <div class="relative flex-1">
      <!-- Normal view -->
      <div v-if="!isEditing" class="flex items-center gap-3">
        <!-- Avatar / Icon -->
        <div class="relative shrink-0">
          <div
            class="w-10 h-10 rounded-xl overflow-hidden border border-ash bg-ash/10 shadow-sm group-hover:rotate-3 transition-transform duration-500">
            <img :src="avatarUrl" class="w-full h-full object-cover" />
          </div>
          <div
            class="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-WtB shadow-sm flex items-center justify-center">
            <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>

        <!-- Content -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 overflow-hidden">
            <p class="text-xs font-bold text-BtW truncate leading-tight tracking-tight">
              "{{ comment.content }}"
            </p>
          </div>

          <div class="flex items-center gap-2 mt-1">
            <NuxtLink :to="`/vigitech/${comment.incident_id}`"
              class="inline-flex items-center gap-1 text-[9px] font-bold text-primary uppercase tracking-tighter hover:underline">
              <IconExternalLink class="w-2.5 h-2.5" />
              #{{ incidentTitle }}
            </NuxtLink>

            <span class="inline-flex items-center gap-1 text-[9px] font-bold text-hsa/60 uppercase tracking-tighter">
              <IconClock class="w-2.5 h-2.5" />
              {{ relativeTime }}
            </span>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex items-center gap-1 shrink-0">
          <button v-if="canEdit" @click="$emit('edit')"
            class="p-2 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-colors" title="Modifier">
            <IconEdit class="w-3.5 h-3.5" />
          </button>
          <button @click="$emit('delete', comment.id)"
            class="p-2 rounded-lg hover:bg-danger/10 text-hsa hover:text-danger transition-colors" title="Supprimer">
            <IconTrash class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Editing mode -->
      <div v-else class="space-y-3 animate-fade-in">
        <textarea v-model="editContentLocal" rows="2"
          class="w-full p-3 rounded-xl bg-ash/5 border border-ash/20 text-xs font-bold text-BtW outline-none focus:border-primary/40 transition-all resize-none" />
        <div class="flex gap-2 justify-end">
          <UiBaseButton variant="ghost" size="sm" @click="$emit('cancel')" class="!h-8 !px-3 !text-[10px]">
            Annuler
          </UiBaseButton>
          <UiBaseButton variant="primary" size="sm" @click="$emit('save', editContentLocal)"
            :disabled="!editContentLocal.trim() || saving" class="!h-8 !px-4 !text-[10px]">
            {{ saving ? '...' : 'Sauver' }}
          </UiBaseButton>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconEdit, IconExternalLink, IconTrash, IconClock } from '@tabler/icons-vue'
import { formatRelativeTime } from '~/utils/date'
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  comment: any
  incidentTitle: string
  avatarUrl: string
  formattedDate: string
  canEdit: boolean
  isEditing: boolean
  saving: boolean
  editContent: string
}>()

const emit = defineEmits(['edit', 'cancel', 'save', 'delete', 'show-detail'])

const editContentLocal = ref(props.editContent)

const relativeTime = computed(() => {
  return formatRelativeTime(props.comment.created_at)
})

watch(() => props.editContent, (val) => {
  editContentLocal.value = val
})
</script>
