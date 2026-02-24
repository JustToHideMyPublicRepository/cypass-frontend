<template>
  <UiBaseCard class="!rounded-[2rem] overflow-hidden">
    <div class="p-6 space-y-4">
      <!-- Comment content (prominent) -->
      <div v-if="isEditing" class="space-y-3">
        <textarea v-model="editContentLocal" rows="3"
          class="w-full p-4 rounded-xl bg-WtB border border-ash/50 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all resize-none" />
        <div class="flex gap-2 justify-end">
          <UiBaseButton variant="ghost" size="sm" @click="$emit('cancel')" class="!rounded-lg !text-[10px]">
            Annuler
          </UiBaseButton>
          <UiBaseButton variant="primary" size="sm" @click="$emit('save', editContentLocal)"
            :disabled="!editContentLocal.trim() || saving" class="!rounded-lg !text-[10px]">
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </UiBaseButton>
        </div>
      </div>
      <div v-else class="flex items-start justify-between gap-4">
        <p class="text-BtW text-sm leading-relaxed font-medium">{{ comment.content }}</p>
        <button v-if="canEdit" @click="$emit('edit')"
          class="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest"
          title="Modifier">
          <IconEdit class="w-3 h-3" /> Modifier
        </button>
      </div>

      <!-- Footer: incident link + date + avatar -->
      <div class="flex items-center justify-between pt-3 border-t border-ash/30">
        <NuxtLink :to="`/vigitech/${comment.incident_id}`"
          class="flex items-center gap-1.5 text-[10px] text-primary hover:underline font-black truncate transition-colors max-w-[60%]">
          <IconExternalLink class="w-3 h-3 shrink-0" />
          {{ incidentTitle }}
        </NuxtLink>
        <div class="flex items-center gap-3 shrink-0">
          <div class="w-6 h-6 rounded-full overflow-hidden border border-ash/20 bg-ash/10">
            <img :src="avatarUrl" class="w-full h-full object-cover" />
          </div>
          <span class="text-[10px] text-hsa font-bold">{{ formattedDate }}</span>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconEdit, IconExternalLink } from '@tabler/icons-vue'

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

const emit = defineEmits(['edit', 'cancel', 'save'])

const editContentLocal = ref(props.editContent)

watch(() => props.editContent, (val) => {
  editContentLocal.value = val
})
</script>
