<template>
  <UiBaseModal :show="show" @close="$emit('close')">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-black text-BtW flex items-center gap-2">
          Réactions
        </h3>
        <button @click="$emit('close')"
          class="p-2 rounded-xl text-hsa hover:text-danger hover:bg-danger/10 transition-colors">
          <IconX class="w-5 h-5" />
        </button>
      </div>

      <div class="h-px bg-ash/50"></div>

      <div class="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
        <div v-if="!reactions || reactions.length === 0" class="text-center text-hsa py-8">
          Aucune réaction pour l'instant.
        </div>
        <div v-else v-for="reaction in reactions" :key="reaction.user_id + reaction.type"
          class="flex items-center justify-between p-3 rounded-2xl hover:bg-ash/5 transition-colors group">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div
                class="w-10 h-10 rounded-full overflow-hidden border border-ash/20 bg-ash/10 flex items-center justify-center">
                <img v-if="reaction.avatar_url"
                  :src="getUserAvatarUrl(reaction.avatar_url, reaction.first_name, reaction.last_name)"
                  class="w-full h-full object-cover" />
                <div v-else class="text-[10px] font-black text-primary">
                  {{ reaction.first_name?.[0] || '' }}{{ reaction.last_name?.[0] || 'U' }}
                </div>
              </div>
              <!-- Badge de réaction -->
              <div
                class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-ashAct text-[10px]">
                {{ getReactionEmoji(reaction.type) }}
              </div>
            </div>
            <div>
              <p class="text-sm font-black text-BtW group-hover:text-primary transition-colors">
                {{ [reaction.first_name, reaction.last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'
import type { ReactionDetail } from '~/types/vigitech'
import { getReactionEmoji } from '~/utils/vigitech'
import { getUserAvatarUrl } from '~/utils/user'

defineProps<{
  show: boolean
  reactions?: ReactionDetail[]
}>()

defineEmits(['close'])
</script>
