import { ref, computed } from 'vue'
import { useDocsentryStore } from '~/stores/docsentry'
import { useVigitechStore } from '~/stores/vigitech'
import { useProfilStore } from '~/stores/profil'
import { useAuthStore } from '~/stores/auth'
import { format } from 'date-fns'
import { getCalendarFilterConfig } from '~/utils/calendar'

export type EventType = 'docsentry' | 'vigitech' | 'comment' | 'log' | 'session'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string // ISO date string
  type: EventType
  color: string // Tailwind color class (e.g., 'text-primary')
  bgColor: string // Tailwind bg class (e.g., 'bg-primary/10')
  url?: string
}

export const useCalendarEvents = () => {
  const docsentryStore = useDocsentryStore()
  const vigitechStore = useVigitechStore()
  const profilStore = useProfilStore()
  const authStore = useAuthStore()

  const loading = ref(false)
  const sessions = ref<any[]>([])

  // Fetch all necessary data
  const fetchAllEvents = async (date?: string) => {
    loading.value = true
    try {
      // Parallelize fetching
      await Promise.all([
        docsentryStore.fetchDocuments(100, 0),
        vigitechStore.fetchUserIncidents(),
        vigitechStore.fetchUserComments(),
        profilStore.fetchLogs({ limit: 500, type: 'all', date: date }),
      ])
      // Sessions don't have a state, we fetch and store locally
      sessions.value = await authStore.fetchSessions()
    } catch (error) {
      console.error('Error fetching calendar events:', error)
    } finally {
      loading.value = false
    }
  }

  // Aggregate all events
  const allEvents = computed<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = []

    // 1. Docsentry Documents
    if (docsentryStore.documents) {
      docsentryStore.documents.forEach(doc => {
        events.push({
          id: `doc-${doc.id}`,
          title: doc.filename,
          description: `Document ${doc.file_type.toUpperCase()}`,
          date: doc.created_at,
          type: 'docsentry',
          color: getCalendarFilterConfig('docsentry')?.classes.text || 'text-primary',
          bgColor: getCalendarFilterConfig('docsentry')?.classes.bgLight || 'bg-primary/10',
          url: '/dashboard/docsentry'
        })
      })
    }

    // 2. Vigitech Incidents
    if (vigitechStore.userIncidents) {
      vigitechStore.userIncidents.forEach(inc => {
        events.push({
          id: `inc-${inc.id}`,
          title: inc.title,
          description: `Incident de niveau ${inc.threat_level}`,
          date: inc.created_at,
          type: 'vigitech',
          color: getCalendarFilterConfig('vigitech')?.classes.text || 'text-danger',
          bgColor: getCalendarFilterConfig('vigitech')?.classes.bgLight || 'bg-danger/10',
          url: `/dashboard/vigitech/${inc.id}`
        })
      })
    }

    // 3. Vigitech Comments
    if (vigitechStore.userComments) {
      vigitechStore.userComments.forEach(comment => {
        events.push({
          id: `com-${comment.id}`,
          title: 'Nouveau commentaire',
          description: comment.content.substring(0, 50) + (comment.content.length > 50 ? '...' : ''),
          date: comment.created_at,
          type: 'comment',
          color: getCalendarFilterConfig('comment')?.classes.text || 'text-warning',
          bgColor: getCalendarFilterConfig('comment')?.classes.bgLight || 'bg-warning/10',
          url: `/dashboard/vigitech/comments`
        })
      })
    }

    // 4. Logs
    if (profilStore.logs) {
      profilStore.logs.forEach(log => {
        // Skip some very noisy logs if needed, or keep them all.
        // We'll keep them all for the calendar, but maybe filter out minor ones later.
        let ts = log.timestamp
        if (ts && !ts.includes('T')) ts = ts.replace(' ', 'T')

        events.push({
          id: `log-${log.id}`,
          title: log.action_label || log.action,
          description: `Action enregistrée depuis ${log.ip_address}`,
          date: ts,
          type: 'log',
          color: getCalendarFilterConfig('log')?.classes.text || 'text-hsa',
          bgColor: getCalendarFilterConfig('log')?.classes.bgLight || 'bg-hsa/10',
          url: '/dashboard/logs'
        })
      })
    }

    // 5. Sessions
    if (sessions.value) {
      sessions.value.forEach(sess => {
        const dateStr = sess.created_at || sess.last_active_at || new Date().toISOString()
        events.push({
          id: `sess-${sess.id || Math.random()}`,
          title: sess.is_current ? 'Session actuelle connectée' : 'Nouvelle session connectée',
          description: `${sess.browser || 'Navigateur inconnu'} sur ${sess.os || 'OS inconnu'}`,
          date: dateStr,
          type: 'session',
          color: getCalendarFilterConfig('session')?.classes.text || 'text-success',
          bgColor: getCalendarFilterConfig('session')?.classes.bgLight || 'bg-success/10',
          url: '/dashboard/sessions'
        })
      })
    }

    // Sort descending
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  // Group events by YYYY-MM-DD
  const eventsByDate = computed<Record<string, CalendarEvent[]>>(() => {
    const groups: Record<string, CalendarEvent[]> = {}
    allEvents.value.forEach(event => {
      try {
        const d = new Date(event.date)
        if (isNaN(d.getTime())) return
        const dateKey = format(d, 'yyyy-MM-dd')
        if (!groups[dateKey]) {
          groups[dateKey] = []
        }
        groups[dateKey].push(event)
      } catch (e) {
        // invalid date
      }
    })
    return groups
  })

  // Filter implementation
  const filterTypes = ref<EventType[]>(['docsentry', 'vigitech', 'comment', 'log', 'session'])

  const toggleFilter = (type: EventType) => {
    if (filterTypes.value.includes(type)) {
      filterTypes.value = filterTypes.value.filter(t => t !== type)
    } else {
      filterTypes.value.push(type)
    }
  }

  const filteredEventsByDate = computed<Record<string, CalendarEvent[]>>(() => {
    const groups: Record<string, CalendarEvent[]> = {}
    Object.keys(eventsByDate.value).forEach(dateStr => {
      const filtered = eventsByDate.value[dateStr].filter(e => filterTypes.value.includes(e.type))
      if (filtered.length > 0) {
        groups[dateStr] = filtered
      }
    })
    return groups
  })

  return {
    loading,
    allEvents,
    eventsByDate,
    filteredEventsByDate,
    filterTypes,
    fetchAllEvents,
    toggleFilter
  }
}
