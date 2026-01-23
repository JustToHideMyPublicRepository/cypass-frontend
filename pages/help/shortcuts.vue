<template>
  <div class="max-w-4xl mx-auto px-4 py-4">
    <div class="text-center mb-16 animate-fade-up">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
        <IconKeyboard class="w-10 h-10" />
      </div>
      <h1 class="text-4xl font-black tracking-tight mb-4">Raccourcis Clavier</h1>
      <p class="text-lg text-hs">Naviguez plus rapidement sur CYPASS grâce à nos raccourcis.</p>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Global Shortcuts -->
      <UiBaseCard title="Navigation Globale" class="animate-fade-up" style="animation-delay: 100ms">
        <div class="space-y-4">
          <div v-for="shortcut in globalShortcuts" :key="shortcut.key" class="flex items-center justify-between group">
            <span class="text-BtW font-medium">{{ shortcut.label }}</span>
            <div class="flex items-center gap-1">
              <kbd class="kbd">Shift</kbd>
              <span class="text-hsa">+</span>
              <kbd class="kbd uppercase">{{ shortcut.key }}</kbd>
            </div>
          </div>
        </div>
      </UiBaseCard>

      <!-- Contextual Shortcuts -->
      <UiBaseCard title="Raccourcis Contextuels" class="animate-fade-up" style="animation-delay: 200ms">
        <div class="space-y-4">
          <div v-for="shortcut in contextualShortcuts" :key="shortcut.key"
            class="flex items-center justify-between group">
            <span class="text-BtW font-medium">{{ shortcut.label }}</span>
            <div class="flex items-center gap-1">
              <template v-if="shortcut.key.includes('+')">
                <kbd class="kbd">{{ shortcut.key.split('+')[0] }}</kbd>
                <span class="text-hsa">+</span>
                <kbd class="kbd">{{ shortcut.key.split('+')[1] }}</kbd>
              </template>
              <kbd v-else class="kbd">{{ shortcut.key }}</kbd>
            </div>
          </div>
        </div>
      </UiBaseCard>
    </div>

    <div class="mt-16 p-8 rounded-3xl bg-ash/50 border border-ash text-center animate-fade-up"
      style="animation-delay: 300ms">
      <p class="text-hsa">Les raccourcis sont désactivés lorsque vous tapez dans un champ de saisie.</p>
      <div class="mt-6">
        <UiBaseButton to="/" variant="secondary">Retour à l'accueil</UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconKeyboard } from '@tabler/icons-vue'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Raccourcis Clavier'
})

const globalShortcuts = [
  { label: 'Accueil', key: 'h' },
  { label: 'Connexion', key: 'l' },
  { label: 'Profil', key: 'p' },
  { label: 'Mentions Légales', key: 'm' },
  { label: 'Support', key: 's' },
  { label: 'A propos', key: 'a' },
  { label: 'Contact', key: 'c' },
  { label: 'FAQ', key: 'f' },
  { label: 'Développeurs', key: 'd' },
  { label: 'Status', key: 't' },
]

const contextualShortcuts = [
  { label: 'Rechercher', key: 'Ctrl+K' },
  { label: 'Fermer / Quitter focus', key: 'Esc' },
  { label: 'Aide raccourcis', key: '?' },
]
</script>

<style scoped>
.kbd {
  padding: 0.25rem 0.5rem;
  background-color: var(--BtW);
  color: var(--WtB);
  border: 1px solid var(--ash);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.1);
  min-width: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
