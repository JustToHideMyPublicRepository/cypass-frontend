<template>
  <div class="flex flex-col ">

    <LayoutGuestHeader />

    <!-- Content -->
    <main class="flex-grow pt-20">
      <slot />
    </main>

    <LayoutGuestFooter />
  </div>
</template>

<script setup lang="ts">
// Logic has been moved to components/layoutGuest/Header.vue and components/layoutGuest/Footer.vue
</script>

<style scoped>
/* Scoped styles if needed */
</style>
