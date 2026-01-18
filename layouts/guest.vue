<template>
  <div class="flex flex-col ">
    <LayoutGuestHeader />
    <!-- Content -->
    <main class="flex-grow pt-16">
      <slot />
    </main>
    <LayoutGuestFooter />
  </div>
</template>
