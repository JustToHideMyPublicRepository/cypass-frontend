<template>
  <div class="relative" ref="dropdownRef">
    <button @click="isOpen = !isOpen"
      class="flex items-center gap-3 px-1.5 py-1.5 pr-4 rounded-full bg-primary/10 border border-ash hover:border-primary/10 over:bg-secondary/10 shadow-sm hover:shadow-md transition-all group">
      <div
        class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-WtB shadow-inner group-hover:scale-105 transition-transform">
        <img :src="authStore.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
      </div>
      <div class="flex flex-col items-start leading-none gap-0.5">
        <span class="text-[10px] font-bold text-hsa uppercase tracking-wider">Compte</span>
        <span class="text-sm font-bold text-BtW group-hover:text-primary transition-colors max-w-[100px] truncate">
          {{ authStore.user?.first_name }}
        </span>
      </div>
      <IconChevronDown class="w-4 h-4 text-hsa group-hover:text-primary transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }" />
    </button>

    <Transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
      <div v-if="isOpen"
        class="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-WtB border border-ash shadow-lg z-50 overflow-hidden">
        <div class="p-3 border-b border-ash bg-ash/20">
          <p class="text-xs font-bold text-hsa uppercase tracking-wider">Connecté en tant que</p>
          <p class="text-sm font-bold truncate text-BtW">{{ authStore.fullName }}</p>
        </div>
        <div class="py-1">
          <template v-for="link in authLinks" :key="link.path">
            <NuxtLink v-if="link.type === 'link'" :to="link.path" @click="isOpen = false"
              v-tooltip="getLinkTooltip(link.path)"
              class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-ash transition-colors">
              {{ link.label }}
            </NuxtLink>
            <button v-else-if="link.type === 'button'" @click="link.action?.(); isOpen = false"
              v-tooltip="link.path === 'logout' ? getLinkTooltip('logout') : null"
              class="flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-colors font-medium"
              :class="link.class">
              {{ link.label }}
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconChevronDown } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { getLinkTooltip } from '~/data/shortcuts'

const props = defineProps<{
  authLinks: Array<{
    label: string
    path: string
    type: string
    action?: () => void
    class?: string
  }>
}>()

const authStore = useAuthStore()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

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
