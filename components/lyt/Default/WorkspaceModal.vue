<template>
  <UiBaseModal :show="workspaceStore.isCreateModalOpen" title="Nouveau workspace" maxWidth="md"
    @close="handleClose">
    <div class="space-y-5">
      <!-- Nom -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-hsa uppercase tracking-wider">Nom du workspace *</label>
        <input v-model="form.name" type="text" required placeholder="Ex: Mon Entreprise"
          class="w-full px-4 py-3 rounded-xl bg-ash/30 border border-ash focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm text-BtW placeholder:text-hsa/50 outline-none transition-all" />
      </div>

      <!-- Type (dropdown) -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-hsa uppercase tracking-wider">Type *</label>
        <div class="relative">
          <select v-model="form.type"
            class="w-full px-4 py-3 rounded-xl bg-ash/30 border border-ash focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm text-BtW outline-none transition-all appearance-none cursor-pointer pr-10">
            <option v-for="opt in WORKSPACE_TYPE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <IconChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none" />
        </div>
      </div>

      <!-- Pays (searchable select) -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-hsa uppercase tracking-wider">Pays</label>
        <div class="relative">
          <input v-model="countrySearch" type="text" :placeholder="form.country || 'Rechercher un pays...'"
            @focus="showCountryDropdown = true"
            @blur="handleCountryBlur"
            class="w-full px-4 py-3 rounded-xl bg-ash/30 border border-ash focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm text-BtW placeholder:text-hsa/50 outline-none transition-all" />
          <IconMapPin class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none" />

          <!-- Country Dropdown -->
          <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showCountryDropdown && filteredCountries.length > 0"
              class="absolute z-20 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-xl bg-WtB border border-ash shadow-xl no-scrollbar">
              <button v-for="c in filteredCountries" :key="c" type="button"
                @mousedown.prevent="selectCountry(c)"
                :class="['w-full text-left px-4 py-2 text-sm transition-colors', c === form.country ? 'bg-primary/10 text-primary font-medium' : 'text-BtW hover:bg-ash/50']">
                {{ c }}
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Champs PME (conditionnels) -->
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
        <div v-if="form.type === 'pme'" class="space-y-4 p-4 rounded-xl bg-ash/10 border border-ash/50">
          <p class="text-[10px] font-bold text-hsa uppercase tracking-wider">Informations entreprise (optionnel)</p>
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
      </Transition>

      <!-- Logo (drop zone + aperçu) -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-hsa uppercase tracking-wider">Logo (optionnel)</label>
        <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-hsa/60">Formats: JPG, PNG, WebP • Max 2 Mo</p>
        <div class="relative group/logo mt-1">
          <!-- Aperçu si fichier sélectionné -->
          <div v-if="previewUrl"
            class="flex items-center gap-4 p-3 rounded-xl border border-ash bg-ash/10">
            <div class="w-14 h-14 rounded-xl overflow-hidden border-2 border-primary/20 shadow-sm shrink-0">
              <img :src="previewUrl" alt="Aperçu logo" class="w-full h-full object-cover" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-BtW truncate">{{ form.logo?.name }}</p>
              <p class="text-[10px] text-hsa">{{ form.logo ? (form.logo.size / 1024).toFixed(0) + ' KB' : '' }}</p>
            </div>
            <button type="button" @click="clearLogo"
              class="p-1.5 rounded-lg hover:bg-danger/10 text-hsa hover:text-danger transition-colors">
              <IconX class="w-4 h-4" />
            </button>
          </div>

          <!-- Drop zone sinon -->
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
        <UiBaseButton variant="ghost" @click="handleClose"
          class="flex-1 !py-2.5 !rounded-xl text-sm">
          Annuler
        </UiBaseButton>
        <UiBaseButton :disabled="!form.name || workspaceStore.createLoading" @click="handleSubmit"
          class="flex-1 !py-2.5 !rounded-xl text-sm !bg-primary !text-WtB hover:!bg-secondary disabled:opacity-50 disabled:cursor-not-allowed">
          <IconLoader2 v-if="workspaceStore.createLoading" class="w-4 h-4 animate-spin" />
          <span v-else>Créer le workspace</span>
        </UiBaseButton>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { IconChevronDown, IconMapPin, IconFileUpload, IconLoader2, IconX } from '@tabler/icons-vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { WORKSPACE_TYPE_OPTIONS } from '~/utils/workspace'
import type { WorkspaceType } from '~/types/workspace'

const workspaceStore = useWorkspaceStore()

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
const MAX_SIZE = 2 * 1024 * 1024 // 2 Mo
const previewUrl = ref<string | null>(null)
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

    // Mettre Bénin en premier
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
  const success = await workspaceStore.createWorkspace({
    name: form.name,
    type: form.type,
    country: form.country || undefined,
    rccm: form.rccm || undefined,
    ifu: form.ifu || undefined,
    logo: form.logo
  })

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
  workspaceStore.closeCreateModal()
  resetForm()
}

// Réinitialiser quand la modale se ferme
watch(() => workspaceStore.isCreateModalOpen, (open) => {
  if (!open) resetForm()
})
</script>
