<template>
  <UiBaseCard class="!rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="p-4 space-y-3">
      <!-- Comment content -->
      <div v-if="isEditing" class="space-y-3">
        <textarea v-model="editContentLocal" rows="3"
          class="w-full p-3 rounded-xl bg-WtB border border-ash/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary transition-all resize-none" />
        <div class="flex gap-2 justify-end">
          <UiBaseButton variant="ghost" size="sm" @click="$emit('cancel')" class="!rounded-xl !text-[10px]">
            Annuler
          </UiBaseButton>
          <UiBaseButton variant="primary" size="sm" @click="$emit('save', editContentLocal)"
            :disabled="!editContentLocal.trim() || saving" class="!rounded-xl !text-[10px]">
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </UiBaseButton>
        </div>
      </div>

      <!-- Normal view -->
      <div v-else>
        <div class="flex items-start justify-between gap-3">
          <p class="text-BtW text-sm leading-snug font-bold flex-1">{{ comment.content }}</p>
          <button v-if="canEdit" @click="$emit('edit')"
            class="shrink-0 p-1.5 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-all active:scale-95"
            title="Modifier">
            <IconEdit class="w-3.5 h-3.5" />
          </button>
          <button @click="$emit('delete', comment.id)"
            class="shrink-0 p-1.5 rounded-lg hover:bg-danger/10 text-hsa hover:text-danger transition-all active:scale-95"
            title="Supprimer">
            <IconTrash class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Footer: incident link + relative time + avatar -->
      <div class="flex items-center justify-between pt-2 border-t border-ash/20">
        <NuxtLink :to="`/vigitech/${comment.incident_id}`"
          class="flex items-center gap-1.5 text-[10px] text-primary hover:text-primary/80 font-black truncate transition-colors max-w-[60%]">
          <IconExternalLink class="w-3 h-3 shrink-0" />
          <span class="truncate">{{ incidentTitle }}</span>
        </NuxtLink>
        <div class="flex items-center gap-2 shrink-0">
          <div class="w-5 h-5 rounded-full overflow-hidden border border-ash/20 bg-ash/10">
            <img :src="avatarUrl" class="w-full h-full object-cover" />
          </div>
          <span class="text-[10px] text-hsa font-bold">{{ relativeTime }}</span>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconEdit, IconExternalLink, IconTrash } from '@tabler/icons-vue'
import { formatRelativeTime } from '~/utils/date'

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

const emit = defineEmits(['edit', 'cancel', 'save', 'delete'])

const editContentLocal = ref(props.editContent)

const relativeTime = computed(() => {
  return formatRelativeTime(props.comment.created_at)
})

watch(() => props.editContent, (val) => {
  editContentLocal.value = val
})
</script>
