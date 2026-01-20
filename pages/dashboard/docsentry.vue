<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">DocSentry</h1>
        <p>Gestion et certification des documents officiels</p>
      </div>
      <UiBaseButton>
        <span class="mr-2">+</span> Nouveau Document
      </UiBaseButton>
    </div>

    <!-- Filters and Search (Mock) -->
    <UiBaseCard>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-hsa">
            <IconSearch class="w-5 h-5" />
          </span>
          <input type="text" placeholder="Rechercher par nom ou hash..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-ash bg-ash focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-hsa" />
        </div>
        <div class="flex gap-2">
          <select class="px-4 py-2 rounded-lg border border-ash bg-ash text-sm focus:ring-2 focus:ring-primary">
            <option>Tous les statuts</option>
            <option>Vérifié</option>
            <option>En attente</option>
            <option>Rejeté</option>
          </select>
          <UiBaseButton variant="secondary">
            Filtres
          </UiBaseButton>
        </div>
      </div>
    </UiBaseCard>

    <!-- Documents Table -->
    <UiBaseCard class="overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-hsa uppercase bg-ash/50 border-b border-ash">
            <tr>
              <th class="px-6 py-4 font-semibold">Nom du Document</th>
              <th class="px-6 py-4 font-semibold">Date d'émission</th>
              <th class="px-6 py-4 font-semibold">Empreinte (Hash)</th>
              <th class="px-6 py-4 font-semibold">Statut</th>
              <th class="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ash">
            <tr v-for="doc in cypassData.documents" :key="doc.id" class="hover:bg-ash/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded bg-primary/10 text-primary">
                    <IconFileText class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="font-medium">{{ doc.name }}</div>
                    <div class="text-xs text-hsa">ID: {{ doc.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-hsa">
                {{ doc.date }}
              </td>
              <td class="px-6 py-4 font-code text-xs text-hsa">
                {{ doc.hash }}
              </td>
              <td class="px-6 py-4">
                <UiStatusBadge :status="doc.status" />
              </td>
              <td class="px-6 py-4 text-right">
                <button class="hover:text-primary transition-colors mx-1">
                  <IconDownload class="w-5 h-5" />
                </button>
                <button class="hover:text-BtW transition-colors mx-1">
                  <IconDotsVertical class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Mock -->
      <div class="px-6 py-4 border-t border-ash flex items-center justify-between">
        <div class="text-sm text-hsa">Affichage de <span class="font-medium">1</span> à <span
            class="font-medium">3</span> sur <span class="font-medium">3</span> résultats</div>
        <div class="flex gap-2">
          <UiBaseButton variant="secondary" size="sm" disabled>Précédent</UiBaseButton>
          <UiBaseButton variant="secondary" size="sm" disabled>Suivant</UiBaseButton>
        </div>
      </div>
    </UiBaseCard>
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
