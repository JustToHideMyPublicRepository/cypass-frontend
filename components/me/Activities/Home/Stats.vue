<template>
  <div class="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    <!-- Total Logs -->
    <UiBaseCard class="bg-ash/5 border-l-4 border-l-ashAct">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-ash rounded-xl shadow-sm border border-ashAct">
          <IconActivity class="w-5 h-5 text-primary" />
        </div>
        <div>
          <p class="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-hsa opacity-60 line-clamp-1">{{
            getDynamicTitle() }}</p>
          <p class="text-xl font-bold text-BtW leading-tight">{{ stats?.total_logs ?? 0 }}</p>
        </div>
      </div>
    </UiBaseCard>

    <!-- Success Logins -->
    <UiBaseCard class="bg-success/5 border-l-4 border-l-success">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-ash rounded-xl shadow-sm border border-ashAct">
          <IconCircleCheck class="w-5 h-5 text-success" />
        </div>
        <div>
          <p class="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-hsa opacity-60">Connexions</p>
          <p class="text-xl font-bold text-BtW leading-tight">
            {{ stats?.by_type?.['USER_LOGIN'] || stats?.by_type?.['Connexion réussie'] || 0 }}
          </p>
        </div>
      </div>
    </UiBaseCard>

    <!-- Total Errors -->
    <UiBaseCard class="bg-danger/5 border-l-4 border-l-danger">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-ash rounded-xl shadow-sm border border-ashAct">
          <IconAlertCircle class="w-5 h-5 text-danger" />
        </div>
        <div>
          <p class="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-hsa opacity-60">Échecs</p>
          <p class="text-xl font-bold text-BtW leading-tight">{{ totalErrors }}</p>
        </div>
      </div>
    </UiBaseCard>

    <!-- Document Actions -->
    <UiBaseCard class="bg-primary/5 border-l-4 border-l-primary">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-ash rounded-xl shadow-sm border border-ashAct">
          <IconFileUpload class="w-5 h-5 text-primary" />
        </div>
        <div>
          <p class="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-hsa opacity-60">Documents</p>
          <p class="text-xl font-bold text-BtW leading-tight">{{ totalDocuments }}</p>
        </div>
      </div>
    </UiBaseCard>

    <!-- Security Actions -->
    <UiBaseCard class="bg-warning/5 border-l-4 border-l-warning">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-ash rounded-xl shadow-sm border border-ashAct">
          <IconShieldLock class="w-5 h-5 text-warning" />
        </div>
        <div>
          <p class="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-hsa opacity-60">Sécurité</p>
          <p class="text-xl font-bold text-BtW leading-tight">{{ totalSecurity }}</p>
        </div>
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconActivity, IconCircleCheck, IconAlertCircle,
  IconFileUpload, IconShieldLock
} from '@tabler/icons-vue'
import { format, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'

const ERROR_ACTIONS = [
  'FAILED_PASSWORD_CHANGE', 'FAILED_EMAIL_CHANGE', 'FAILED_DELETE_AUTH',
  'LOGIN_FAILED', 'INVALID_TOKEN', 'UNAUTHORIZED_ACCESS', 'SUSPICIOUS_ACTIVITY',
  'FAILED_MFA_TOGGLE', 'DOCUMENT_UPLOAD_FAILED', 'MULTI_VERSION_UPLOAD_FAILED',
  'PAYMENT_FAILED', 'Tentative de connexion échouée'
]

const DOCUMENT_ACTIONS = [
  'DOCUMENT_UPLOADED', 'DOCUMENT_DOWNLOADED', 'DOCUMENT_AUTHENTICATED',
  'DOCUMENT_DELETED', 'MULTI_VERSION_UPLOAD_SUCCESS', 'Authentification de document',
  'Téléchargement de document'
]

const SECURITY_ACTIONS = [
  'PASSWORD_CHANGED', 'EMAIL_CHANGED', 'MFA_ENABLED', 'MFA_DISABLED',
  'MFA_TEMP_DISABLED', 'MFA_VERIFIED', 'ALL_TOKENS_REVOKED',
  'ALL_SESSIONS_REVOKED', 'SESSION_REVOKED', 'Modification du mot de passe',
  'Activation de la MFA'
]

const props = defineProps<{
  stats: any
  filters?: any
}>()

const sumByActions = (actions: string[]) => {
  if (!props.stats?.by_type) return 0
  return actions.reduce((sum, action) => sum + (props.stats.by_type[action] || 0), 0)
}

const totalErrors = computed(() => sumByActions(ERROR_ACTIONS))
const totalDocuments = computed(() => sumByActions(DOCUMENT_ACTIONS))
const totalSecurity = computed(() => sumByActions(SECURITY_ACTIONS))

const getDynamicTitle = () => {
  if (!props.filters) return "Total aujourd'hui"

  if (props.filters.usePeriod) {
    return 'Total sur la période'
  }

  if (props.filters.date) {
    try {
      const date = new Date(props.filters.date)
      if (isNaN(date.getTime())) return "Total"
      if (isSameDay(date, new Date())) {
        return "Total aujourd'hui"
      }
      return "Total du " + format(date, 'd MMM yyyy', { locale: fr })
    } catch (e) {
      return "Total"
    }
  }

  return "Total"
}
</script>
