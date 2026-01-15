<template>
    <section class="py-20 bg-slate-900 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10">
        </div>
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>

        <div class="max-w-4xl mx-auto px-4 text-center relative z-10" data-aos="fade-up">
            <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">Prêt à sécuriser votre avenir ?</h2>
            <p class="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Rejoignez les centaines d'organisations qui font
                déjà confiance à CYPASS pour leur protection numérique.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <NuxtLink to="/auth/register" class="btn btn-primary px-8 py-3 text-lg">Créer un compte</NuxtLink>
                <NuxtLink to="/contact"
                    class="btn btn-ghost text-white border border-white/20 hover:bg-white/10 px-8 py-3 text-lg">Nous
                    Contacter</NuxtLink>
            </div>
        </div>
    </section>
</template>
