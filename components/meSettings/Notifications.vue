<template>
  <UiBaseCard title="Notifications">
    <div class="space-y-6">
      <div v-for="(setting, index) in settings" :key="index"
        class="flex items-center justify-between pb-4 border-b border-ash last:border-0 last:pb-0">
        <div>
          <h3 class="font-medium text-BtW">{{ setting.title }}</h3>
          <p class="text-xs text-hsa mt-0.5">{{ setting.desc }}</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="setting.enabled" class="sr-only peer">
          <div
            class="w-11 h-6 bg-ash peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
          </div>
        </label>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
defineProps<{
  settings: {
    title: string
    desc: string
    enabled: boolean
  }[]
}>()
</script>
