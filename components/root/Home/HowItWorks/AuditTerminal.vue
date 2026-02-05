<template>
  <UiAppFrame type="terminal" title="secuscan_audit.sh" rounded="rounded-lg" shadow="shadow-2xl"
    class="transform transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-primary/20"
    body-class="h-[180px] flex flex-col">
    <div class="text-success space-y-1">
      <p>> init_secuscan --target=all</p>
      <p class="text-slate-400">Scanning ports [22, 80, 443]...</p>
      <p class="flex items-center gap-2">
        <span class="w-20 h-1 bg-slate-700 rounded-full overflow-hidden">
          <span class="block h-full bg-success animate-[width_2s_ease-in-out_infinite]" style="width: 70%"></span>
        </span>
        <span class="text-blue-300">Done</span>
      </p>
      <p>> analyzing_vulnerabilities...</p>
      <p class="text-yellow-300">! Warning: Config check recommended</p>
      <p class="text-success">> optimization_complete</p>
      <span class="animate-pulse">_</span>
    </div>
  </UiAppFrame>
</template>

<style scoped>
@keyframes width {

  0%,
  100% {
    width: 0%;
  }

  50% {
    width: 100%;
  }
}
</style>
