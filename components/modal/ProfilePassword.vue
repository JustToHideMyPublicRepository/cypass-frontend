<template>
  <UiBaseModal :show="show" title="Mot de passe" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-6 py-2">
      <!-- Alerte de sécurité premium -->
      <div class="p-5 rounded-[1.5rem] bg-warning/5 border border-warning/20 backdrop-blur-sm">
        <div class="flex gap-4">
          <div class="shrink-0 p-2.5 bg-warning/10 rounded-xl h-fit text-warning shadow-inner">
            <IconAlertCircle class="w-6 h-6" />
          </div>
          <p class="text-sm text-hsa font-medium leading-relaxed">
            Par mesure de sécurité, le changement de mot de passe révoquera toutes vos autres sessions actives.
          </p>
        </div>
      </div>

      <div class="space-y-5">
        <!-- Mot de passe actuel -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Mot de passe actuel</label>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconLockOpen class="w-5 h-5" />
            </div>
            <input :type="showCurrent ? 'text' : 'password'" v-model="form.current" required placeholder="••••••••"
              class="input pl-12 pr-14" />
            <UiBaseButton type="button" @click="showCurrent = !showCurrent" variant="ghost"
              class="!absolute !right-2 !top-1/2 !-translate-y-1/2 text-hsa hover:!text-BtW transition-colors !p-2 !bg-transparent hover:!bg-transparent !h-auto !w-auto !rounded-xl">
              <IconEye v-if="showCurrent" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </UiBaseButton>
          </div>
        </div>

        <div class="py-2 flex items-center gap-4">
          <div class="h-px flex-1 bg-ashAct/30"></div>
          <span class="text-[9px] font-black uppercase tracking-[0.3em] text-hsa/40">Nouveaux identifiants</span>
          <div class="h-px flex-1 bg-ashAct/30"></div>
        </div>

        <!-- Nouveau mot de passe -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Nouveau mot de passe</label>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconLock class="w-5 h-5" />
            </div>
            <input :type="showNew ? 'text' : 'password'" v-model="form.new" required placeholder="••••••••"
              class="input pl-12 pr-14" />
            <UiBaseButton type="button" @click="showNew = !showNew" variant="ghost"
              class="!absolute !right-2 !top-1/2 !-translate-y-1/2 text-hsa hover:!text-BtW transition-colors !p-2 !bg-transparent hover:!bg-transparent !h-auto !w-auto !rounded-xl">
              <IconEye v-if="showNew" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </UiBaseButton>
          </div>

          <!-- Validateur de force du mot de passe -->
          <UtilsPasswordValidator v-if="form.new && form.new.length > 0" :password="form.new" class="mt-3" />
        </div>

        <!-- Confirmation du mot de passe -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">
            Confirmer le mot de passe
          </label>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconLock class="w-5 h-5" />
            </div>
            <input :type="showConfirm ? 'text' : 'password'" v-model="form.confirm" required placeholder="••••••••"
              class="input pl-12 pr-14"
              :class="form.confirm && form.new !== form.confirm ? '!border-danger/50 !ring-danger/20' : ''" />
            <UiBaseButton type="button" @click="showConfirm = !showConfirm" variant="ghost"
              class="!absolute !right-2 !top-1/2 !-translate-y-1/2 text-hsa hover:!text-BtW transition-colors !p-2 !bg-transparent hover:!bg-transparent !h-auto !w-auto !rounded-xl">
              <IconEye v-if="showConfirm" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </UiBaseButton>
          </div>
          <p v-if="form.confirm && form.new !== form.confirm"
            class="text-[10px] text-danger font-black uppercase tracking-widest animate-fade-in pl-1">
            Les mots de passe ne correspondent pas
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-6 flex flex-col sm:flex-row justify-end gap-3">
        <UiBaseButton variant="ghost" type="button" @click="$emit('close')" :disabled="loading"
          class="!rounded-2xl border-none font-bold">
          Annuler
        </UiBaseButton>
        <UiBaseButton type="submit" variant="primary" :loading="loading" :disabled="!isFormValid"
          class="!rounded-2xl font-black tracking-widest shadow-xl px-12">
          Mettre à jour
        </UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { IconLockOpen, IconLock, IconAlertCircle, IconEye, IconEyeOff } from '@tabler/icons-vue'

// Propriétés de la modale ProfilePassword
defineProps<{
  show: boolean
  loading: boolean
}>()

const emit = defineEmits(['close', 'submit'])

// Visibilité des champs de mot de passe
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

// État local du formulaire
const form = reactive({
  current: '',
  new: '',
  confirm: ''
})

/**
 * Valide la conformité du formulaire avant soumission
 */
const isFormValid = computed(() => {
  return form.current &&
    form.new &&
    form.confirm &&
    form.new === form.confirm &&
    form.new.length >= 8 // La validation visuelle détaillée est gérée par UtilsPasswordValidator
})

/**
 * Gère la soumission du changement de mot de passe
 */
const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', { ...form })
  }
}
</script>
