<template>
  <Transition enter-active-class="transition duration-500 ease-out" enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-full opacity-0">
    <div v-if="!hasConsent" class="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:max-w-md">
      <div
        class="bg-WtB/80 backdrop-blur-xl border border-ash/50 shadow-2xl rounded-3xl p-6 md:p-8 ring-1 ring-white/10">
        <div class="flex items-start gap-4 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <IconShieldCheck class="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 class="text-BtW font-bold text-lg mb-1">Respect de votre vie privée</h3>
            <p class="text-hsa text-sm leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic. Souhaitez-vous
              autoriser Google Analytics ?
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button @click="acceptConsent"
            class="flex-1 px-6 py-3 bg-primary text-WtB font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 text-sm">
            Accepter tout
          </button>
          <button @click="declineConsent"
            class="flex-1 px-6 py-3 bg-ash/50 text-BtW font-bold rounded-2xl hover:bg-ash transition-all active:scale-95 text-sm border border-ashAct">
            Refuser
          </button>
        </div>

        <p class="text-[10px] text-hsa/60 mt-4 text-center">
          En cliquant sur "Accepter", vous consentez à l'utilisation de cookies conformément à notre
          <NuxtLink to="/legal/privacy" class="underline hover:text-primary transition-colors">politique de
            confidentialité</NuxtLink>.
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IconShieldCheck } from '@tabler/icons-vue'
import { useCookieConsent } from '~/composables/useCookieConsent'

const { hasConsent, acceptConsent, declineConsent, loadConsent } = useCookieConsent()

onMounted(() => {
  loadConsent()
})
</script>
