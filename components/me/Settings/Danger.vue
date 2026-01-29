<template>
  <div>
    <UiBaseCard class="border border-danger/30 bg-danger/5">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-danger">Zone de danger</h3>
          <p class="text-sm text-danger/70">Actions irréversibles pour votre compte.</p>
        </div>
        <UiBaseButton variant="danger" size="sm" @click="showDeleteModal = true">
          Supprimer mon compte
        </UiBaseButton>
      </div>
    </UiBaseCard>

    <!-- Delete Account Modal -->
    <ModalSettingDelete :show="showDeleteModal" @close="showDeleteModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showDeleteModal = ref(false)
</script>
