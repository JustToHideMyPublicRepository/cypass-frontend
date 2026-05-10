<template>
  <UiBaseModal :show="workspaceStore.isModalOpen" :title="isEdit ? 'Modifier le workspace' : 'Nouveau workspace'"
    maxWidth="xl" @close="handleClose">
    <div class="space-y-5">
      <!-- Nom -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-hsa uppercase tracking-wider">Nom du workspace *</label>
        <input v-model="form.name" type="text" required placeholder="Ex: Mon Entreprise"
          class="w-full px-4 py-3 rounded-xl bg-ash/30 border border-ash focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm text-BtW placeholder:text-hsa/50 outline-none transition-all" />
      </div>

      <!-- Type & Pays (Grid 2) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Type -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-hsa uppercase tracking-wider">Type *</label>
          <div class="relative group">
            <div
              class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary">
              <component :is="WORKSPACE_TYPE_CONFIG[form.type].icon" class="w-4 h-4 text-hsa" />
            </div>
            <select v-model="form.type"
              class="w-full pl-10 pr-10 py-3 rounded-xl bg-ash/30 border border-ash focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm text-BtW outline-none transition-all appearance-none cursor-pointer">
              <option v-for="opt in WORKSPACE_TYPE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <IconChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none" />
          </div>
        </div>

        <!-- Pays -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-hsa uppercase tracking-wider">Pays</label>
          <div class="relative">
            <div class="relative flex items-center">
              <input v-model="countrySearch" type="text" :placeholder="form.country ? '' : 'Rechercher un pays...'"
                @focus="showCountryDropdown = true" @blur="handleCountryBlur"
                class="w-full px-4 py-3 rounded-xl bg-ash/30 border border-ash focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm text-BtW placeholder:text-hsa/50 outline-none transition-all" />

              <div v-if="form.country && !countrySearch"
                class="absolute left-4 pointer-events-none text-sm text-BtW font-medium flex items-center gap-2">
                <IconCheck class="w-3.5 h-3.5 text-success" />
                {{ form.country }}
              </div>

              <IconMapPin class="absolute right-3 w-4 h-4 text-hsa pointer-events-none" />
            </div>

            <Transition enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
              leave-to-class="opacity-0">
              <div v-if="showCountryDropdown && filteredCountries.length > 0"
                class="absolute z-20 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl bg-WtB border border-ash shadow-2xl no-scrollbar">
                <button v-for="c in filteredCountries" :key="c" type="button" @mousedown.prevent="selectCountry(c)"
                  :class="['w-full text-left px-4 py-2.5 text-sm transition-colors border-b border-ash/10 last:border-0', c === form.country ? 'bg-primary/5 text-primary font-bold' : 'text-BtW hover:bg-ash/40']">
                  {{ c }}
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Champs Professionnels -->
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
        <div v-if="form.type !== 'personal'" class="space-y-4 p-4 rounded-xl bg-ash/10 border border-ash/50">
          <p class="text-[10px] font-bold text-hsa uppercase tracking-wider">Informations professionnelles (optionnel)
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-hsa">RCCM</label>
              <input v-model="form.rccm" type="text" placeholder="Numéro RCCM"
                class="w-full px-4 py-2.5 rounded-xl bg-ash/30 border border-ash focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm text-BtW placeholder:text-hsa/50 outline-none transition-all" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-hsa">IFU</label>
              <input v-model="form.ifu" type="text" placeholder="Numéro IFU"
                class="w-full px-4 py-2.5 rounded-xl bg-ash/30 border border-ash focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm text-BtW placeholder:text-hsa/50 outline-none transition-all" />
            </div>
          </div>
        </div>
      </Transition>

      <!-- Logo -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-hsa uppercase tracking-wider">Logo (optionnel)</label>
        <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-hsa/60">Formats: JPG, PNG, WebP • Max 2 Mo</p>
        <div class="relative group/logo mt-1">
          <div v-if="previewUrl || currentLogoPath"
            class="flex items-center gap-4 p-3 rounded-xl border border-ash bg-ash/10">
            <div class="w-14 h-14 rounded-xl overflow-hidden border-2 border-primary/20 shadow-sm shrink-0 bg-ash">
              <img :src="previewUrl || getWorkspaceLogoUrl(currentLogoPath)" alt="Aperçu logo"
                class="w-full h-full object-cover" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-BtW truncate">{{ form.logo?.name || (isEdit ? 'Logo actuel' : '') }}
              </p>
              <p v-if="form.logo" class="text-[10px] text-hsa">{{ (form.logo.size / 1024).toFixed(0) }} KB</p>
            </div>
            <button type="button" @click="clearLogo"
              class="p-1.5 rounded-lg hover:bg-danger/10 text-hsa hover:text-danger transition-colors">
              <IconX class="w-4 h-4" />
            </button>
          </div>

          <label v-else
            class="flex flex-col items-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-ash hover:border-primary/50 bg-ash/5 cursor-pointer transition-all group/drop hover:bg-primary/5">
            <div class="p-3 bg-ash/20 rounded-xl group-hover/drop:bg-primary/10 transition-colors">
              <IconFileUpload class="w-6 h-6 text-hsa group-hover/drop:text-primary transition-colors" />
            </div>
            <div class="text-center">
              <p class="text-sm font-medium text-BtW">Cliquez ou glissez-déposez</p>
              <p class="text-[10px] text-hsa">JPG, PNG, WebP — 2 Mo max</p>
            </div>
            <input type="file" accept="image/jpeg,image/png,image/webp" @change="handleFile" class="hidden" />
          </label>
        </div>
      </div>

      <!-- Error -->
      <p v-if="fileError" class="text-xs text-danger font-medium bg-danger/5 px-3 py-2 rounded-lg">
        {{ fileError }}
      </p>
      <p v-if="workspaceStore.error" class="text-xs text-danger font-medium bg-danger/5 px-3 py-2 rounded-lg">
        {{ workspaceStore.error }}
      </p>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex gap-3 w-full">
        <UiBaseButton variant="ghost" @click="handleClose" class="flex-1 !py-2.5 !rounded-xl text-sm">
          Annuler
        </UiBaseButton>
        <UiBaseButton :disabled="!form.name || workspaceStore.createLoading" @click="handleSubmit"
          class="flex-1 !py-2.5 !rounded-xl text-sm !bg-primary !text-WtB hover:!bg-secondary disabled:opacity-50 disabled:cursor-not-allowed">
          <IconLoader2 v-if="workspaceStore.createLoading" class="w-4 h-4 animate-spin" />
          <span v-else>{{ isEdit ? 'Mettre à jour' : 'Créer le workspace' }}</span>
        </UiBaseButton>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { IconChevronDown, IconMapPin, IconFileUpload, IconLoader2, IconX, IconCheck } from '@tabler/icons-vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { WORKSPACE_TYPE_OPTIONS, WORKSPACE_TYPE_CONFIG, getWorkspaceLogoUrl } from '~/utils/workspace'
import type { WorkspaceType } from '~/types/workspace'

const workspaceStore = useWorkspaceStore()

const isEdit = computed(() => !!workspaceStore.editingWorkspace)

// Formulaire
const form = reactive({
  name: '',
  type: 'personal' as WorkspaceType,
  country: '',
  rccm: '',
  ifu: '',
  logo: null as File | null
})

// Logo
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024
const previewUrl = ref<string | null>(null)
const currentLogoPath = ref<string | null>(null)
const fileError = ref<string | null>(null)

const handleFile = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return
  processFile(input.files[0])
}

const processFile = (file: File) => {
  fileError.value = null
  if (!ACCEPTED_TYPES.includes(file.type)) {
    fileError.value = `Format non supporté (${file.name}). Utilisez JPG, PNG ou WebP.`
    return
  }
  if (file.size > MAX_SIZE) {
    fileError.value = `Image trop lourde (${(file.size / 1024 / 1024).toFixed(2)} Mo). Maximum : 2 Mo.`
    return
  }
  form.logo = file
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
}

const clearLogo = () => {
  form.logo = null
  currentLogoPath.value = null
  fileError.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

// Pays
const countries = ref<string[]>([])
const countrySearch = ref('')
const showCountryDropdown = ref(false)

const filteredCountries = computed(() => {
  const q = countrySearch.value.toLowerCase()
  if (!q) return countries.value
  return countries.value.filter(c => c.toLowerCase().includes(q))
})

const selectCountry = (c: string) => {
  form.country = c
  countrySearch.value = ''
  showCountryDropdown.value = false
}

const handleCountryBlur = () => {
  setTimeout(() => { showCountryDropdown.value = false }, 200)
}

// Charger la liste des pays
onMounted(async () => {
  try {
    const data = await $fetch<{ name: { common: string } }[]>(
      'https://restcountries.com/v3.1/all?fields=name'
    )
    const list = data.map(c => c.name.common).sort()
    const idx = list.findIndex(c => c === 'Benin')
    if (idx > -1) {
      list.splice(idx, 1)
      list.unshift('Bénin')
    }
    countries.value = list
  } catch {
    countries.value = ['Bénin', 'Togo', 'Niger', 'Burkina Faso', 'Côte d\'Ivoire', 'Ghana', 'Nigeria', 'Sénégal', 'Mali', 'Cameroun', 'France']
  }
})

// Soumission
const handleSubmit = async () => {
  const payload = {
    name: form.name,
    type: form.type,
    country: form.country || undefined,
    rccm: form.rccm || undefined,
    ifu: form.ifu || undefined,
    logo: form.logo
  }

  let success = false
  if (isEdit.value && workspaceStore.editingWorkspace) {
    success = await workspaceStore.updateWorkspace(workspaceStore.editingWorkspace.id, payload)
  } else {
    success = await workspaceStore.createWorkspace(payload)
  }

  if (success) {
    resetForm()
  }
}

const resetForm = () => {
  form.name = ''
  form.type = 'personal'
  form.country = ''
  form.rccm = ''
  form.ifu = ''
  clearLogo()
  countrySearch.value = ''
}

const handleClose = () => {
  workspaceStore.closeModal()
}

// Réinitialiser / Peupler quand la modale s'ouvre
watch(() => workspaceStore.isModalOpen, (open) => {
  if (open) {
    if (workspaceStore.editingWorkspace) {
      const ws = workspaceStore.editingWorkspace
      form.name = ws.name
      form.type = ws.type
      form.country = ws.country || ''
      form.rccm = ws.rccm || ''
      form.ifu = ws.ifu || ''
      currentLogoPath.value = ws.logo_url
    } else {
      resetForm()
    }
  } else {
    resetForm()
  }
})
</script>
