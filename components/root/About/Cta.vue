<template>
  <section class="py-16 md:py-20 bg-WtB relative overflow-hidden border-t border-ash">
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]">
    </div>
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>

    <div class="max-w-4xl mx-auto px-4 text-center relative z-10 animate-fade-up">
      <h3 class="mb-6">Prêt à sécuriser votre avenir ?</h3>
      <p class="mb-8 max-w-2xl mx-auto">Rejoignez les centaines d'organisations qui font
        déjà confiance à CYPASS pour leur protection numérique.</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <UiBaseButton to="/auth/register" variant="primary">Créer votre compte</UiBaseButton>
        <UiBaseButton to="/contact" variant="secondary">Nous contacter</UiBaseButton>
      </div>
    </div>
  </section>
</template>
