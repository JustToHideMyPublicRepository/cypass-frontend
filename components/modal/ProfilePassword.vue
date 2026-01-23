<template>
  <UiBaseModal :show="show" title="Changer le mot de passe" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-4">
        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Mot de passe actuel</label>
          <div class="relative">
            <IconLock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input type="password" v-model="form.current" required placeholder="••••••••"
              class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
          </div>
        </div>

        <hr class="border-ashAct" />

        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Nouveau mot de passe</label>
          <div class="relative">
            <IconLock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input type="password" v-model="form.new" required placeholder="••••••••"
              class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
          </div>
          <UtilsPasswordValidator :password="form.new" />
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Confirmer le mot de passe</label>
          <div class="relative">
            <IconLock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input type="password" v-model="form.confirm" required placeholder="••••••••"
              class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
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
import { reactive, computed } from 'vue'
import { IconLock } from '@tabler/icons-vue'

defineProps<{
  show: boolean
  loading: boolean
}>()

const emit = defineEmits(['close', 'submit'])

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
