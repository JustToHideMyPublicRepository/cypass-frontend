<template>
  <UiBaseModal :show="show" title="Changer le mot de passe" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Security Warning -->
      <div class="p-4 rounded-xl bg-warning/10 border border-warning/20">
        <div class="flex gap-3">
          <IconAlertCircle class="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <p class="text-sm text-hsa">
            Par mesure de sécurité, changer votre mot de passe révoquera toutes vos autres sessions actives. Vous devrez
            vous reconnecter sur vos autres appareils.
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Current Password -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Mot de passe actuel</label>
          <div class="relative">
            <IconLock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input :type="showCurrent ? 'text' : 'password'" v-model="form.current" required placeholder="••••••••"
              class="w-full pl-10 pr-12 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
            <button type="button" @click="showCurrent = !showCurrent"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-hsa hover:text-BtW transition-colors">
              <IconEye v-if="showCurrent" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <hr class="border-ashAct" />

        <!-- New Password -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Nouveau mot de passe</label>
          <div class="relative">
            <IconLock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input :type="showNew ? 'text' : 'password'" v-model="form.new" required placeholder="••••••••"
              class="w-full pl-10 pr-12 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
            <button type="button" @click="showNew = !showNew"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-hsa hover:text-BtW transition-colors">
              <IconEye v-if="showNew" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </button>
          </div>
          <UtilsPasswordValidator v-if="form.new && form.new.length > 0" :password="form.new" />
        </div>

        <!-- Confirm Password -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Confirmer le mot de passe</label>
          <div class="relative">
            <IconLock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input :type="showConfirm ? 'text' : 'password'" v-model="form.confirm" required placeholder="••••••••"
              class="w-full pl-10 pr-12 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
            <button type="button" @click="showConfirm = !showConfirm"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-hsa hover:text-BtW transition-colors">
              <IconEye v-if="showConfirm" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </button>
          </div>
          <p v-if="form.confirm && form.new !== form.confirm" class="text-xs text-danger font-medium">
            Les mots de passe ne correspondent pas.
          </p>
        </div>
      </div>

      <div class="pt-4 flex justify-end gap-3">
        <UiBaseButton variant="ghost" type="button" @click="$emit('close')">
          Annuler
        </UiBaseButton>
        <UiBaseButton type="submit" variant="primary" :loading="loading" :disabled="!isFormValid">
          Mettre à jour
        </UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { IconLock, IconAlertCircle, IconEye, IconEyeOff } from '@tabler/icons-vue'

defineProps<{
  show: boolean
  loading: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const form = reactive({
  current: '',
  new: '',
  confirm: ''
})

const isFormValid = computed(() => {
  return form.current &&
    form.new &&
    form.confirm &&
    form.new === form.confirm &&
    form.new.length >= 8 // Basic length check, validator handles details
})

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', { ...form })
  }
}
</script>
