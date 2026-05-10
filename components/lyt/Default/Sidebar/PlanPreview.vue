<template>
  <div class="shrink-0 p-4 border-t border-ash bg-ash/10 space-y-4">
    <!-- Plan Preview (if not collapsed) -->
    <div v-if="!isCollapsed && profilStore.profile?.plan"
      class="px-2 py-3 rounded-xl bg-ash/50 border border-ash/50 space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-[9px] font-black text-hsa uppercase tracking-widest">Plan</span>
        <span class="text-[9px] font-black px-1.5 py-0.5 rounded uppercase" :class="planBadgeClass">
          {{ profilStore.profile.plan.name }}
        </span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-[9px] font-black text-hsa uppercase tracking-widest">Crédits</span>
        <span class="text-[10px] font-black text-BtW">{{ profilStore.profile.plan.credits }}</span>
      </div>
      <div class="w-full bg-ash h-1 rounded-full overflow-hidden">
        <div class="bg-primary h-full transition-all duration-500" :style="{ width: `${planUsageProgress}%` }"></div>
      </div>
      <NuxtLink to="/dashboard/billing" @click="$emit('close')"
        class="flex items-center justify-between group/manage pt-1.5 hover:opacity-80 transition-opacity">
        <span
          class="text-[9px] font-black text-hsa uppercase tracking-[0.2em] group-hover/manage:text-primary transition-colors">
          Gérer mon abonnement</span>
        <IconChevronRight class="w-3 h-3 text-hsa group-hover/manage:text-primary transition-colors" />
      </NuxtLink>
    </div>

    <!-- Logout Button -->
    <UiBaseButton @click="$emit('logout')" v-tooltip="getLinkTooltip('logout')" variant="ghost"
      class="!flex !items-center !justify-start gap-3 px-4 py-2 w-full !rounded-xl text-danger hover:!bg-danger/10 hover:text-dangerAct transition-all duration-200 group-logout font-medium"
      :class="{ '!justify-center !px-0': isCollapsed }" :title="isCollapsed ? 'Déconnexion' : ''">
      <IconLogout class="w-5 h-5 group-logout-hover:scale-110 transition-transform shrink-0" />
      <span v-show="!isCollapsed" class="truncate">Déconnexion</span>
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconChevronRight, IconLogout } from '@tabler/icons-vue'
import { useProfilStore } from '~/stores/back/user/profil'
import { getPlanInfo, getPlanBadgeClass } from '~/utils/pricing'
import { getLinkTooltip } from '~/data/shortcuts'

defineProps<{
  isCollapsed: boolean
}>()

defineEmits(['logout', 'close'])

const profilStore = useProfilStore()

const planBadgeClass = computed(() => getPlanBadgeClass(profilStore.profile?.plan?.name))
const planUsageProgress = computed(() => {
  const plan = profilStore.profile?.plan
  if (!plan) return 0
  const info = getPlanInfo(plan.name)
  if (info.credits === 1000000) return 100
  return Math.min(100, Math.round((plan.credits / info.credits) * 100))
})
</script>
