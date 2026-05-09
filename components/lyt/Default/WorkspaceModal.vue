<template>
  <UiBaseModal :show="workspaceStore.isCreateModalOpen" title="Nouveau workspace" maxWidth="md"
    @close="workspaceStore.closeCreateModal()">
    <form id="ws-create-form" @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Nom -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-hsa uppercase tracking-wider">Nom du workspace *</label>
        <input v-model="form.name" type="text" required placeholder="Ex: Mon Entreprise"
          class="w-full px-4 py-3 rounded-xl bg-ash/30 border border-ash focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm text-BtW placeholder:text-hsa/50 outline-none transition-all" />
      </div>

      <!-- Type -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-hsa uppercase tracking-wider">Type *</label>
        <div class="grid grid-cols-2 gap-3">
          <button type="button" @click="form.type = 'personal'" :class="[
            'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center',
            form.type === 'personal'
              ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10'
              : 'border-ash bg-ash/10 text-hsa hover:border-primary/40 hover:bg-primary/5'
          ]">
            <IconUser class="w-5 h-5" />
            <span class="text-xs font-semibold">Personnel</span>
          </button>
          <button type="button" @click="form.type = 'pme'" :class="[
            'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center',
            form.type === 'pme'
              ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10'
              : 'border-ash bg-ash/10 text-hsa hover:border-primary/40 hover:bg-primary/5'
          ]">
            <IconBuilding class="w-5 h-5" />
            <span class="text-xs font-semibold">PME / Entreprise</span>
          </button>
        </div>
      </div>

      <!-- Pays -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-hsa uppercase tracking-wider">Pays</label>
        <input v-model="form.country" type="text" placeholder="Ex: Bénin"
          class="w-full px-4 py-3 rounded-xl bg-ash/30 border border-ash focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm text-BtW placeholder:text-hsa/50 outline-none transition-all" />
      </div>

      <!-- Fields PME -->
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

      <!-- Logo -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-hsa uppercase tracking-wider">Logo (optionnel)</label>
        <label
          class="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-ash hover:border-primary/50 bg-ash/10 cursor-pointer transition-all group">
          <IconPhoto class="w-5 h-5 text-hsa group-hover:text-primary transition-colors" />
          <span class="text-sm text-hsa group-hover:text-BtW transition-colors truncate">
            {{ form.logo ? form.logo.name : 'Choisir une image...' }}
          </span>
          <input type="file" accept="image/*" @change="handleFile" class="hidden" />
        </label>
      </div>

      <!-- Error -->
      <p v-if="workspaceStore.error" class="text-xs text-danger font-medium bg-danger/5 px-3 py-2 rounded-lg">
        {{ workspaceStore.error }}
      </p>
    </form>

    <!-- Footer (direct child of UiBaseModal) -->
    <template #footer>
      <div class="flex gap-3 w-full">
        <UiBaseButton variant="ghost" @click="workspaceStore.closeCreateModal()"
          class="flex-1 !py-2.5 !rounded-xl text-sm">
          Annuler
        </UiBaseButton>
        <UiBaseButton form="ws-create-form" type="submit" :disabled="!form.name || workspaceStore.createLoading"
          class="flex-1 !py-2.5 !rounded-xl text-sm !bg-primary !text-WtB hover:!bg-secondary disabled:opacity-50 disabled:cursor-not-allowed">
          <IconLoader2 v-if="workspaceStore.createLoading" class="w-4 h-4 animate-spin" />
          <span v-else>Créer le workspace</span>
        </UiBaseButton>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { IconUser, IconBuilding, IconPhoto, IconLoader2 } from '@tabler/icons-vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import type { WorkspaceType } from '~/types/workspace'

const workspaceStore = useWorkspaceStore()

const form = reactive({
  name: '',
  type: 'personal' as WorkspaceType,
  country: '',
  rccm: '',
  ifu: '',
  logo: null as File | null
})

const handleFile = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    form.logo = input.files[0]
  }
}

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
    // Reset form
    form.name = ''
    form.type = 'personal'
    form.country = ''
    form.rccm = ''
    form.ifu = ''
    form.logo = null
  }
}
</script>
