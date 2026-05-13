<template>
  <div class="relative group/input">
    <div v-if="user" class="space-y-4">
      <div class="relative">
        <textarea :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
          rows="3" maxlength="1000" placeholder="Partagez votre analyse ou posez une question..."
          class="w-full p-6 pb-10 rounded-[2rem] bg-WtB/50 border border-ash/50 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 focus:bg-WtB transition-all placeholder-hsa/40 resize-none shadow-inner" />
        <div class="absolute bottom-4 right-6 text-[10px] font-black tracking-widest"
          :class="modelValue.length > 900 ? (modelValue.length >= 1000 ? 'text-danger' : 'text-warning') : 'text-hsa/50'">
          {{ modelValue.length }} / 1000
        </div>
      </div>
      <div class="flex justify-end items-center gap-4">
        <p class="text-[10px] text-hsa font-bold italic opacity-60">Soyez respectueux et constructif.</p>
        <UiBaseButton variant="primary" size="md" @click="$emit('submit')" :disabled="!modelValue.trim() || loading">
          <IconSend class="w-4 h-4 mr-2" />
          {{ loading ? 'Publication...' : 'Publier' }}
        </UiBaseButton>
      </div>
    </div>
    <div v-else class="p-8 rounded-[2rem] bg-ash/5 border border-ash/20 text-center backdrop-blur-sm">
      <div class="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
        <IconLock class="w-6 h-6" />
      </div>
      <p>
        <NuxtLink to="/auth/login" class="text-primary hover:underline underline-offset-4">
          Connectez-vous
        </NuxtLink>
        pour participer à la discussion.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconSend, IconLock } from '@tabler/icons-vue'

defineProps<{
  modelValue: string
  loading: boolean
  user: any
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}>()
</script>
