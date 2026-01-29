<template>
  <div class="flex-1 overflow-y-auto w-full custom-scrollbar">
    <div class="flex flex-col justify-center min-h-full px-6 sm:px-10 lg:px-12 xl:px-16 py-12 max-w-lg mx-auto">

      <div class="mb-10 animate-fade-down">
        <NuxtLink to="/" class="inline-flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl p-0.5">
            <div class="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <img src="/img/logo.png" alt="Cypass Logo" class="w-full h-full object-contain" />
            </div>
          </div>
          <span class="text-2xl font-black tracking-tight">CYPASS</span>
        </NuxtLink>
      </div>

      <div class="animate-fade-up">
        <slot />
      </div>

      <div class="mt-8 text-center text-xs animate-fade-in pb-4 text-hsa">
        &copy; {{ new Date().getFullYear() }} CYPASS. Tous droits réservés.
      </div>
    </div>
  </div>
</template>
