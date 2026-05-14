<template>
  <div class="flex items-center gap-4 mb-8">
    <UiBaseButton variant="ghost" size="sm" class="!p-2 -ml-2" @click="router.push('/dashboard/activities')">
      <IconArrowLeft class="w-5 h-5 text-hsa" />
    </UiBaseButton>
    <div>
      <h4>Détails de l'activité</h4>
      <p>Vue approfondie de l'événement système</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'

const router = useRouter()
</script>
