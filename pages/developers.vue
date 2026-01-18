<template>
  <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
    <div class="max-w-5xl mx-auto">

      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div class="space-y-6 animate-fade-right">
          <span class="badge badge-blue">Pour les Développeurs</span>
          <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Intégrez la confiance <br />
            <span class="text-primary">dans vos apps</span>
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Accédez à nos API REST sécurisées pour automatiser la vérification d'identité, la signature de documents et
            la consultation des registres officiels.
          </p>

          <div class="flex gap-4 pt-4">
            <NuxtLink to="/support#developers" class="btn btn-primary">Lire la Documentation</NuxtLink>
            <button class="btn btn-secondary">Obtenir une Clé API</button>
          </div>
        </div>

        <div class="relative animate-fade-left">
          <div class="absolute inset-0 bg-blue-500 blur-[100px] opacity-10 rounded-full"></div>
          <UiAppFrame type="terminal" title="bash" :glass="true" rounded="rounded-2xl" padding="p-6"
            class="font-code text-sm text-slate-300 bg-slate-900 border-slate-800" body-class="space-y-2">
            <p><span class="text-purple-400">curl</span> -X POST https://api.cypass.bj/v1/sign \</p>
            <p class="pl-4">-H <span class="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span> \</p>
            <p class="pl-4">-H <span class="text-green-400">"Content-Type: application/json"</span> \</p>
            <p class="pl-4">-d <span class="text-orange-300">'{</span></p>
            <p class="pl-8 text-orange-300">"file_hash": "a7f9...9b2",</p>
            <p class="pl-8 text-orange-300">"signatory": "user_123"</p>
            <p class="pl-4 text-orange-300">}'</p>
            <p class="mt-4 text-green-500"># Response: 200 OK</p>
            <p class="text-slate-400">{ "status": "signed", "timestamp": "2024-01-15T10:00:00Z" }</p>
          </UiAppFrame>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Développeurs'
})
</script>
