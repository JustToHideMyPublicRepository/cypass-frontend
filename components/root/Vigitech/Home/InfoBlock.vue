<template>
  <UiBaseCard class="bg-primary text-white border-none !rounded-[2rem] p-1 shadow-xl shadow-primary/20">
    <div class="bg-primary/20 p-6 rounded-[1.8rem] space-y-4">
      <IconAlertTriangle class="w-8 h-8 text-WtB" />
      <template v-if="user">
        <h3 class="text-lg text-WtB font-black leading-tight">{{ greeting }} {{
          user.first_name }}</h3>
        <p class="text-[11px] text-ashAct font-bold leading-relaxed">
          Consultez et suivez vos propres signalements directement dans votre espace personnel.
        </p>
        <NuxtLink to="/dashboard/vigitech">
          <UiBaseButton variant="secondary" block size="sm" class="mt-2 !bg-ash !text-primary !border-none font-black">
            Dashboard
          </UiBaseButton>
        </NuxtLink>
      </template>
      <template v-else>
        <h3 class="text-lg text-WtB font-black leading-tight">Victime d'une attaque ?</h3>
        <p class="text-[11px] text-ashAct font-bold leading-relaxed">
          Connectez-vous pour signaler officiellement l'incident et recevoir notre assistance.
        </p>
        <NuxtLink to="/auth/login">
          <UiBaseButton variant="secondary" block size="sm" class="mt-2 !bg-ash !text-primary !border-none font-black">
            Se connecter
          </UiBaseButton>
        </NuxtLink>
      </template>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconAlertTriangle } from '@tabler/icons-vue'

defineProps<{
  user: any
  greeting: string
}>()
</script>
