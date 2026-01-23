<template>
  <div class="relative group">
    <!-- Gradient Glow Effect -->
    <div
      class="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000">
    </div>

    <UiBaseCard
      class="relative bg-WtB/80 backdrop-blur-xl border-ash/50 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
      <!-- Premium Header -->
      <template #header>
        <div class="flex items-center justify-between py-2">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div
                class="p-3 bg-gradient-to-br from-primary to-primary-dark rounded-2xl text-white shadow-lg shadow-primary/30">
                <IconUser class="w-6 h-6" />
              </div>
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-WtB rounded-full shadow-sm">
              </div>
            </div>
            <div>
              <h3 class="text-xl font-bold bg-gradient-to-r from-BtW to-BtW/70 bg-clip-text text-transparent">
                Informations Personnelles
              </h3>
              <p class="text-sm text-hsa font-medium">Gérez votre identité numérique</p>
            </div>
          </div>
        </div>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-8 p-1">
        <!-- Main Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Prenom -->
          <div class="space-y-2 group/input">
            <label class="text-xs font-bold text-hsa/80 uppercase tracking-widest flex items-center gap-2 px-1">
              <IconId class="w-3.5 h-3.5 text-primary" />
              Prénom
            </label>
            <div class="relative">
              <input type="text" v-model="localForm.prenom" placeholder="Votre prénom"
                class="w-full px-5 py-3.5 rounded-2xl bg-ash/20 border border-ashAct/30 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-BtW font-medium transition-all duration-300 placeholder:text-hsa/30" />
              <div
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-focus-within/input:w-[90%] opacity-50 rounded-full">
              </div>
            </div>
          </div>

          <!-- Nom -->
          <div class="space-y-2 group/input">
            <label class="text-xs font-bold text-hsa/80 uppercase tracking-widest flex items-center gap-2 px-1">
              <IconIdBadge class="w-3.5 h-3.5 text-primary" />
              Nom de famille
            </label>
            <div class="relative">
              <input type="text" v-model="localForm.nom" placeholder="Votre nom"
                class="w-full px-5 py-3.5 rounded-2xl bg-ash/20 border border-ashAct/30 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-BtW font-medium transition-all duration-300 placeholder:text-hsa/30" />
              <div
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-focus-within/input:w-[90%] opacity-50 rounded-full">
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Context Section -->
        <div class="space-y-8 pt-10 border-t border-ash/30 relative">
          <div
            class="absolute -top-3.5 left-6 px-4 py-1.5 bg-ash/40 backdrop-blur-md rounded-full text-[10px] font-black text-hsa uppercase tracking-[0.2em] border border-ashAct/20">
            Contexte Professionnel
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 px-2">
            <!-- Email (Minimalist PRO) -->
            <div class="flex items-start gap-5 group/item">
              <div
                class="mt-1 p-3 bg-primary/5 rounded-2xl text-primary transition-colors group-hover/item:bg-primary group-hover/item:text-white group-hover/item:shadow-lg group-hover/item:shadow-primary/20 duration-500">
                <IconMailShare class="w-5 h-5" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-hsa uppercase tracking-[0.15em] opacity-60">Email
                  Professionnel</label>
                <div class="flex items-center gap-3">
                  <p class="text-base font-bold text-BtW transition-colors group-hover/item:text-primary">{{
                    modelValue.email
                  }}</p>
                  <div v-if="emailVerified" class="p-1 bg-green-500/10 text-green-500 rounded-full"
                    v-tooltip="'Compte vérifié'">
                    <IconShieldCheck class="w-3.5 h-3.5" />
                  </div>
                  <div v-else class="p-1 bg-amber-500/10 text-amber-500 rounded-full"
                    v-tooltip="'En attente de vérification'">
                    <IconAlertTriangle class="w-3.5 h-3.5" />
                  </div>
                </div>
                <p class="text-[11px] text-hsa/40 font-medium italic">Contact principal pour les alertes</p>
              </div>
            </div>

            <!-- Organisation (Minimalist PRO) -->
            <div class="flex items-start gap-5 group/item">
              <div
                class="mt-1 p-3 bg-secondary/5 rounded-2xl text-secondary transition-colors group-hover/item:bg-secondary group-hover/item:text-white group-hover/item:shadow-lg group-hover/item:shadow-secondary/20 duration-500">
                <IconBuildingSkyscraper class="w-5 h-5" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-hsa uppercase tracking-[0.15em] opacity-60">Organisation
                  rattachée</label>
                <p class="text-base font-bold text-BtW transition-colors group-hover/item:text-secondary">
                  {{ modelValue.organisation || 'Indépendant' }}
                </p>
                <p class="text-[11px] text-hsa/40 font-medium italic">Entité juridique associée</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="pt-8 flex justify-end">
          <UiBaseButton type="submit" :loading="loading"
            class="group/btn relative overflow-hidden px-10 py-4 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
            <div class="flex items-center gap-3 relative z-10">
              <IconCloudUpload v-if="!loading"
                class="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
              <span>Sauvegarder les modifications</span>
            </div>
            <div class="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          </UiBaseButton>
        </div>
      </form>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { IconUser, IconBuildingSkyscraper, IconShieldCheck, IconAlertTriangle, IconCloudUpload, IconId, IconIdBadge, IconBriefcase, IconInfoCircle, IconMailShare } from '@tabler/icons-vue'

const props = defineProps<{
  modelValue: {
    prenom: string
    nom: string
    email: string
    organisation: string
  }
  loading: boolean
  emailVerified: boolean
}>()

const emit = defineEmits(['update', 'update:modelValue'])

const localForm = reactive({ ...props.modelValue })

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    Object.assign(localForm, newVal)
  }
}, { deep: true })

const handleSubmit = () => {
  emit('update:modelValue', { ...localForm })
  emit('update')
}
</script>

<style scoped>
.rounded-3xl {
  border-radius: 1.5rem;
}
</style>
