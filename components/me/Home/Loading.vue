<template>
  <div class="space-y-8 animate-pulse">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="bg-WtB border border-ash rounded-3xl p-6 space-y-4 shadow-sm">
        <div class="flex items-center gap-4">
          <UiAppSkeleton type="rect" width="48px" height="48px" radius="16px" />
          <div class="flex-1 space-y-2">
            <UiAppSkeleton type="heading" width="70%" height="16px" />
            <UiAppSkeleton type="text" width="40%" height="10px" />
          </div>
        </div>
        <div class="pt-4 border-t border-ash/50 flex justify-between items-center">
          <UiAppSkeleton type="text" width="30%" height="8px" />
          <UiAppSkeleton type="circle" width="16px" height="16px" />
        </div>
      </div>
    </div>
  </div>
</template>
