<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <UiBaseCard>
        <div class="flex items-center gap-4 mb-6">
          <UiAppSkeleton type="avatar" width="60px" height="60px" />
          <div class="space-y-2 flex-1">
            <UiAppSkeleton width="40%" height="24px" />
            <UiAppSkeleton width="20%" height="12px" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UiAppSkeleton v-for="i in 3" :key="i" height="80px" />
        </div>
      </UiBaseCard>
      <UiBaseCard>
        <UiAppSkeleton width="30%" height="20px" class="mb-6" />
        <div class="space-y-4">
          <UiAppSkeleton v-for="i in 4" :key="i" height="40px" />
        </div>
      </UiBaseCard>
    </div>
    <div class="space-y-6">
      <UiBaseCard>
        <UiAppSkeleton width="40%" height="20px" class="mb-4" />
        <div class="space-y-3">
          <UiAppSkeleton v-for="i in 3" :key="i" height="45px" />
        </div>
      </UiBaseCard>
      <UiAppSkeleton height="150px" />
    </div>
  </div>
</template>
