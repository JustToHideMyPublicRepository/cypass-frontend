<template>
  <div
    class="group relative bg-ash/40 backdrop-blur-3xl p-7 md:p-8 rounded-[3rem] border border-ash/30 hover:border-primary/40 hover:bg-ash/60 hover:shadow-[0_40px_100px_rgba(var(--primary-rgb),0.15)] transition-all duration-700 overflow-hidden flex flex-col h-full ring-1 ring-primary/0 hover:ring-primary/20">

    <!-- Premium Animated Glow Gradient -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
    </div>

    <!-- Background Decoration -->
    <div
      class="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700">
    </div>

    <div class="relative flex-1 space-y-6">
      <!-- Normal view with quote style -->
      <div v-if="!isEditing" class="h-full flex flex-col">
        <div class="flex flex-col md:flex-row items-start justify-between gap-6">
          <div class="flex-1 min-w-0">
            <div class="relative">
              <IconQuote class="absolute -top-4 -left-6 w-12 h-12 text-primary/10 -z-0" />
              <p
                class="relative z-10 text-BtW text-lg md:text-xl leading-relaxed font-black transition-opacity tracking-tight">
                {{ comment.content }}
              </p>
            </div>
          </div>

          <!-- Stylized Actions - Side by Side (Always Visible) -->
          <div class="flex flex-row items-center gap-2 shrink-0 transition-all duration-500">
            <button v-if="canEdit" @click="$emit('edit')"
              class="w-11 h-11 flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/60 hover:bg-primary text-primary hover:text-WtB hover:border-primary transition-all active:scale-90 shadow-sm"
              title="Modifier">
              <IconEdit class="w-4 h-4" />
            </button>
            <button @click="$emit('delete', comment.id)"
              class="w-11 h-11 flex items-center justify-center rounded-2xl bg-danger/10 border border-danger/60 hover:bg-danger text-danger hover:text-WtB hover:border-danger transition-all active:scale-90 shadow-sm"
              title="Supprimer">
              <IconTrash class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Editing Field -->
      <div v-else class="space-y-4 animate-fade-in">
        <div class="relative group/field">
          <textarea v-model="editContentLocal" rows="3"
            class="w-full p-5 rounded-[2rem] bg-[#0c0e12]/80 border border-ash/50 text-[14px] font-bold text-BtW outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all resize-none shadow-inner" />
          <div
            class="absolute bottom-4 right-4 text-[10px] font-black text-hsa opacity-50 uppercase tracking-widest pointer-events-none">
            En édition
          </div>
        </div>
        <div class="flex gap-3 justify-end">
          <UiBaseButton variant="ghost" size="sm" @click="$emit('cancel')"
            class="!rounded-2xl !px-6 !text-[11px] !font-black uppercase tracking-[0.2em] border border-ash/20 hover:!bg-ash/10 transition-all">
            Annuler
          </UiBaseButton>
          <UiBaseButton variant="primary" size="sm" @click="$emit('save', editContentLocal)"
            :disabled="!editContentLocal.trim() || saving"
            class="!rounded-2xl !px-8 !text-[11px] !font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            {{ saving ? 'Sync...' : 'Sauvegarder' }}
          </UiBaseButton>
        </div>
      </div>
    </div>

    <!-- Refined Footer -->
    <div class="relative mt-8 pt-6 border-t border-ash/10 flex items-center justify-between">
      <NuxtLink :to="`/vigitech/${comment.incident_id}`" class="flex items-center gap-3 group/link max-w-[65%]">
        <div
          class="w-10 h-10 flex items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover/link:bg-primary group-hover/link:text-WtB shadow-inner transition-all duration-500 transform group-hover/link:-rotate-6">
          <IconExternalLink class="w-4 h-4" />
        </div>
        <div class="min-w-0">
          <p
            class="text-[9px] font-black text-hsa uppercase tracking-[0.2em] leading-none mb-1 group-hover/link:text-primary transition-colors">
            Incident lié</p>
          <p
            class="text-[10px] font-black text-BtW truncate group-hover/link:translate-x-1 transition-transform opacity-70 group-hover/link:opacity-100 italic">
            #{{ incidentTitle }}
          </p>
        </div>
      </NuxtLink>

      <div class="flex items-center gap-4 shrink-0">
        <div class="hidden sm:block text-right">
          <p class="text-[11px] text-BtW font-black leading-tight">{{ relativeTime }}</p>
        </div>
        <div class="relative">
          <div
            class="w-9 h-9 md:w-11 md:h-11 rounded-2xl overflow-hidden border-2 border-ash/20 shadow-xl bg-ash/40 shrink-0 transform group-hover:scale-110 transition-transform duration-500">
            <img :src="avatarUrl" class="w-full h-full object-cover" />
          </div>
          <div
            class="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-[#13151a] shadow-sm flex items-center justify-center">
            <div class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconEdit, IconExternalLink, IconTrash, IconQuote } from '@tabler/icons-vue'
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
