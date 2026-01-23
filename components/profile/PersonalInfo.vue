<template>
  <div class="space-y-6">
    <UiBaseCard title="Informations Personnelles" class="border-l-4 border-l-primary">
      <template #header>
        <UiBaseButton variant="ghost" @click="$emit('open-edit')"
          class="text-xs uppercase tracking-widest font-black h-8 px-3">
          <div class="flex items-center gap-2">
            <IconEdit class="w-4 h-4" />
            <span>Modifier</span>
          </div>
        </UiBaseButton>
      </template>

      <div class="space-y-4">
        <!-- Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Prenom block -->
          <div class="flex items-center p-4 rounded-xl bg-ash border border-ashAct">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-primary/10 rounded-lg">
                <IconUserCircle class="w-5 h-5 text-primary" />
              </div>
              <div class="text-left">
                <p class="text-[10px] font-bold text-hsa uppercase tracking-widest">Prénom</p>
                <p class="font-bold text-BtW text-lg leading-none mt-1">{{ modelValue.prenom || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Nom block -->
          <div class="flex items-center p-4 rounded-xl bg-ash border border-ashAct">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-secondary/10 rounded-lg">
                <IconUserSquareRounded class="w-5 h-5 text-secondary" />
              </div>
              <div class="text-left">
                <p class="text-[10px] font-bold text-hsa uppercase tracking-widest">Nom de famille</p>
                <p class="font-bold text-BtW text-lg leading-none mt-1">{{ modelValue.nom || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Email block -->
          <div class="flex items-center justify-between p-4 rounded-xl bg-ash border border-ashAct">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="p-2 bg-success/10 rounded-lg shrink-0">
                <IconMail class="w-5 h-5 text-success" />
              </div>
              <div class="text-left overflow-hidden">
                <p class="text-[10px] font-bold text-hsa uppercase tracking-widest">Email de contact</p>
                <p class="font-bold text-BtW truncate" :title="modelValue.email">{{ modelValue.email }}</p>
              </div>
            </div>
            <UiStatusBadge :status="emailVerified ? 'Verified' : 'Pending'" class="shrink-0 ml-2" />
          </div>

          <!-- Organization block -->
          <div class="flex items-center p-4 rounded-xl bg-ash border border-ashAct">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="p-2 bg-warning/10 rounded-lg shrink-0">
                <IconBuilding class="w-5 h-5 text-warning" />
              </div>
              <div class="text-left overflow-hidden">
                <p class="text-[10px] font-bold text-hsa uppercase tracking-widest">Organisation</p>
                <p class="font-bold text-BtW truncate">{{ modelValue.organisation || '-' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Verification Warning -->
        <div v-if="!emailVerified" class="flex items-center gap-3 p-3 bg-warning/5 border border-warning/10 rounded-xl">
          <IconAlertCircle class="w-4 h-4 text-warning shrink-0" />
          <p class="text-[11px] font-medium text-warning/80">
            Action requise : Vérifiez votre adresse email pour lever les restrictions.
          </p>
        </div>
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { IconUserCircle, IconUserSquareRounded, IconEdit, IconMail, IconBuilding, IconAlertCircle } from '@tabler/icons-vue'

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
