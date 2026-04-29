<template>
  <section class="py-16 md:py-24 relative overflow-hidden bg-bgClr">
    <!-- Éléments d'arrière-plan -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:24px_24px]">
    </div>
    <div class="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-ash to-transparent">
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- En-tête -->
      <div class="text-center max-w-3xl mx-auto mb-16 md:mb-24 animate-fade-up">
        <span
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Pipeline de Sécurité
        </span>
        <h2 class="text-3xl md:text-5xl font-extrabold text-BtW mb-4 md:mb-6">
          Un processus <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">
            fluide et sécurisé</span>
        </h2>
        <p class="text-base md:text-lg text-hsa">
          De la certification de vos documents au signalement d'incidents cyber, maîtrisez votre souveraineté numérique
          simplement.
        </p>
      </div>

      <!-- Flux 1: DocSentry -->
      <div class="mb-24 md:mb-32">
        <div class="flex items-center gap-4 mb-10 md:mb-16">
          <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <IconFileCheck class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-3xl md:text-4xl font-extrabold text-BtW tracking-tight">DocSentry</h3>
            <p class="text-hsa font-medium">L'infrastructure de certification</p>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-16 lg:gap-12 relative animate-fade-right">
          <!-- Connector line -->
          <div
            class="hidden lg:block absolute top-[25%] left-1/2 w-12 h-px bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 -translate-x-1/2">
          </div>

          <!-- STEP 1 -->
          <div class="space-y-6 flex flex-col">
            <!-- Step 1 Text -->
            <div class="flex-1">
              <div
                class="inline-flex items-center justify-center h-6 px-3 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest mb-4">
                01. EMISSION</div>
              <h4 class="text-xl md:text-2xl font-bold text-BtW mb-3">Certifier un document</h4>
              <p class="text-hsa text-sm leading-relaxed">
                Appose un sceau officiel sur ton contrat avant de l'envoyer. Connecte-toi sur <span
                  class="font-bold">cypass.bj</span>, envoie ton PDF et obtiens instantanément la version originale
                protégée avec un <strong class="text-BtW">QR Code CYPASS</strong> intrésèque.
                La protection voyage ensuite avec ton fichier peu importe le canal choisi (email, USB, réseau social).
              </p>
            </div>

            <!-- Step 1 Frame -->
            <UiAppFrame type="browser" url="https://cypass.bj/certifier" :glass="true" rounded="rounded-3xl"
              padding="p-0"
              class="w-full transform lg:rotate-y-3 lg:rotate-x-2 transition-transform duration-700 ease-out z-20 shadow-xl group hover:rotate-0 mt-auto">
              <div
                class="bg-WtB/40 backdrop-blur-xl border-t border-white/20 p-4 md:p-6 rounded-b-2xl h-[300px] flex items-center justify-center relative overflow-hidden">
                <div
                  class="absolute inset-0 bg-[url('https://heropatterns.com/img/patterns/circuit-board.png')] opacity-10 mix-blend-overlay">
                </div>
                <!-- Mockup Upload -> QR -->
                <div class="relative z-10 w-full flex flex-col items-center gap-5">
                  <div
                    class="p-4 bg-primary/10 border border-primary/20 rounded-2xl w-2/3 md:w-3/4 flex items-center justify-center border-dashed backdrop-blur-md shadow-sm">
                    <IconUpload class="w-6 h-6 text-primary mr-3" />
                    <span class="text-sm font-semibold text-BtW truncate">Contrat-Achat.pdf</span>
                  </div>
                  <IconArrowDown class="w-5 h-5 text-primary opacity-60 animate-bounce" />
                  <div
                    class="p-4 bg-success/10 border border-success/30 rounded-2xl w-2/3 md:w-3/4 flex items-center justify-between backdrop-blur-md shadow-[0_4px_15px_rgba(74,222,128,0.1)]">
                    <div class="flex items-center">
                      <IconFileCheck class="w-5 h-5 text-success mr-2" />
                      <span class="text-sm font-semibold text-BtW">Sécurisé</span>
                    </div>
                    <IconQrcode class="w-8 h-8 text-BtW" />
                  </div>
                </div>
              </div>
            </UiAppFrame>
          </div>

          <!-- STEP 2 -->
          <div class="space-y-6 flex flex-col">
            <!-- Step 2 Text -->
            <div class="flex-1">
              <div
                class="inline-flex items-center justify-center h-6 px-3 rounded-full bg-success/10 text-success text-[10px] font-black tracking-widest mb-4">
                02. AUDIT</div>
              <h4 class="text-xl md:text-2xl font-bold text-BtW mb-3">Vérifier un document reçu</h4>
              <p class="text-hsa text-sm leading-relaxed">
                Tu as reçu un contrat ou une attestation avec un QR Code CYPASS ? <strong class="text-BtW">Scanne-le
                  avec ton smartphone</strong>.
                En quelques secondes, tu as ta réponse : document intact (de confiance) ou altéré (alerte). <strong
                  class="text-success">Pas besoin de créer un compte, ni d'installer une application.</strong>
              </p>
            </div>

            <!-- Step 2 Frame -->
            <UiAppFrame type="mobile" :glass="true" rounded="rounded-[2.5rem]" padding="p-0"
              class="w-full max-w-[280px] mx-auto transform lg:-rotate-y-3 lg:rotate-x-2 transition-transform duration-700 ease-out z-20 shadow-xl group hover:rotate-0 mt-auto">
              <div
                class="bg-WtB border-x border-b border-ash/50 rounded-b-[2.5rem] h-[370px] relative overflow-hidden flex flex-col pt-12 pb-6 px-4">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-hsaAct rounded-b-2xl z-30"></div>
                <!-- Mockup Scan -> Success -->
                <div
                  class="flex-1 bg-ash rounded-xl border border-ashAct overflow-hidden relative transition-colors shadow-inner flex flex-col items-center justify-center">
                  <!-- Fake camera view bg -->
                  <div class="absolute inset-0 bg-slate-900/5 mix-blend-multiply"></div>

                  <div class="relative z-10 flex flex-col items-center justify-center p-6 w-full h-full">
                    <div
                      class="w-40 h-40 border-2 border-dashed border-success/40 rounded-3xl flex items-center justify-center relative mb-4">
                      <div class="absolute inset-0 bg-success/10 blur-xl rounded-full"></div>
                      <div
                        class="bg-WtB/90 p-4 rounded-2xl shadow-lg border border-success/30 relative text-center backdrop-blur-sm animate-pulse-slow">
                        <IconRosetteDiscountCheck class="w-10 h-10 text-success mx-auto mb-1" />
                        <div class="text-[11px] font-black text-BtW tracking-wide">AUTHENTIQUE</div>
                      </div>
                    </div>
                  </div>
                  <!-- scanner line overlay -->
                  <div
                    class="absolute top-1/2 left-0 right-0 h-0.5 bg-success shadow-[0_0_12px_3px_rgba(74,222,128,0.6)] transform -translate-y-1/2 animate-pulse">
                  </div>
                </div>
              </div>
            </UiAppFrame>
          </div>
        </div>
      </div>

      <!-- Flux 2: VigiTech -->
      <div class="animate-fade-up">
        <div class="flex items-center gap-4 mb-10 md:mb-16">
          <div
            class="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
            <IconShieldCheck class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-3xl md:text-4xl font-extrabold text-BtW tracking-tight">VigiTech</h3>
            <p class="text-hsa font-medium">Veille citoyenne proactive</p>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">

          <div class="space-y-6 order-2 lg:order-1">
            <!-- Step VigiTech Frame -->
            <UiAppFrame type="browser" url="https://vigitech.cypass.bj/signaler" :glass="true" rounded="rounded-3xl"
              padding="p-0"
              class="w-full transform lg:rotate-y-3 lg:-rotate-x-2 transition-transform duration-700 ease-out z-20 shadow-xl group hover:rotate-0">
              <div
                class="bg-WtB/40 backdrop-blur-xl border-t border-white/20 p-4 md:p-6 rounded-b-2xl h-[420px] relative overflow-hidden text-left shadow-inner flex flex-col justify-center">
                <div
                  class="absolute inset-0 bg-[url('https://heropatterns.com/img/patterns/circuit-board.png')] opacity-10 mix-blend-overlay">
                </div>

                <!-- Mockup Form -->
                <div
                  class="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-ash/50 shadow-lg relative z-10 max-w-sm mx-auto w-full">
                  <div class="text-sm font-bold text-BtW mb-5 flex items-center justify-between">
                    <span>Nouveau Signalement</span>
                    <IconUpload class="w-4 h-4 text-hsa" />
                  </div>

                  <div class="space-y-4">
                    <div class="h-10 bg-ashAct/10 border border-ash rounded-xl w-full flex items-center px-4">
                      <div class="h-2 bg-ashAct/40 rounded w-1/3"></div>
                    </div>
                    <div class="h-24 bg-ashAct/10 border border-ash rounded-xl w-full p-4 relative">
                      <div class="h-2 bg-ashAct/40 rounded w-5/6 mb-3"></div>
                      <div class="h-2 bg-ashAct/40 rounded w-full mb-3"></div>
                      <div class="h-2 bg-ashAct/40 rounded w-2/3"></div>
                      <IconUpload class="absolute bottom-3 right-3 w-4 h-4 text-ashAct/50" />
                    </div>

                    <div class="flex items-center justify-between py-3 border-y border-ash mt-4">
                      <span class="text-[10px] font-black text-hsa tracking-widest">SIGNALEMENT ANONYME</span>
                      <div class="w-10 h-5 bg-primary/90 rounded-full relative shadow-inner">
                        <div class="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>

                    <div class="pt-3">
                      <button
                        class="w-full bg-gradient-to-r from-secondary to-primary/80 text-white text-xs font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95">
                        Soumettre l'alerte
                        <IconSend class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </UiAppFrame>
          </div>

          <div class="space-y-6 order-1 lg:order-2 flex flex-col h-full justify-center pl-0 lg:pl-8">
            <!-- Step VigiTech Text -->
            <div>
              <div
                class="inline-flex items-center justify-center h-6 px-3 rounded-full bg-secondary/10 text-secondary text-[10px] font-black tracking-widest mb-4">
                ACTION CITOYENNE</div>
              <h4 class="text-2xl md:text-3xl font-bold text-BtW mb-4">Signaler un incident</h4>
              <p class="text-hsa text-base leading-relaxed mb-6">
                Tu as reçu un message suspect, une tentative d'arnaque ou un faux document ? Va sur VigiTech et remplis
                un formulaire très simple. Décris ce qui s'est passé, choisis si tu veux <strong class="text-BtW">rester
                  anonyme ou non</strong>, et joins une capture d'écran comme preuve. Tu envoies, c'est tout.
              </p>

              <div class="p-5 md:p-6 bg-secondary/5 border-l-4 border-secondary rounded-r-2xl">
                <h5 class="text-sm font-bold text-BtW mb-2 flex items-center">
                  <IconShieldCheck class="w-4 h-4 text-secondary mr-2" />
                  Que se passe t-il en coulisse ?
                </h5>
                <p class="text-xs md:text-sm text-hsa leading-relaxed">
                  Un modérateur examine ton signalement, le publie sur le tableau de veille pour alerter la communauté,
                  et si la situation est jugée critique, elle est remontée directement aux autorités cyber compétentes
                  du Bénin.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { IconFileCheck, IconShieldCheck, IconUpload, IconArrowDown, IconQrcode, IconRosetteDiscountCheck, IconSend } from '@tabler/icons-vue'
</script>
