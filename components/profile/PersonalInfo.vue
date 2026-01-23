<template>
  <UiBaseCard title="Informations Personnelles">
    <form @submit.prevent="$emit('update')" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Prénom</label>
          <input type="text" v-model="modelValue.prenom"
            class="w-full px-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Nom</label>
          <input type="text" v-model="modelValue.nom"
            class="w-full px-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-xs font-bold text-hsa uppercase">Email actuel</label>
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <IconMail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input type="email" :value="modelValue.email" disabled
              class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash/50 border border-ashAct text-hsa cursor-not-allowed outline-none" />
          </div>
          <UiStatusBadge :status="emailVerified ? 'Verified' : 'Pending'" />
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-xs font-bold text-hsa uppercase">Organisation</label>
        <input type="text" :value="modelValue.organisation" disabled
          class="w-full px-4 py-2.5 rounded-lg bg-ash/50 border border-ashAct text-hsa cursor-not-allowed outline-none" />
      </div>

      <div class="pt-4 flex justify-end">
        <UiBaseButton type="submit" :loading="loading">
          Enregistrer les modifications
        </UiBaseButton>
      </div>
    </form>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconMail } from '@tabler/icons-vue'

defineProps<{
  modelValue: {
    prenom: string
    nom: string
    email: string
    organisation: string
  }
  loading: boolean
  emailVerified: boolean
}>()

defineEmits(['update', 'update:modelValue'])
</script>
