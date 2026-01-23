<template>
  <div class="relative group">
    <!-- Sophisticated Glow -->
    <div
      class="absolute -inset-1 bg-gradient-to-b from-primary/10 to-transparent rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000">
    </div>

    <UiBaseCard
      class="relative bg-WtB/80 backdrop-blur-xl border-ash/50 rounded-2 overflow-hidden shadow-2xl shadow-primary/5 pt-12 pb-8 px-6">
      <!-- Decorative Elements -->
      <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent"></div>

      <!-- Avatar Section -->
      <div class="relative w-36 h-36 mx-auto mb-8">
        <div
          class="relative z-10 w-full h-full rounded-full p-1.5 bg-gradient-to-tr from-primary via-primary/20 to-secondary shadow-2xl">
          <div class="w-full h-full rounded-full overflow-hidden bg-ash border-4 border-WtB shadow-inner">
            <img :src="authStore.avatarUrl" alt="Avatar"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
        </div>

        <!-- Status Indicator Dot -->
        <div
          class="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-WtB rounded-full z-20 shadow-lg animate-pulse">
        </div>

        <!-- Floating Action Button -->
        <button
          class="absolute -bottom-1 -right-1 z-30 bg-WtB text-primary p-2.5 rounded-2xl shadow-xl hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 group/cam"
          v-tooltip="'Changer la photo'">
          <IconCamera class="w-5 h-5 transition-transform group-hover/cam:rotate-12" />
        </button>
      </div>

      <!-- User Info - Free Layout -->
      <div class="space-y-2 mb-8">
        <h2 class="text-2xl font-black text-BtW text-center tracking-tight">{{ authStore.fullName }}</h2>
        <div class="flex items-center justify-center gap-2">
          <div class="px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
            <span class="text-[10px] font-black uppercase text-primary tracking-widest leading-none">
              {{ user?.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Stats / Metadata - Elegant Presentation -->
      <div class="grid grid-cols-2 gap-4 py-4 border-t border-ash/50">
        <div class="text-center border-r border-ash/50">
          <p class="text-[10px] font-bold text-hsa uppercase tracking-widest mb-1 opacity-60">Depuis le</p>
          <p class="text-xs font-black text-BtW">{{ formatDate(user?.created_at) }}</p>
        </div>
        <div class="text-center">
          <p class="text-[10px] font-bold text-hsa uppercase tracking-widest mb-1 opacity-60">Status</p>
          <div class="flex justify-center">
            <span :class="statusColorClass" class="text-[10px] font-black uppercase tracking-tighter">
              {{ statusLabel.label }}
            </span>
          </div>
        </div>
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconCamera, IconShieldCheck } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  user: any
  status: 'pending' | 'active' | 'pending_delete' | 'deleted' | 'suspended'
}>()

const authStore = useAuthStore()

const statusLabel = computed(() => {
  const map = {
    active: { id: 'Verified', label: 'Actif' },
    pending: { id: 'Pending', label: 'En attente' },
    suspended: { id: 'Error', label: 'Suspendu' },
    pending_delete: { id: 'Warning', label: 'Suppression' },
    deleted: { id: 'Error', label: 'Supprimé' }
  }
  return map[props.status] || map.pending
})

const statusColorClass = computed(() => {
  const map = {
    active: 'text-success',
    pending: 'text-amber-500',
    suspended: 'text-danger',
    pending_delete: 'text-warning',
    deleted: 'text-textClr'
  }
  return map[props.status] || 'text-hsa'
})

const formatDate = (dateString?: string) => {
  if (!dateString) return '...'
  try {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: fr })
  } catch {
    return '...'
  }
}
</script>
