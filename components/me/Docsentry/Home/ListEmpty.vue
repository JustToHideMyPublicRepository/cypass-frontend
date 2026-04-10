<template>
  <tr>
    <td colspan="5" class="px-6 py-20 text-center">
      <div class="flex flex-col items-center justify-center space-y-4 opacity-30">
        <div class="p-4 bg-ash rounded-full">
          <IconFileOff class="w-12 h-12 text-hsa" />
        </div>
        <div class="space-y-1">
          <p class="text-lg font-bold text-BtW">Aucun document</p>
          <p class="text-sm">Commencez par certifier votre premier document.</p>
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { IconFileOff } from '@tabler/icons-vue'
</script>
