<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Rappel final -->
    <div class="p-6 bg-ash/30 rounded-[2rem] border border-ashAct/30">
      <p class="text-sm text-hsa font-medium leading-relaxed">
        Dernière confirmation requise. Saisissez votre mot de passe pour initier la suppression irréversible de
        votre compte CYPASS.
      </p>
    </div>

    <!-- Champ mot de passe et erreur -->
    <div class="space-y-3">
      <div class="relative group">
        <input :type="showPassword ? 'text' : 'password'" :value="password"
          @input="$emit('update:password', ($event.target as HTMLInputElement).value)" placeholder="Mot de passe actuel"
          class="input pr-14 !border-danger/30 focus:!ring-danger/20" @keyup.enter="$emit('confirm')" />
        <UiBaseButton @click="$emit('toggle-password')" variant="ghost"
          class="!absolute !right-2 !top-1/2 !-translate-y-1/2 text-hsa hover:!text-BtW !rounded-xl !p-2 !h-auto !w-auto !bg-transparent">
          <component :is="showPassword ? IconEyeOff : IconEye" class="w-5 h-5" />
        </UiBaseButton>
      </div>
      <div class="h-6">
        <p v-if="error"
          class="text-[10px] text-danger font-black uppercase tracking-widest flex items-center gap-2 animate-shake pl-1">
          <IconX class="w-4 h-4" /> {{ error }}
        </p>
      </div>
    </div>

    <!-- Actions finales -->
    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-ash/50">
      <UiBaseButton variant="ghost" @click="$emit('cancel')" :disabled="loading"
        v-tooltip="getLinkTooltip('modal_cancel')" class="!rounded-2xl border-none font-bold">
        Annuler
      </UiBaseButton>
      <UiBaseButton variant="danger" :loading="loading" :disabled="!password" @click="$emit('confirm')"
        v-tooltip="getLinkTooltip('modal_confirm')"
        class="!rounded-2xl font-black tracking-widest shadow-2xl shadow-danger/20">
        Confirmer la suppression
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconX, IconEye, IconEyeOff } from '@tabler/icons-vue'
import { getLinkTooltip } from '~/data/shortcuts'

defineProps<{
  password: string
  showPassword: boolean
  error: string | null
  loading: boolean
}>()

defineEmits(['update:password', 'toggle-password', 'cancel', 'confirm'])
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
