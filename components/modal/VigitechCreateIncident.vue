<template>
  <UiBaseModal :show="show" title="Signaler un Incident" maxWidth="2xl" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <p class="text-sm text-hsa leading-relaxed">
        Contribuez à la sécurité de l'écosystème en signalant une menace ou un incident suspect.
        Vos informations aident à protéger les autres utilisateurs.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Titre -->
        <div class="md:col-span-2 space-y-2">
          <label class="text-xs font-black text-hsa uppercase tracking-widest">Titre de l'incident</label>
          <input v-model="form.title" type="text" placeholder="Ex: Tentative de phishing WhatsApp"
            class="w-full h-12 px-4 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" />
        </div>

        <!-- Type d'incident -->
        <div class="space-y-2">
          <label class="text-xs font-black text-hsa uppercase tracking-widest">Type</label>
          <div class="relative group">
            <select v-model="form.type"
              class="w-full h-12 pl-4 pr-10 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm appearance-none cursor-pointer">
              <option value="phishing">Phishing</option>
              <option value="ransomware">Ransomware</option>
              <option value="fake_profile">Faux Profil</option>
              <option value="harassment">Harcèlement</option>
              <option value="other">Autre</option>
            </select>
            <IconChevronDown
              class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none opacity-60" />
          </div>
        </div>

        <!-- Niveau de menace -->
        <div class="space-y-2">
          <label class="text-xs font-black text-hsa uppercase tracking-widest">Niveau de menace</label>
          <div class="relative group">
            <select v-model="form.threat_level"
              class="w-full h-12 pl-4 pr-10 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm appearance-none cursor-pointer">
              <option value="low">Faible</option>
              <option value="medium">Moyen</option>
              <option value="critical">Critique</option>
            </select>
            <IconChevronDown
              class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none opacity-60" />
          </div>
        </div>

        <!-- Localisation -->
        <div class="space-y-2">
          <label class="text-xs font-black text-hsa uppercase tracking-widest">Localisation (Ville, Pays)</label>
          <input v-model="form.location" type="text" placeholder="Ex: Cotonou, Bénin"
            class="w-full h-12 px-4 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" />
        </div>

        <!-- Anonymat -->
        <div class="flex items-center justify-between p-4 bg-ash/10 rounded-xl border border-ash/50">
          <div class="space-y-0.5">
            <p class="text-xs font-bold text-BtW">Signalement Anonyme</p>
            <p class="text-[10px] text-hsa uppercase tracking-wider">Masquer votre identité</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.is_anonymous" class="sr-only peer">
            <div
              class="w-11 h-6 bg-ash/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
            </div>
          </label>
        </div>

        <!-- Description -->
        <div class="md:col-span-2 space-y-2">
          <label class="text-xs font-black text-hsa uppercase tracking-widest">Description Détailée</label>
          <textarea v-model="form.description" rows="4"
            placeholder="Décrivez l'incident avec le plus de précisions possibles..."
            class="w-full p-4 rounded-xl bg-ash/30 border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm resize-none"></textarea>
        </div>

        <!-- Preuves -->
        <div class="md:col-span-2 space-y-2">
          <label class="text-xs font-black text-hsa uppercase tracking-widest">Preuve / Capture d'écran
            (Optionnel)</label>
          <div class="relative">
            <input type="file" @change="handleFileChange" accept="image/*"
              class="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div
              class="w-full p-4 border-2 border-dashed border-ash rounded-xl bg-ash/5 hover:bg-ash/10 transition-colors flex items-center justify-center gap-3">
              <IconCloudUpload v-if="!form.evidence" class="w-6 h-6 text-primary" />
              <div v-else class="w-8 h-8 rounded bg-success/10 flex items-center justify-center">
                <IconCheck class="w-5 h-5 text-success" />
              </div>
              <span class="text-sm font-bold truncate max-w-[200px]">
                {{ form.evidence ? form.evidence.name : 'Sélectionner une image' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-4 flex gap-4">
        <UiBaseButton variant="ghost" class="flex-1" @click="$emit('close')">Annuler</UiBaseButton>
        <UiBaseButton variant="primary" class="flex-1" :loading="store.loading" @click="submit">
          Publier l'alerte
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconChevronDown, IconCloudUpload, IconCheck } from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import type { CreateIncidentRequest } from '~/types/vigitech'

defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'success'])
const store = useVigitechStore()

const form = ref<CreateIncidentRequest>({
  title: '',
  description: '',
  type: 'phishing',
  threat_level: 'medium',
  is_anonymous: false,
  location: '',
  evidence: null
})

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    form.value.evidence = target.files[0]
  }
}

const submit = async () => {
  if (!form.value.title || !form.value.description) {
    alert('Veuillez remplir les champs obligatoires')
    return
  }

  const result = await store.createIncident(form.value)
  if (result) {
    emit('success')
    emit('close')
    // Reset form
    form.value = {
      title: '',
      description: '',
      type: 'phishing',
      threat_level: 'medium',
      is_anonymous: false,
      location: '',
      evidence: null
    }
  }
}
</script>
