<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
    <div class="lg:col-span-8 space-y-8">
      <div class="glass-panel p-8 md:p-12 rounded-[3.5rem] border border-ashAct space-y-8 shadow-xl bg-ash/5">
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <UiAppSkeleton width="80px" height="24px" radius="99px" />
            <UiAppSkeleton width="120px" height="24px" radius="99px" />
          </div>
          <UiAppSkeleton width="80%" height="48px" radius="1rem" />
          <div class="flex gap-6">
            <UiAppSkeleton width="150px" height="20px" />
            <UiAppSkeleton width="150px" height="20px" />
          </div>
        </div>
        <div class="h-px bg-ashAct/50"></div>
        <div class="space-y-4">
          <UiAppSkeleton width="100px" height="12px" />
          <UiAppSkeleton :count="4" height="16px" />
        </div>
      </div>
    </div>
    <div class="lg:col-span-4 space-y-6">
      <UiAppSkeleton height="200px" radius="2.5rem" />
      <UiAppSkeleton height="150px" radius="2.5rem" />
    </div>
  </div>
</template>
