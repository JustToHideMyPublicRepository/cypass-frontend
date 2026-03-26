export interface SystemComponent {
  name: string
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_incident'
}

export interface SystemIncident {
  id: string
  date: string
  title: string
  description: string
  type: string
  status: string
}
