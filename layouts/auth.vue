<template>
  <div class="flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div
          class="mx-auto w-12 h-12 rounded bg-gradient-to-br from-primary to-cypass-green flex items-center justify-center text-white font-bold text-xl mb-4">
          C</div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">CYPASS</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2">Portail de Souveraineté Numérique</p>
      </div>

      <slot />

      <div class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <NuxtLink to="/" class="hover:text-primary hover:underline">Retour à l'accueil</NuxtLink>
      </div>
    </div>
  </div>
</template>
