<template>
  <div class="py-12 px-6 bg-WtB border border-ash/20 rounded-none shadow-none">
    <!-- Ultra-Minimalist Header -->
    <div class="mb-20 space-y-4">
      <h3 class="text-4xl font-light tracking-tight text-BtW uppercase">Aperçu du Profil</h3>
      <div class="w-16 h-0.5 bg-BtW"></div>
    </div>

    <div class="max-w-3xl space-y-24">
      <!-- Minimalist Data Display -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
        <!-- Prenom -->
        <div class="space-y-4">
          <label class="text-[10px] font-bold text-hsa/60 uppercase tracking-[0.2em]">Prénom</label>
          <p class="text-3xl font-black text-BtW tracking-tighter">{{ modelValue.prenom || '—' }}</p>
        </div>

        <!-- Nom -->
        <div class="space-y-4">
          <label class="text-[10px] font-bold text-hsa/60 uppercase tracking-[0.2em]">Nom de famille</label>
          <p class="text-3xl font-black text-BtW tracking-tighter">{{ modelValue.nom || '—' }}</p>
        </div>
      </div>

      <!-- Professional Context -->
      <div class="pt-20 border-t border-ash/10">
        <p class="text-[10px] font-bold text-hsa/40 uppercase tracking-[0.3em] mb-12">Identification Professionnelle</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div class="space-y-2">
            <span class="text-[10px] font-black text-BtW/40 uppercase tracking-widest">Email de contact</span>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-3">
                <p class="text-lg font-medium text-BtW underline decoration-ash/30 underline-offset-8">
                  {{ modelValue.email }}
                </p>
                <div v-if="emailVerified"
                  class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                <div v-else class="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]"></div>
              </div>
              <p v-if="!emailVerified" class="text-xs text-yellow-600/80 font-medium">
                Validation en attente. Veuillez confirmer votre adresse email pour éviter toute restriction de connexion
                lors de votre prochaine session.
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <span class="text-[10px] font-black text-BtW/40 uppercase tracking-widest">Organisation</span>
            <p class="text-lg font-medium text-BtW">{{ modelValue.organisation || 'Indépendant / Freelance' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: {
    prenom: string
    nom: string
    email: string
    organisation: string
  }
  emailVerified: boolean
}>()
</script>
