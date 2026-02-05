<template>
	<section class="py-16 md:py-24 relative">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
			<div class="text-center mb-10 md:mb-16 animate-fade-up">
				<h2 class="text-3xl md:text-4xl font-bold mb-4">Questions fréquentes</h2>
				<p>Tout ce que vous devez savoir sur la plateforme CYPASS.
				</p>
			</div>

			<!-- Disposition divisée -->
			<div class="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
				<!-- Colonne gauche : Contenu FAQ -->
				<div class="lg:col-span-7 space-y-4">
					<div v-for="(item, index) in faqItems" :key="index"
						class="glass-panel rounded-2xl overflow-hidden transition-all duration-300 animate-fade-right"
						:class="{ 'ring-2 ring-primary/50 bg-WtB/80': activeIndex === index }"
						:style="{ animationDelay: `${index * 100}ms` }">
						<UiBaseButton @click="toggle(index)" variant="ghost"
							class="!w-full !flex !items-center !justify-between !p-4 md:!p-6 !text-left focus:outline-none group !h-auto !bg-transparent hover:!bg-transparent">
							<div class="flex flex-col gap-2 pr-8">
								<UiStatusBadge v-if="item.category" :status="item.category" class="w-fit">
									{{ truncate(item.category, 15) }}
								</UiStatusBadge>
								<span class="font-bold text-BtW text-base md:text-lg group-hover:text-primary transition-colors">
									{{ item.question }}
								</span>
							</div>
							<span class="p-2 rounded-full bg-ashAct transition-all duration-300 flex-shrink-0"
								:class="{ 'rotate-180': activeIndex === index, 'group-hover:bg-primary/20': activeIndex !== index }">
								<IconChevronDown class="w-5 h-5" />
							</span>
						</UiBaseButton>

						<div v-show="activeIndex === index"
							class="px-4 pb-4 md:px-6 md:pb-6 text-sm md:text-base text-hsa leading-relaxed border-t border-ash/50 pt-4">
							{{ item.answer }}
						</div>
					</div>
				</div>

				<!-- Colonne droite : Visuel -->
				<div class="lg:col-span-5 relative lg:sticky lg:top-24 animate-fade-left hidden lg:block">
					<div class="absolute -inset-4 bg-purple-500/20 blur-3xl opacity-20 rounded-full"></div>

					<UiAppFrame type="browser" url="https://help.cypass.bj" :glass="true" class="shadow-2xl">
						<div class="flex flex-col h-[450px] bg-bgClr overflow-hidden">

							<!-- Bannière de recherche Hero -->
							<div class="bg-gradient-to-r from-primary/10 to-blue-500/10 p-8 text-center border-b border-ash">
								<h3 class="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Centre d'aide</h3>
								<div class="relative max-w-xs mx-auto">
									<IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
									<input type="text" placeholder="Rechercher une réponse..." disabled
										class="w-full h-9 pl-9 pr-4 text-xs rounded-lg border border-ash bg-WtB text-slate-600 shadow-sm">
								</div>
							</div>

							<!-- Contenu de la Base de Connaissances -->
							<div class="p-6 overflow-hidden relative flex-1">
								<div class="space-y-6">
									<!-- Grille de liens rapides -->
									<div class="grid grid-cols-2 gap-3">
										<div
											class="p-3 bg-WtB rounded-lg border border-ash shadow-sm flex flex-col items-center text-center gap-2">
											<div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
												<IconBook class="w-4 h-4" />
											</div>
											<span class="text-[10px] font-bold">Guides</span>
										</div>
										<div
											class="p-3 bg-WtB rounded-lg border border-ash shadow-sm flex flex-col items-center text-center gap-2">
											<div class="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center">
												<IconCode class="w-4 h-4" />
											</div>
											<span class="text-[10px] font-bold">API</span>
										</div>
									</div>

									<!-- Articles populaires -->
									<div class="space-y-3">
										<div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Articles populaires</div>

										<div class="space-y-2">
											<div class="flex items-center gap-3 p-2 hover:bg-WtBAct rounded transition-colors cursor-default">
												<IconArticle class="w-4 h-4 text-slate-400" />
												<div class="flex-1 min-w-0">
													<div class="h-2 bg-ash rounded w-3/4 mb-1"></div>
													<div class="h-1.5 bg-ashAct rounded w-1/2"></div>
												</div>
											</div>
											<div class="flex items-center gap-3 p-2 hover:bg-WtBAct rounded transition-colors cursor-default">
												<IconArticle class="w-4 h-4 text-slate-400" />
												<div class="flex-1 min-w-0">
													<div class="h-2 bg-ash rounded w-2/3 mb-1"></div>
													<div class="h-1.5 bg-ashAct rounded w-1/3"></div>
												</div>
											</div>
											<div class="flex items-center gap-3 p-2 hover:bg-WtBAct rounded transition-colors cursor-default">
												<IconArticle class="w-4 h-4 text-slate-400" />
												<div class="flex-1 min-w-0">
													<div class="h-2 bg-ash rounded w-4/5 mb-1"></div>
													<div class="h-1.5 bg-ashAct rounded w-1/4"></div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- Aide à l'effet de survol -->
								<div
									class="absolute bottom-6 left-6 right-6 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3">
									<div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
									<span class="text-xs text-primary font-medium">
										Service de support actif 24/7</span>
								</div>
							</div>
						</div>
					</UiAppFrame>
				</div>
			</div>

			<div class="mt-12 text-center">
				<p class="text-hsa mb-4">Vous ne trouvez pas votre réponse ?</p>
				<NuxtLink to="/support" class="text-primary font-bold hover:underline">Contacter le support dédié
					&rarr;</NuxtLink>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconChevronDown, IconSearch, IconBook, IconCode, IconArticle } from '@tabler/icons-vue'
import { popularFaqItems } from '@/data/faq'

const activeIndex = ref<number | null>(0)

const toggle = (index: number) => {
	activeIndex.value = activeIndex.value === index ? null : index
}

// Fonction pour tronquer les chaînes de caractères
const truncate = (text: string, length: number) => {
	return text.length > length ? text.substring(0, length) + '...' : text
}

// Mélange aléatoirement et prend 4 éléments
const faqItems = computed(() => {
	return [...popularFaqItems]
		.sort(() => Math.random() - 0.5)
		.slice(0, 4)
})
</script>
