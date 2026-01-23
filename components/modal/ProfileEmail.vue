<template>
  <UiBaseModal :show="show" title="Changer l'adresse email" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="p-4 rounded-xl bg-primary/10 border border-primary/20">
        <div class="flex gap-3">
          <IconAlertCircle class="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p class="text-sm text-hsa">
            Un email de vérification sera envoyé à votre nouvelle adresse. Vous devrez le confirmer pour finaliser le
            changement.
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Nouvel Email</label>
          <div class="relative">
            <IconMail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input type="email" v-model="form.newEmail" required placeholder="nouveau@exemple.com"
              class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Mot de passe actuel</label>
          <div class="relative">
            <IconLock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input type="password" v-model="form.password" required placeholder="••••••••"
              class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
          </div>
        </div>
      </div>

      <div class="pt-4 flex justify-end gap-3">
        <UiBaseButton variant="ghost" type="button" @click="$emit('close')">
          Annuler
        </UiBaseButton>
        <UiBaseButton type="submit" variant="primary" :loading="loading">
          Lancer le changement
        </UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { IconMail, IconLock, IconAlertCircle } from '@tabler/icons-vue'

defineProps<{
  show: boolean
  loading: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  newEmail: '',
  password: ''
})

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>
