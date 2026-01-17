<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">DocSentry</h1>
        <p class="text-slate-500 dark:text-slate-400">Gestion et certification des documents officiels</p>
      </div>
      <BaseButton>
        <span class="mr-2">+</span> Nouveau Document
      </BaseButton>
    </div>

    <!-- Filters and Search (Mock) -->
    <BaseCard>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <IconSearch class="w-5 h-5" />
          </span>
          <input type="text" placeholder="Rechercher par nom ou hash..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
        </div>
        <div class="flex gap-2">
          <select
            class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary">
            <option>Tous les statuts</option>
            <option>Vérifié</option>
            <option>En attente</option>
            <option>Rejeté</option>
          </select>
          <BaseButton variant="secondary">
            Filtres
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Documents Table -->
    <BaseCard class="overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead
            class="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="px-6 py-4 font-semibold">Nom du Document</th>
              <th class="px-6 py-4 font-semibold">Date d'émission</th>
              <th class="px-6 py-4 font-semibold">Empreinte (Hash)</th>
              <th class="px-6 py-4 font-semibold">Statut</th>
              <th class="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="doc in cypassData.documents" :key="doc.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-400">
                    <IconFileText class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="font-medium text-slate-900 dark:text-white">{{ doc.name }}</div>
                    <div class="text-xs text-slate-500">ID: {{ doc.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-400">
                {{ doc.date }}
              </td>
              <td class="px-6 py-4 font-code text-xs text-slate-500">
                {{ doc.hash }}
              </td>
              <td class="px-6 py-4">
                <StatusBadge :status="doc.status" />
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-slate-400 hover:text-primary transition-colors mx-1">
                  <IconDownload class="w-5 h-5" />
                </button>
                <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors mx-1">
                  <IconDotsVertical class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Mock -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div class="text-sm text-slate-500">Affichage de <span class="font-medium">1</span> à <span
            class="font-medium">3</span> sur <span class="font-medium">3</span> résultats</div>
        <div class="flex gap-2">
          <BaseButton variant="secondary" size="sm" disabled>Précédent</BaseButton>
          <BaseButton variant="secondary" size="sm" disabled>Suivant</BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { IconSearch, IconFileText, IconDownload, IconDotsVertical } from '@tabler/icons-vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const cypassData = useCypassData()
</script>
