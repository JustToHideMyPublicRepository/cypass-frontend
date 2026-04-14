<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-4 animate-fade-in">
      <UiLogoLoader size="xl" />
      <p class="text-xs font-black text-primary uppercase tracking-widest animate-pulse">Traitement en cours...</p>
    </div>

    <template v-else>
      <div class="grid gap-3">
        <div v-for="hint in hints" :key="hint.id"
          class="group relative flex items-center gap-4 p-4 rounded-2xl bg-WtB border border-ash hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
          @click="$emit('select', hint)">
          <div
            class="relative w-12 h-12 rounded-full overflow-hidden border-2 border-WtB shadow-sm group-hover:scale-105 transition-transform">
            <img :src="getUserAvatarUrl(hint.avatar_url, hint.name)" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-black text-BtW truncate">{{ hint.name }}</p>
            <p class="text-[10px] text-hsa font-bold uppercase tracking-wider truncate">
              {{ hint.organization || 'Compte Personnel' }}
            </p>
          </div>
          <button @click.stop="$emit('remove', hint.id)"
            class="p-2 rounded-lg text-hsa hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all"
            title="Oublier ce compte">
            <IconTrash class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <button v-if="hints.length > 1" @click="showConfirm = true"
          class="w-full py-3 rounded-xl border border-danger/30 text-danger text-[10px] font-black uppercase tracking-widest hover:bg-danger/5 transition-all flex items-center justify-center gap-2">
          <IconTrash class="w-3 h-3" />
          Tout oublier
        </button>

        <button @click="$emit('use-another')"
          class="w-full py-4 rounded-2xl border-2 bg-ash/30 border-dashed border-ash text-hsa font-bold hover:border-primary/30 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
          <IconUserPlus class="w-5 h-5" />
          Utiliser un autre compte
        </button>
      </div>
    </template>

    <!-- Modal de confirmation pour tout oublier -->
    <UiConfirmModal :show="showConfirm" title="Oublier tous les comptes ?"
      message="Cette action supprimera tous les comptes mémorisés sur cet appareil. Vous devrez ressaisir vos identifiants lors de votre prochaine connexion."
      confirm-text="Oui, tout oublier" cancel-text="Annuler" variant="danger" @cancel="showConfirm = false"
      @confirm="handleClearAll" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconTrash, IconUserPlus } from '@tabler/icons-vue'
import { type AccountHint } from '~/types/auth'
import { getUserAvatarUrl } from '~/utils/user'

defineProps<{
  hints: AccountHint[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', hint: AccountHint): void
  (e: 'remove', id: string): void
  (e: 'clear-all'): void
  (e: 'use-another'): void
}>()

const showConfirm = ref(false)

const handleClearAll = () => {
  showConfirm.value = false
  emit('clear-all')
}
</script>
