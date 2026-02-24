<template>
  <div>
    <UiBaseCard class="border border-danger/30 bg-danger/5">
      <div class="flex items-center justify-between">
        <!-- Avertissement sur la suppression -->
        <div>
          <h3 class="font-bold text-danger">Zone de danger</h3>
          <p class="text-sm text-danger/70">Actions irréversibles pour votre compte.</p>
        </div>
        <!-- Déclencheur de la modale de suppression -->
        <UiBaseButton variant="danger" size="sm" @click="showDeleteModal = true">
          Supprimer mon compte
        </UiBaseButton>
      </div>
    </UiBaseCard>

    <!-- Modale de Confirmation de Suppression : Gérée par un composant externe -->
    <ModalSettingDelete :show="showDeleteModal" @close="showDeleteModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// État de visibilité de la modale de suppression
const showDeleteModal = ref(false)
</script>
