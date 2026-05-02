<template>
  <tr>
    <td colspan="5" class="px-6 py-20 text-center">
      <div class="flex flex-col items-center justify-center space-y-4 opacity-30">
        <div class="p-4 bg-ash rounded-full">
          <IconArchiveOff v-if="isArchive" class="w-12 h-12 text-hsa" />
          <IconFileOff v-else class="w-12 h-12 text-hsa" />
        </div>
        <div class="space-y-1">
          <p class="text-lg font-bold text-BtW">
            {{ isArchive ? 'Aucune archive' : 'Aucun document' }}</p>
          <p class="text-sm">
            {{ isArchive
              ? 'Vous n\'avez pas encore de documents archivés.'
              : 'Commencez par certifier votre premier document.'
            }}
          </p>
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { IconFileOff, IconArchiveOff } from '@tabler/icons-vue'

defineProps<{
  isArchive?: boolean
}>()
</script>
