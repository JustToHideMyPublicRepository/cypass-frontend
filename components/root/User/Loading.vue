<template>
  <div class="w-full space-y-8 animate-fade-in">
    <UiAppSkeleton height="350px" radius="3rem" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UiAppSkeleton v-for="i in 2" :key="i" height="500px" radius="3rem" />
    </div>
  </div>
</template>
