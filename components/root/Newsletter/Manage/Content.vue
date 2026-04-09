<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Identity Section -->
    <div class="space-y-4">
      <h2 class="text-xs font-black uppercase tracking-[0.2em] text-hsa px-1">Votre Profil</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Prénom</label>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconUser class="w-4 h-4" />
            </div>
            <input type="text" :value="firstName"
              @input="$emit('update:firstName', ($event.target as HTMLInputElement).value)"
              @blur="$emit('blur:profile')" placeholder="Prénom" class="input pl-10" />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Nom</label>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconUser class="w-4 h-4" />
            </div>
            <input type="text" :value="lastName"
              @input="$emit('update:lastName', ($event.target as HTMLInputElement).value)" @blur="$emit('blur:profile')"
              placeholder="Nom" class="input pl-10" />
          </div>
        </div>
      </div>
    </div>

    <!-- Preferences -->
    <RootNewsletterManagePreferences :preferences="preferences" :loading-key="loadingKey"
      @toggle="(key, value) => $emit('toggle', key, value)" />

    <!-- Unsubscribe Section -->
    <RootNewsletterManageUnsubscribe :loading="loading" @confirm="$emit('confirm')" />
  </div>
</template>

<script setup lang="ts">
import { IconUser } from '@tabler/icons-vue'

defineProps<{
  firstName: string
  lastName: string
  preferences: any
  loadingKey: string | null
  loading: boolean
}>()

defineEmits<{
  (e: 'update:firstName', value: string): void
  (e: 'update:lastName', value: string): void
  (e: 'blur:profile'): void
  (e: 'toggle', key: string, value: boolean): void
  (e: 'confirm'): void
}>()
</script>
