<template>
  <UiBaseCard>
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary/10 rounded-lg">
            <IconUser class="w-5 h-5 text-primary" />
          </div>
          <h3 class="text-lg font-bold text-BtW">Informations Personnelles</h3>
        </div>
        <UiBaseButton variant="ghost" @click="$emit('open-edit')" class="text-xs uppercase tracking-widest font-black">
          <template #default>
            <div class="flex items-center gap-2">
              <IconEdit class="w-4 h-4" />
              <span>Modifier</span>
            </div>
          </template>
        </UiBaseButton>
      </div>
    </template>

    <div class="space-y-8 py-2">
      <!-- Identity Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-1">
          <label class="text-[10px] font-black text-hsa/60 uppercase tracking-[0.2em]">Prénom</label>
          <div class="flex items-center gap-3">
            <p class="text-xl font-bold text-BtW tracking-tight">{{ modelValue.prenom || '—' }}</p>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] font-black text-hsa/60 uppercase tracking-[0.2em]">Nom de famille</label>
          <div class="flex items-center gap-3">
            <p class="text-xl font-bold text-BtW tracking-tight">{{ modelValue.nom || '—' }}</p>
          </div>
        </div>
      </div>

      <hr class="border-ashAct" />

      <!-- Contact & Professional Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Email Section -->
        <div class="space-y-3">
          <label class="text-[10px] font-black text-hsa/60 uppercase tracking-[0.2em]">Email de contact</label>
          <div class="flex items-start gap-4">
            <div class="mt-1 p-2 bg-ashAct rounded-lg">
              <IconMail class="w-4 h-4 text-hsa" />
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <p class="font-bold text-BtW">{{ modelValue.email }}</p>
                <div v-if="emailVerified" class="group relative cursor-help">
                  <IconCircleCheck class="w-4 h-4 text-success" />
                  <span
                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-BtW text-WtB text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-wider">Email
                    vérifié</span>
                </div>
                <div v-else class="group relative cursor-help">
                  <IconAlertCircle class="w-4 h-4 text-warning" />
                  <span
                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-BtW text-WtB text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-wider">En
                    attente de vérification</span>
                </div>
              </div>
              <p v-if="!emailVerified"
                class="text-[10px] leading-relaxed text-warning/80 font-bold uppercase tracking-wide max-w-[280px]">
                Veuillez confirmer votre mail pour sécuriser votre compte.
              </p>
            </div>
          </div>
        </div>

        <!-- Organization Section -->
        <div class="space-y-3">
          <label class="text-[10px] font-black text-hsa/60 uppercase tracking-[0.2em]">Organisation</label>
          <div class="flex items-start gap-4">
            <div class="mt-1 p-2 bg-ashAct rounded-lg">
              <IconBuilding class="w-4 h-4 text-hsa" />
            </div>
            <div>
              <p class="font-bold text-BtW">{{ modelValue.organisation || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconUser, IconEdit, IconMail, IconBuilding, IconCircleCheck, IconAlertCircle } from '@tabler/icons-vue'

defineProps<{
  modelValue: {
    prenom: string
    nom: string
    email: string
    organisation: string
  }
  emailVerified: boolean
}>()

defineEmits(['open-edit'])
</script>
