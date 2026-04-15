<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="bg-ash/10 rounded-2xl p-6 border border-ash/30 space-y-4">
      <p class="text-sm text-BtW font-medium leading-relaxed">
        Pour des raisons de sécurité, vous avez besoin d'un lien de gestion valide pour accéder à vos préférences.
      </p>
      <form @submit.prevent="$emit('submit')" class="space-y-4">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Adresse email <span
              class="text-error">*</span></label>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconMail class="w-5 h-5" />
            </div>
            <input type="email" :value="modelValue"
              @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" required
              placeholder="votre@email.com" class="input pl-12" autofocus />
          </div>
        </div>

        <UiBaseButton type="submit" variant="primary" class="w-full !rounded-2xl min-h-[3rem]" :loading="loading">
          Envoyer un lien
        </UiBaseButton>
      </form>
    </div>

    <div class="text-center">
      <NuxtLink to="/"
        class="text-xs font-bold text-hsa hover:text-primary transition-colors flex items-center justify-center gap-1.5">
        <IconChevronLeft class="w-3 h-3" /> Retourner à l'accueil
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMail, IconChevronLeft } from '@tabler/icons-vue'

defineProps<{
  modelValue: string
  loading: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}>()
</script>
