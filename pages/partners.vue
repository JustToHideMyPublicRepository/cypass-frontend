<template>
  <div class="relative">
    <div class="max-w-5xl mx-auto space-y-16">
      <div class="text-center space-y-4 animate-fade-up">
        <span class="badge badge-success">Écosystème</span>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight">
          Nos Partenaires <br />
          <span class="text-secondary">Institutionnels</span>
        </h1>
        <p class="text-lg text-hsa max-w-2xl mx-auto">
          Nous collaborons avec les acteurs clés de la sécurité et du numérique au Bénin pour garantir un service de
          confiance.
        </p>
        <UiBaseButton @click="isModalOpen = true" class="mt-8">
          Devenir Partenaire
        </UiBaseButton>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(partner, index) in partners" :key="partner.name"
          class="glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300 animate-fade-up"
          :style="{ animationDelay: `${index * 100}ms` }">
          <div
            class="w-24 h-24 rounded-full bg-ash flex items-center justify-center mb-6 text-2xl font-bold text-hsa border border-ashAct overflow-hidden p-4">
            <template v-if="partner.logo && !erroredLogos.has(partner.name)">
              <img :src="partner.logo" :alt="partner.name" class="w-full h-full object-contain"
                @error="handleImageError(partner.name)" />
            </template>
            <span v-else>{{ partner.initials || partner.name.charAt(0) }}</span>
          </div>
          <h3 class="text-xl font-bold mb-2">{{ partner.name }}</h3>
          <p class="text-sm text-hsa mb-6">{{ partner.role }}</p>
          <UiBaseButton :href="partner.website" target="_blank" variant="secondary" class="text-xs px-4 py-2">Visiter le
            site</UiBaseButton>
        </div>
      </div>

    </div>

    <!-- Partner Modal -->
    <UiBaseModal :show="isModalOpen" title="Devenir Partenaire" @close="isModalOpen = false">
      <p class="text-hsa mb-6">Rejoignez l'écosystème de confiance CYPASS.</p>

      <!-- Form -->
      <form @submit.prevent="submitPartnerRequest" class="space-y-4">
        <div>
          <label class="block text-sm font-bold mb-1">Nom de l'organisation</label>
          <input type="text" required class="input" placeholder="Ex: Tech Solutions" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold mb-1">Contact</label>
            <input type="text" required class="input" placeholder="Nom complet" />
          </div>
          <div>
            <label class="block text-sm font-bold mb-1">Email</label>
            <input type="email" required class="input" placeholder="email@company.com" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold mb-1">Message</label>
          <textarea class="textarea input h-24 pt-3" placeholder="Décrivez votre projet de partenariat..."></textarea>
        </div>

        <div class="pt-4 flex gap-3">
          <UiBaseButton type="button" @click="isModalOpen = false" variant="ghost" class="flex-1">Annuler</UiBaseButton>
          <UiBaseButton type="submit" class="flex-1">Envoyer la demande</UiBaseButton>
        </div>
      </form>
    </UiBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconX } from '@tabler/icons-vue'
import { partners } from '@/data/partners'

const isModalOpen = ref(false)
const erroredLogos = ref(new Set<string>())

const handleImageError = (name: string) => {
  erroredLogos.value.add(name)
}

const submitPartnerRequest = () => {
  // Simulate API call
  console.log('Partner request submitted')
  // Close modal after delay to simulate success
  setTimeout(() => {
    isModalOpen.value = false
  }, 1000)
}

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Partnenaires'
})
</script>
