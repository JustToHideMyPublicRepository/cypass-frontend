import { ref, computed } from 'vue'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { useProfilStore } from '~/stores/back/user/profil'
import { useAuthStore } from '~/stores/back/user/auth'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { getCalendarFilterConfig } from '~/utils/calendar'
import { getLogActionInfo } from '~/utils/logs'

export type EventType = 'docsentry' | 'vigitech' | 'comment' | 'log' | 'session'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string
  type: EventType
  color: string
  bgColor: string
  url?: string
}

export const useCalendarEvents = () => {
  const userDocsentryStore = useUserDocsentryStore()
  const vigitechStore = useUserVigitechStore()
  const profilStore = useProfilStore()
  const authStore = useAuthStore()

  const loading = ref(false)
  const sessions = ref<any[]>([])

  // Fetch all necessary data
  const fetchAllEvents = async (date?: string) => {
    loading.value = true
    try {
      const logParams: any = { limit: 1000, type: 'all' }

      if (date) {
        logParams.date = date
        if (date.length === 7) { // YYYY-MM
          const [year, month] = date.split('-')
          logParams.month = month
          logParams.year = year
          const d = new Date(date + '-01')
          const s = format(startOfMonth(d), 'yyyy-MM-dd')
          const e = format(endOfMonth(d), 'yyyy-MM-dd')
          // Add all possible range parameter names
          logParams.date_start = s
          logParams.date_end = e
          logParams.startDate = s
          logParams.endDate = e
          logParams.from_date = s
          logParams.to_date = e
        }
      }

      // Parallelize fetching
      const requests: any[] = [
        userDocsentryStore.fetchDocuments(100, 0),
        vigitechStore.fetchUserIncidents(),
        vigitechStore.fetchUserComments(),
      ]

      if (date && date.length === 10) {
        // Daily view: just fetch that day
        requests.push(profilStore.getUserLogs({ limit: 1000, type: 'all', date: date }))
      } else {
        // Month view: Fetch the last 30 days individually and merge (since backend is day-only)
        const daysToFetch: string[] = []
        const today = new Date()
        for (let i = 0; i < 30; i++) {
          const d = new Date(today.getTime() - i * 86400000)
          daysToFetch.push(format(d, 'yyyy-MM-dd'))
        }
        requests.push(profilStore.getUserLogsRange(daysToFetch, 1000))
      }

      await Promise.all(requests)
      // Sessions don't have a state, we fetch and store locally
      sessions.value = await profilStore.sessionsGet()
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
    if (userDocsentryStore.documents) {
      userDocsentryStore.documents.forEach(doc => {
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

        const logInfo = getLogActionInfo(log.action)
        const label = (log.action_label && log.action_label !== log.action) ? log.action_label : logInfo.label

        events.push({
          id: `log-${log.id}`,
          title: label,
          description: `Action enregistrée depuis ${log.ip_address}`,
          date: ts,
          type: 'log',
          color: getCalendarFilterConfig('log')?.classes.text || logInfo.color,
          bgColor: getCalendarFilterConfig('log')?.classes.bgLight || 'bg-hsa/10',
          url: `/dashboard/logs?date=${format(new Date(ts), 'yyyy-MM-dd')}`
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
