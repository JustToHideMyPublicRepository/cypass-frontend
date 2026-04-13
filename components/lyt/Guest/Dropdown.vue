<template>
  <div class="relative" ref="dropdownRef">
    <button @click="isOpen = !isOpen"
      class="flex items-center gap-3 px-1.5 py-1.5 pr-4 rounded-full bg-primary/10 border border-ash hover:border-primary/10 over:bg-secondary/10 shadow-sm hover:shadow-md transition-all group">
      <div
        class="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border-2 border-WtB shadow-inner group-hover:scale-105 transition-transform"
        :class="[planBorderClass, !planBorderClass && !hints ? 'bg-primary/10' : '']">
        <img :src="displayAvatar" alt="Avatar" class="w-full h-full object-cover" />
      </div>
      <div class="flex flex-col items-start leading-none gap-0.5">
        <span class="text-[10px] font-bold text-hsa uppercase tracking-wider">
          {{ authStore.user ? 'Compte' : 'Continuer avec' }}
        </span>
        <span class="text-sm font-bold group-hover:text-primary transition-colors max-w-[100px] truncate"
          :class="(profilStore.profile?.is_reported || authStore.user?.is_reported) ? 'text-warning' : 'text-BtW'">
          {{ displayName }}
        </span>
      </div>
      <IconChevronDown class="w-4 h-4 text-hsa group-hover:text-primary transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }" />
    </button>

    <Transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
      <div v-if="isOpen"
        class="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-WtB border border-ash shadow-lg z-50 overflow-hidden">

        <!-- Mode Connecté -->
        <template v-if="authStore.user">
          <div class="p-3 border-b border-ash bg-ash/20">
            <p class="text-xs font-bold text-hsa uppercase tracking-wider mb-1">Connecté en tant que</p>
            <p class="text-sm font-bold truncate transition-colors mb-1.5"
              :class="(profilStore.profile?.is_reported || authStore.user?.is_reported) ? 'text-warning' : 'text-BtW'">
              {{ authStore.fullName }}
            </p>

            <div v-if="profilStore.profile?.plan || authStore.user?.plan"
              class="flex flex-col gap-1 mt-2 pt-2 border-t border-ash/20">
              <div class="flex items-center justify-between text-[10px]">
                <span class="font-black text-hsa uppercase tracking-tighter">Plan actuel</span>
                <span class="font-black px-1.5 py-0.5 rounded uppercase" :class="planBadgeClass">
                  {{ profilStore.profile?.plan?.name || authStore.user?.plan?.name }}
                </span>
              </div>
              <div class="flex items-center justify-between text-[10px]">
                <span class="font-black text-hsa uppercase tracking-tighter">Crédits</span>
                <span class="font-black text-BtW">
                  {{ profilStore.profile?.plan?.credits ?? authStore.user?.plan?.credits }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- Mode Guest (Hints) -->
        <template v-else-if="hints && hints.length > 0">
          <div class="p-3 border-b border-ash bg-ash/20">
            <p class="text-xs font-bold text-hsa uppercase tracking-wider mb-1">Comptes enregistrés</p>
          </div>
          <div class="py-1 max-h-48 overflow-y-auto">
            <div v-for="hint in hints" :key="hint.id" @click="handleSelectHint(hint)"
              class="flex items-center gap-3 px-4 py-3 hover:bg-ash transition-colors cursor-pointer group/item">
              <div class="w-8 h-8 rounded-full overflow-hidden border border-ash shadow-sm">
                <img :src="getUserAvatarUrl(hint.avatar_url, hint.name)" alt="Avatar"
                  class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-BtW truncate">{{ hint.name }}</p>
                <p class="text-[10px] text-hsa truncate uppercase tracking-tighter">
                  {{ hint.organization || 'Personnel' }}</p>
              </div>
            </div>
          </div>
          <div class="p-2 border-t border-ash bg-ash/10 flex flex-col gap-1">
            <NuxtLink to="/auth/login"
              class="block w-full text-center py-2 text-[10px] font-black text-primary uppercase hover:underline">
              Voir tout
            </NuxtLink>
            <NuxtLink to="/auth/login?hint=0"
              class="block w-full text-center py-2 text-[10px] font-black text-primary uppercase hover:underline">
              Utiliser un autre compte
            </NuxtLink>
          </div>
        </template>
        <div class="py-1">
          <template v-for="link in authLinks" :key="link.path">
            <NuxtLink v-if="link.type === 'link'" :to="link.path" @click="isOpen = false"
              v-tooltip="getLinkTooltip(link.path)"
              class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-ash transition-colors">
              {{ link.label }}
            </NuxtLink>
            <UiBaseButton v-else-if="link.type === 'button'" @click="link.action?.(); isOpen = false"
              v-tooltip="link.path === 'logout' ? getLinkTooltip('logout') : null" variant="ghost"
              class="text-sm !flex !items-center !justify-start gap-2 px-4 py-2 w-full text-danger hover:!bg-danger/10 hover:text-dangerAct transition-all duration-200 font-medium !rounded-none"
              :class="link.class">
              {{ link.label }}
            </UiBaseButton>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { IconChevronDown } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useProfilStore } from '~/stores/back/user/profil'
import { getLinkTooltip } from '~/data/shortcuts'
import { getPlanBorderClass, getPlanBadgeClass } from '~/utils/pricing'
import { getUserAvatarUrl } from '~/utils/user'

const props = defineProps<{
  authLinks?: Array<{
    label: string
    path: string
    type: string
    action?: () => void
    class?: string
  }>
  hints?: any[]
}>()

const authStore = useAuthStore()
const profilStore = useProfilStore()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const displayName = computed(() => {
  if (authStore.user) return authStore.user.first_name
  if (props.hints && props.hints.length > 0) return props.hints[0].name.split(' ')[0]
  return ''
})

const displayAvatar = computed(() => {
  if (authStore.user) return authStore.avatarUrl
  if (props.hints && props.hints.length > 0) return getUserAvatarUrl(props.hints[0].avatar_url, props.hints[0].name)
  return getUserAvatarUrl(null)
})

const handleSelectHint = (hint: any) => {
  isOpen.value = false
  navigateTo({
    path: '/auth/login',
    query: { hint: hint.id }
  })
}

const planBorderClass = computed(() => getPlanBorderClass(profilStore.profile?.plan?.name || authStore.user?.plan?.name))
const planBadgeClass = computed(() => getPlanBadgeClass(profilStore.profile?.plan?.name || authStore.user?.plan?.name))

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
