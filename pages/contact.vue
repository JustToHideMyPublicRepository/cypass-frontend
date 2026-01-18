<template>
  <div class="relative min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        class="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent">
      </div>
      <div
        class="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-float">
      </div>
    </div>

    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-20 animate-fade-up">
        <span class="badge badge-blue mb-4">Contact & Support</span>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
          Parlons de votre <span class="text-primary">sécurité</span>
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400">
          Notre équipe d'experts est disponible pour répondre à vos questions techniques, commerciales ou
          administratives.
        </p>
      </div>

      <div class="grid lg:grid-cols-12 gap-12 lg:gap-20">
        <!-- Contact Form (Left) -->
        <div class="lg:col-span-7 animate-fade-up" style="animation-delay: 100ms;">
          <div
            class="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <!-- Form Glow -->
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-700">
            </div>

            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-8">Envoyez-nous un message</h3>

            <form @submit.prevent="submitForm" class="space-y-6 relative z-10">
              <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Nom complet</label>
                  <div class="relative">
                    <IconUser class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input v-model="form.name" type="text" placeholder="John Doe"
                      class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required />
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Email professionnel</label>
                  <div class="relative">
                    <IconMail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input v-model="form.email" type="email" placeholder="john@company.com"
                      class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required />
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Sujet</label>
                <div class="relative">
                  <IconMessage class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select v-model="form.subject"
                    class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none appearance-none"
                    required>
                    <option value="" disabled selected>Sélectionnez un sujet</option>
                    <option value="commercial">Demande Commerciale / Devis</option>
                    <option value="technical">Support Technique</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                  <IconChevronDown
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Message</label>
                <textarea v-model="form.message" rows="5" placeholder="Détaillez votre demande..."
                  class="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                  required></textarea>
              </div>

              <button type="submit" :disabled="loading"
                class="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                <span v-else>Envoyer le message</span>
                <IconSend v-if="!loading" class="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <!-- Info & Map (Right) -->
        <div class="lg:col-span-5 space-y-8 animate-fade-left" style="animation-delay: 200ms;">

          <!-- Contact Info Cards -->
          <div
            class="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Coordonnées</h3>

            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <IconMapPin class="w-6 h-6" />
                </div>
                <div>
                  <p class="font-bold text-slate-900 dark:text-white mb-1">Siège Social</p>
                  <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Immeuble des Services Publics<br />
                    Avenue Jean-Paul II<br />
                    Cotonou, Bénin
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <IconMail class="w-6 h-6" />
                </div>
                <div>
                  <p class="font-bold text-slate-900 dark:text-white mb-1">Email</p>
                  <a href="mailto:contact@cypass.bj"
                    class="text-slate-500 dark:text-slate-400 text-sm hover:text-primary transition-colors">contact@cypass.bj</a>
                  <br />
                  <a href="mailto:support@cypass.bj"
                    class="text-slate-500 dark:text-slate-400 text-sm hover:text-primary transition-colors">support@cypass.bj</a>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <IconPhone class="w-6 h-6" />
                </div>
                <div>
                  <p class="font-bold text-slate-900 dark:text-white mb-1">Téléphone</p>
                  <p class="text-slate-500 dark:text-slate-400 text-sm">+229 21 00 00 00</p>
                  <p class="text-xs text-slate-400 mt-1">Lun-Ven, 8h00 - 18h30</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Abstract Map/Location Visual -->
          <UiAppFrame type="card" :glass="true" class="h-64 relative overflow-hidden group">
            <div class="absolute inset-0 bg-slate-900">
              <!-- Grid Map Effect -->
              <div class="absolute inset-0 opacity-20"
                style="background-image: radial-gradient(#3b82f6 1px, transparent 1px); background-size: 20px 20px;">
              </div>

              <!-- Radar Sweep -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent w-full h-full animate-[spin_4s_linear_infinite] opacity-30">
              </div>

              <!-- Location Pin -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span class="relative flex h-6 w-6">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span
                    class="relative inline-flex rounded-full h-6 w-6 bg-primary border-4 border-white dark:border-slate-900"></span>
                </span>
              </div>

              <div
                class="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg border border-slate-700 text-xs text-white">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Systèmes Opérationnels
                </div>
              </div>
            </div>
          </UiAppFrame>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconUser, IconMail, IconMessage, IconChevronDown, IconSend, IconMapPin, IconPhone } from '@tabler/icons-vue'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Contact & Support'
})

const loading = ref(false)
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitForm = async () => {
  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  loading.value = false
  alert('Message envoyé ! Nous vous répondrons sous 24h.')
  form.value = { name: '', email: '', subject: '', message: '' }
}
</script>
