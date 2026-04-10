<template>
  <div class="space-y-6">
    <!-- Section Multi-version (Génération de versions enfants) -->
    <div v-if="!multiVersionSuccess" class="animate-fade-up">
      <button v-if="collapsible" @click="isCollapsed = !isCollapsed"
        class="w-full flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/20 hover:bg-primary/10 transition-all text-primary">
        <div class="flex items-center gap-3">
          <IconFiles class="w-5 h-5" />
          <span class="font-black text-xs tracking-widest uppercase">Générer des versions personnalisées</span>
        </div>
        <IconChevronDown class="w-5 h-5 transition-transform" :class="{ 'rotate-180': !isCollapsed }" />
      </button>

      <div v-if="!collapsible || !isCollapsed" class="mt-4 p-6 bg-ash/20 rounded-[2rem] border border-ashAct/30 space-y-6">
        <div class="flex p-1 bg-ash/30 rounded-xl border border-ashAct/20">
          <button @click="multiVersionType = 'csv'"
            class="flex-1 py-2 px-4 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all"
            :class="multiVersionType === 'csv' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
            Via Fichier CSV
          </button>
          <button @click="multiVersionType = 'manual'"
            class="flex-1 py-2 px-4 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all"
            :class="multiVersionType === 'manual' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
            Saisie Manuelle
          </button>
        </div>

        <!-- Upload CSV -->
        <div v-if="multiVersionType === 'csv'" class="space-y-4">
          <div v-if="!csvFile"
            class="border-2 border-dashed border-primary/20 rounded-2xl p-8 text-center bg-WtB/50 hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer group"
            @click="triggerCsvSelect">
            <input type="file" ref="csvInput" class="hidden" accept=".csv" @change="handleCsvChange">
            <IconCloudUpload
              class="w-8 h-8 text-primary/40 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p class="text-[11px] font-bold text-BtW">Cliquez pour importer votre CSV</p>
            <p class="text-[9px] text-hsa mt-1 uppercase tracking-tighter">Noms des destinataires uniquement</p>
          </div>
          <div v-else class="flex items-center gap-4 bg-WtB/50 p-4 rounded-xl border border-primary/20">
            <IconFileDescription class="w-6 h-6 text-primary" />
            <span class="flex-1 text-xs font-bold text-BtW truncate">{{ csvFile.name }}</span>
            <button @click="csvFile = null" class="text-hsa hover:text-danger p-1">
              <IconX class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Saisie Manuelle (Tag View) -->
        <div v-if="multiVersionType === 'manual'" class="space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] text-hsa font-black tracking-widest uppercase ml-1">Ajouter des destinataires</label>
            <div class="relative group">
              <input 
                v-model="newRecipient" 
                @keyup.enter="addRecipient"
                type="text" 
                placeholder="Entrez un nom et appuyez sur Entrée..."
                class="w-full bg-WtB border border-ashAct/30 rounded-xl p-4 pr-12 text-xs font-medium text-BtW placeholder:text-hsa/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
              <button 
                @click="addRecipient"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                <IconPlus class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Recipients Tags -->
          <div v-if="selectedRecipients.length > 0" class="flex flex-wrap gap-2 animate-fade-in">
            <div v-for="(recipient, index) in selectedRecipients" :key="index"
              class="flex items-center gap-2 px-3 py-1.5 bg-WtB border border-primary/20 rounded-lg shadow-sm animate-bounce-in group">
              <span class="text-[11px] font-bold text-BtW opacity-80">{{ recipient }}</span>
              <button @click="removeRecipient(index)" class="text-hsa hover:text-danger flex items-center">
                <IconX class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div v-else class="text-center py-6 border-2 border-dashed border-ash/30 rounded-2xl bg-ash/5">
            <p class="text-[10px] text-hsa font-black tracking-widest uppercase opacity-40">Aucun destinataire ajouté</p>
          </div>
        </div>

        <UiBaseButton variant="primary" class="w-full !rounded-xl font-black py-3 h-auto shadow-lg"
          :loading="multiVersionLoading" :disabled="!isMultiVersionValid" @click="handleMultiVersionSubmit">
          Lancer la génération
        </UiBaseButton>
      </div>
    </div>

    <!-- Succès Multi-version -->
    <div v-else
      class="p-6 rounded-[2rem] bg-primary/5 border-2 border-primary/20 animate-bounce-in flex flex-col items-center text-center">
      <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
        <IconRocket class="w-8 h-8" />
      </div>
      <h4 class="font-black text-BtW text-sm mb-2 uppercase tracking-tighter">Traitement lancé !</h4>
      <p class="text-[11px] text-hsa font-medium leading-relaxed">
        Les versions enfants sont en cours de génération. <br>
        Vous recevrez une notification dès que l'archive sera prête.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  IconFiles, IconChevronDown, IconCloudUpload, IconFileDescription, IconX, IconRocket, IconPlus
} from '@tabler/icons-vue'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'

const props = defineProps<{
  documentId: string
  collapsible?: boolean
}>()

const emit = defineEmits(['update:loading'])

const docsentryStore = useUserDocsentryStore()

// États locaux
const isCollapsed = ref(true)
const multiVersionType = ref<'csv' | 'manual'>('csv')
const csvFile = ref<File | null>(null)
const csvInput = ref<HTMLInputElement | null>(null)

// Manual Entry (Tag based)
const newRecipient = ref('')
const selectedRecipients = ref<string[]>([])

const addRecipient = () => {
  const name = newRecipient.value.trim()
  if (name && !selectedRecipients.value.includes(name)) {
    selectedRecipients.value.push(name)
    newRecipient.value = ''
  }
}

const removeRecipient = (index: number) => {
  selectedRecipients.value.splice(index, 1)
}

const multiVersionLoading = ref(false)
const multiVersionSuccess = ref(false)

const isMultiVersionValid = computed(() => {
  if (multiVersionType.value === 'csv') return !!csvFile.value
  return selectedRecipients.value.length > 0
})

const triggerCsvSelect = () => csvInput.value?.click()

const handleCsvChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    csvFile.value = target.files[0]
  }
}

const handleMultiVersionSubmit = async () => {
  if (!props.documentId) return

  multiVersionLoading.value = true
  emit('update:loading', true)
  
  try {
    const success = await docsentryStore.generateMultiVersion({
      document_id: props.documentId,
      recipients_csv: multiVersionType.value === 'csv' ? csvFile.value! : undefined,
      recipients_manual: multiVersionType.value === 'manual' ? selectedRecipients.value.join(', ') : undefined
    })

    if (success) {
      multiVersionSuccess.value = true
    }
  } finally {
    multiVersionLoading.value = false
    emit('update:loading', false)
  }
}

// Reset functions exposed via defineExpose if needed
const reset = () => {
  multiVersionSuccess.value = false
  csvFile.value = null
  selectedRecipients.value = []
  newRecipient.value = ''
  isCollapsed.value = true
}

defineExpose({ reset })
</script>
