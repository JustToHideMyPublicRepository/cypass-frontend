<template>
  <div class="space-y-8">
    <UiAppSkeleton type="rect" width="100%" height="240px" class="!rounded-[2.5rem]" />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <UiAppSkeleton v-for="i in 2" :key="i" type="rect" width="100%" height="150px" class="!rounded-[2.5rem]" />
      </div>
      <UiAppSkeleton type="rect" width="100%" height="400px" class="!rounded-[2.5rem]" />
    </div>
  </div>
</template>
