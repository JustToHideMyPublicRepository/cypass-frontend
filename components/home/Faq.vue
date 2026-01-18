<template>
	<section class="py-24 relative">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

			<div class="text-center mb-16 animate-fade-up">
				<h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Questions Fréquentes</h2>
				<p class="text-slate-500 dark:text-slate-400">Tout ce que vous devez savoir sur la plateforme CYPASS.
				</p>
			</div>

			<!-- Split Layout -->
			<div class="grid lg:grid-cols-12 gap-12 items-start">

				<!-- Left Column: FAQ Content (Larger) -->
				<div class="lg:col-span-7 space-y-4">
					<div v-for="(item, index) in faqItems" :key="index"
						class="glass-panel rounded-2xl overflow-hidden transition-all duration-300 animate-fade-right"
						:class="{ 'ring-2 ring-primary/50 bg-slate-50 dark:bg-slate-800/80': activeIndex === index }"
						:style="{ animationDelay: `${index * 100}ms` }">
						<button @click="toggle(index)"
							class="w-full flex items-center justify-between p-6 text-left focus:outline-none group">
							<span
								class="font-bold text-slate-900 dark:text-white text-lg group-hover:text-primary transition-colors pr-8">{{
									item.question }}</span>
							<span class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 transition-all duration-300 flex-shrink-0"
								:class="{ 'rotate-180 bg-primary text-white': activeIndex === index, 'group-hover:bg-primary/20': activeIndex !== index }">
								<IconChevronDown class="w-5 h-5" />
							</span>
						</button>

						<div v-show="activeIndex === index"
							class="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4">
							{{ item.answer }}
						</div>
					</div>
				</div>

				<!-- Right Column: Visual (Knowledge Base / Help Center) -->
				<div class="lg:col-span-5 relative lg:sticky lg:top-24 animate-fade-left hidden lg:block">
					<div class="absolute -inset-4 bg-purple-500/20 blur-3xl opacity-20 rounded-full"></div>

					<UiAppFrame type="browser" url="https://help.cypass.bj" :glass="true" class="shadow-2xl">
						<div class="flex flex-col h-[450px] bg-slate-50 dark:bg-slate-900 overflow-hidden">

							<!-- Hero Search Banner -->
							<div
								class="bg-gradient-to-r from-primary/10 to-blue-500/10 p-8 text-center border-b border-slate-200 dark:border-slate-800">
								<h3 class="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Centre d'aide</h3>
								<div class="relative max-w-xs mx-auto">
									<IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
									<input type="text" placeholder="Rechercher une réponse..." disabled
										class="w-full h-9 pl-9 pr-4 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 shadow-sm">
								</div>
							</div>

							<!-- Knowledge Base Content -->
							<div class="p-6 overflow-hidden relative flex-1">
								<div class="space-y-6">
									<!-- Quick Links Grid -->
									<div class="grid grid-cols-2 gap-3">
										<div
											class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center gap-2">
											<div
												class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
												<IconBook class="w-4 h-4" />
											</div>
											<span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">Guides</span>
										</div>
										<div
											class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center gap-2">
											<div
												class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 flex items-center justify-center">
												<IconCode class="w-4 h-4" />
											</div>
											<span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">API</span>
										</div>
									</div>

									<!-- Popular Articles -->
									<div class="space-y-3">
										<div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Articles populaires</div>

										<div class="space-y-2">
											<div
												class="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-default">
												<IconArticle class="w-4 h-4 text-slate-400" />
												<div class="flex-1 min-w-0">
													<div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-1"></div>
													<div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
												</div>
											</div>
											<div
												class="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-default">
												<IconArticle class="w-4 h-4 text-slate-400" />
												<div class="flex-1 min-w-0">
													<div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-1"></div>
													<div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
												</div>
											</div>
											<div
												class="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-default">
												<IconArticle class="w-4 h-4 text-slate-400" />
												<div class="flex-1 min-w-0">
													<div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-4/5 mb-1"></div>
													<div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- Hover Effect Helper -->
								<div
									class="absolute bottom-6 left-6 right-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center gap-3">
									<div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
									<span class="text-xs text-blue-700 dark:text-blue-300 font-medium">
										Service de support actif 24/7</span>
								</div>
							</div>
						</div>
					</UiAppFrame>
				</div>
			</div>

			<div class="mt-12 text-center">
				<p class="text-slate-500 dark:text-slate-400 mb-4">Vous ne trouvez pas votre réponse ?</p>
				<NuxtLink to="/support" class="text-primary font-bold hover:underline">Contacter le support dédié
					&rarr;</NuxtLink>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconChevronDown, IconSearch, IconBook, IconCode, IconArticle } from '@tabler/icons-vue'
import { popularFaqItems } from '@/data/faq'

const activeIndex = ref<number | null>(0)

const toggle = (index: number) => {
	activeIndex.value = activeIndex.value === index ? null : index
}

const faqItems = popularFaqItems
</script>
