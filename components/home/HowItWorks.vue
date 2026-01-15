<template>
    <section class="py-24 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <div class="text-center max-w-3xl mx-auto mb-20 animate-fade-up">
                <span class="badge badge-blue mb-4">Processus Simplifié</span>
                <h2 class="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                    Comment sécuriser votre organisation ?
                </h2>
                <p class="text-lg text-slate-600 dark:text-slate-300">
                    Intégrer CYPASS est un processus fluide, conçu pour les infrastructures critiques sans interruption
                    de service.
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 relative">
                <!-- Connecting Line (Desktop) -->
                <div
                    class="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 dark:from-blue-900 dark:via-purple-900 dark:to-green-900 -z-10">
                </div>

                <!-- Step 1 -->
                <div class="relative group animate-fade-up" style="animation-delay: 100ms">
                    <div
                        class="glass-panel p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-500 h-full">
                        <div
                            class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-cypass-blue text-2xl font-bold shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-300 ring-4 ring-white dark:ring-slate-900">
                            1
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Connexion & Audit</h3>
                        <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Créez votre compte organisation et lancez un audit automatique SecuScan pour identifier
                            votre surface d'attaque actuelle.
                        </p>
                    </div>
                </div>

                <!-- Step 2 -->
                <div class="relative group animate-fade-up" style="animation-delay: 200ms">
                    <div
                        class="glass-panel p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-500 h-full">
                        <div
                            class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 text-2xl font-bold shadow-lg shadow-purple-500/10 group-hover:scale-110 transition-transform duration-300 ring-4 ring-white dark:ring-slate-900">
                            2
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Certification</h3>
                        <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Obtenez vos certificats numériques qualifiés via DocSentry. Configurez vos clés API pour la
                            signature électronique.
                        </p>
                    </div>
                </div>

                <!-- Step 3 -->
                <div class="relative group animate-fade-up" style="animation-delay: 300ms">
                    <div
                        class="glass-panel p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-500 h-full">
                        <div
                            class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-cypass-green text-2xl font-bold shadow-lg shadow-green-500/10 group-hover:scale-110 transition-transform duration-300 ring-4 ring-white dark:ring-slate-900">
                            3
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Protection Continue</h3>
                        <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Activez le monitoring VigiTech. Recevez des alertes en temps réel et des rapports de
                            conformité mensuels.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>
