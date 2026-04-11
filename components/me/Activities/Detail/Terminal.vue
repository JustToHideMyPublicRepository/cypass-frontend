<template>
  <UiAppFrame type="terminal" :title="`log_${log.id.slice(-6)}.json`" class="h-full min-h-[400px] !bg-black" bodyClass="!bg-black">
    <template #headerActions>
      <div class="flex items-center gap-4">
        <!-- Download Button -->
        <button @click="downloadJson"
          class="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase hover:text-white transition-colors text-slate-400">
          <IconDownload class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Télécharger</span>
        </button>

        <!-- Copy Button -->
        <button @click="copyJson"
          class="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase hover:text-white transition-colors"
          :class="copied ? 'text-success' : 'text-slate-400'">
          <IconCopy v-if="!copied" class="w-3.5 h-3.5" />
          <IconCheck v-else class="w-3.5 h-3.5 font-bold" />
          <span class="hidden sm:inline">{{ copied ? 'Copié' : 'Copier' }}</span>
        </button>
      </div>
    </template>
    <pre class="whitespace-pre-wrap break-all text-[11px] md:text-xs leading-relaxed overflow-x-auto p-4 md:p-6"
      v-html="highlightedJson"></pre>
  </UiAppFrame>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IconCopy, IconCheck, IconDownload } from '@tabler/icons-vue'
import { useToastStore } from '~/stores/front/toast'

const props = defineProps<{
  log: any
}>()

const toast = useToastStore()
const copied = ref(false)

const formattedJson = computed(() => {
  if (!props.log) return ''
  return JSON.stringify(props.log, null, 2)
})

const highlightedJson = computed(() => {
  const json = formattedJson.value
  if (!json) return ''
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'text-blue-300' // number
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-purple-300 font-medium' // key
      } else {
        cls = 'text-green-300' // string
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-yellow-300 font-bold' // boolean
    } else if (/null/.test(match)) {
      cls = 'text-red-300 font-bold' // null
    }
    return '<span class="' + cls + '">' + match + '</span>'
  })
})

const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
    toast.showToast('success', 'JSON Copié', 'Les détails du log ont été copiés.')
  } catch (err) {
    toast.showToast('error', 'Erreur', 'Impossible de copier les détails.')
  }
}

const downloadJson = () => {
  if (!props.log) return
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(formattedJson.value)
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `log_${props.log.id}.json`)
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    toast.showToast('success', 'Téléchargement réussi', 'Le fichier JSON a été téléchargé.')
  } catch(err) {
    toast.showToast('error', 'Erreur', 'Impossible de télécharger le fichier.')
  }
}
</script>
