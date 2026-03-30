<template>
  <div class="space-y-4">
    <p class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] mb-6 text-center">
      Choisissez une méthode sécurisée
    </p>
    <div class="grid grid-cols-1 gap-3 relative">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 z-10 flex items-center justify-center bg-WtB/50 backdrop-blur-[1px] rounded-2xl">
        <UiLogoLoader size="sm" />
      </div>

      <button v-for="method in availableMethods" :key="method" @click="handleSelectMethod(method)"
        :disabled="loading"
        class="flex items-center gap-4 p-4 rounded-2xl border border-ashAct bg-ash/5 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 text-left group disabled:opacity-50">
        <div
          :class="['p-3 rounded-xl transition-colors', getMfaMethodInfo(method).bg, getMfaMethodInfo(method).color]">
          <component :is="getMfaMethodInfo(method).icon" class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-BtW group-hover:text-primary transition-colors">{{
            getMfaMethodInfo(method).label }}</h4>
          <p class="text-[10px] text-hsa font-medium">{{ getMfaMethodInfo(method).description }}</p>
        </div>
        <IconChevronRight
          class="w-5 h-5 text-hsa/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IconChevronRight } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { getMfaMethodInfo } from '~/utils/mfa'

const authStore = useAuthStore()

const availableMethods = computed(() => authStore.mfaSession?.available_methods || [])
const loading = ref(false)

const handleSelectMethod = async (method: string) => {
  loading.value = true
  await authStore.selectMfaMethod(method)
  loading.value = false
}
</script>
