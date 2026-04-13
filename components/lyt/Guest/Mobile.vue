<template>
  <Transition enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform -translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in" leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-4 opacity-0">
    <div v-if="show"
      class="fixed inset-0 z-40 md:hidden pt-24 px-4 bg-WtB/95 backdrop-blur-xl flex flex-col items-center overflow-y-auto">
      <div class="flex flex-col gap-4 w-full max-w-sm text-center pb-8">

        <!-- Navigation Links -->
        <NuxtLink v-for="item in navHeader" :key="item.label" :to="item.path" @click="$emit('close')"
          class="p-3 rounded-xl text-lg font-bold hover:bg-ash transition-colors"
          :class="{ 'text-primary bg-primary/5': isLinkActive(item.path) }">
          {{ item.label }}
        </NuxtLink>

        <hr class="border-ash my-2" />

        <!-- Auth Section -->
        <div class="flex flex-col gap-3">
          <template v-if="!authStore.user">
            <!-- Hints for Mobile -->
            <template v-if="authStore.hints.length > 0">
              <div class="text-left mb-2 px-2">
                <p class="text-[10px] font-black text-hsa uppercase tracking-[0.2em]">Comptes mémorisés</p>
              </div>

              <div class="space-y-3">
                <div v-for="hint in authStore.hints" :key="hint.id" @click="handleSelectHint(hint)"
                  class="flex items-center gap-4 p-4 rounded-2xl bg-ash/30 border border-ash/50 active:scale-[0.98] transition-all">
                  <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-WtB shadow-sm">
                    <img :src="getUserAvatarUrl(hint.avatar_url, hint.name)" alt="Avatar"
                      class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 text-left min-w-0">
                    <p class="text-sm font-black text-BtW truncate">{{ hint.name }}</p>
                    <p class="text-[10px] text-hsa font-bold uppercase tracking-wider truncate">
                      {{ hint.organization || 'Personnel' }}
                    </p>
                  </div>
                  <IconChevronRight class="w-5 h-5 text-hsa" />
                </div>
              </div>

              <div class="mt-4">
                <NuxtLink to="/auth/login?hint=0" @click="$emit('close')"
                  class="block w-full py-4 rounded-2xl border-2 border-dashed border-ash text-hsa font-bold hover:border-primary/30 hover:text-primary transition-all">
                  Utiliser un autre compte
                </NuxtLink>
              </div>
            </template>

            <!-- Default Login Button -->
            <template v-else>
              <UiBaseButton to="/auth/login" @click="$emit('close')"
                class="p-4 rounded-2xl text-lg font-black shadow-lg shadow-primary/20">
                Se connecter
              </UiBaseButton>
            </template>
          </template>

          <!-- Authenticated Section -->
          <template v-else>
            <div class="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 mb-4">
              <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-WtB shadow-sm">
                <img :src="authStore.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 text-left min-w-0">
                <p class="text-sm font-black text-BtW truncate">{{ authStore.user.first_name }}</p>
                <p class="text-[10px] text-primary font-black uppercase tracking-widest">Connecté</p>
              </div>
            </div>

            <template v-for="link in authLinks" :key="link.path">
              <UiBaseButton v-if="link.type === 'link'" :to="link.path" @click="$emit('close')"
                class="p-4 rounded-2xl text-lg font-black">
                {{ link.label }}
              </UiBaseButton>
              <UiBaseButton v-else-if="link.type === 'button'" @click="link.action(); $emit('close')" variant="ghost"
                class="!p-4 rounded-2xl !text-lg !font-black" :class="link.class">
                {{ link.label }}
              </UiBaseButton>
            </template>
          </template>
        </div>
      </div>

      <div class="mt-auto py-8 border-t border-ash w-full text-center">
        <p class="text-[10px] font-black text-hsa uppercase tracking-[0.3em]">CYPASS &copy; {{ new Date().getFullYear()
          }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IconChevronRight } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { getUserAvatarUrl } from '~/utils/user'

const props = defineProps<{
  show: boolean
  navHeader: Array<{ label: string, path: string }>
  authLinks: any[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const authStore = useAuthStore()
const route = useRoute()

const isLinkActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const handleSelectHint = (hint: any) => {
  emit('close')
  navigateTo({
    path: '/auth/login',
    query: { hint: hint.id }
  })
}
</script>
