<template>
  <div class="flex flex-col ">
    <LytGuestHeader />

    <!-- Contenu -->
    <main class="flex-grow pt-24">
      <slot />
    </main>

    <LytGuestFooter />
  </div>
</template>
