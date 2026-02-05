<template>
  <div class="bg-WtB rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-xl border border-ash relative overflow-hidden group">
    <!-- Lueur du formulaire -->
    <div
      class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-700">
    </div>

    <h3 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Envoyez-nous un message</h3>

    <form @submit.prevent="$emit('submit')" class="space-y-4 md:space-y-6 relative z-10">
      <div class="grid md:grid-cols-2 gap-4 md:gap-6">
        <div class="space-y-2">
          <label class="text-sm font-bold text-BtW">Nom complet</label>
          <div class="relative">
            <IconUser class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input v-model="form.name" type="text" placeholder="Prenom et Nom"
              class="w-full pl-12 pr-4 py-2.5 md:py-3 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-BtW text-sm md:text-base"
              required />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-bold text-BtW">Email professionnel</label>
          <div class="relative">
            <IconMail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input v-model="form.email" type="email" placeholder="nom@exemple.com"
              class="w-full pl-12 pr-4 py-2.5 md:py-3 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-BtW text-sm md:text-base"
              required />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-bold text-BtW">Sujet</label>
        <div class="relative">
          <IconMessage class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
          <select v-model="form.subject"
            class="w-full pl-12 pr-4 py-2.5 md:py-3 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none appearance-none text-sm md:text-base"
            required>
            <option value="" disabled selected>Sélectionnez un sujet</option>
            <option value="commercial">Demande Commerciale / Devis</option>
            <option value="technical">Support Technique</option>
            <option value="partnership">Partenariat</option>
            <option value="other">Autre</option>
          </select>
          <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa pointer-events-none" />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-bold text-BtW">Message</label>
        <textarea v-model="form.message" rows="4 md:5" placeholder="Détaillez votre demande..."
          class="w-full p-3 md:p-4 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none text-sm md:text-base"
          required></textarea>
      </div>

      <UiBaseButton type="submit" :disabled="loading" :loading="loading" block class="py-3 md:py-4">
        Envoyer le message
        <IconSend v-if="!loading" class="w-5 h-5 ml-2" />
      </UiBaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { IconUser, IconMail, IconMessage, IconChevronDown, IconSend } from '@tabler/icons-vue'

defineProps<{
  form: {
    name: string
    email: string
    subject: string
    message: string
  }
  loading: boolean
}>()

defineEmits(['submit'])
</script>
