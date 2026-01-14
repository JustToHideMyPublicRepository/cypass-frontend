
import { defineStore } from 'pinia'

export const useCypassData = defineStore('cypassData', () => {
    interface User {
        id: number;
        name: string;
        email: string;
        role: string;
        avatar: string;
    }

    // --- Mock Users ---
    const users = ref<User[]>([
        {
            id: 1,
            name: "Administrateur CYPASS",
            email: "admin@cypass.bj",
            role: "admin",
            avatar: "https://i.pravatar.cc/150?u=admin",
        },
        {
            id: 2,
            name: "Jean Dupont",
            email: "jean.dupont@gouv.bj",
            role: "user",
            avatar: "https://i.pravatar.cc/150?u=jean",
        }
    ])

    const currentUser = ref<User | null>(null)

    const login = (email: string, password: string) => {
        // Correct simulation
        const user = users.value.find(u => u.email === email)
        if (user) {
            currentUser.value = user
            return true
        }
        return false
    }

    const logout = () => {
        currentUser.value = null
    }

    // --- Mock Documents (DocSentry) ---
    const documents = ref([
        {
            id: "doc-001",
            name: "Rapport_Audit_2023.pdf",
            date: "2023-11-15",
            hash: "e3b0c44298fc1c149afbf4c8996fb924",
            status: "Verified",
        },
        {
            id: "doc-002",
            name: "Contrat_Ministere.docx",
            date: "2023-11-20",
            hash: "8d969eef6ecad3c29a3a629280e686cf",
            status: "Pending",
        },
        {
            id: "doc-003",
            name: "Facture_Octobre.pdf",
            date: "2023-10-30",
            hash: "c5e3d48dc297593293e6293967839393",
            status: "Rejected",
        }
    ])

    // --- Mock Alerts (VigiTech) ---
    const alerts = ref([
        {
            id: 1,
            title: "Tentative d'intrusion SSH détectée",
            severity: "High",
            timestamp: "2023-11-21T08:30:00",
            description: "Multiple failed login attempts from IP 192.168.1.50"
        },
        {
            id: 2,
            title: "Mise à jour critique disponible",
            severity: "Medium",
            timestamp: "2023-11-20T14:15:00",
            description: "Nouvelle version du kernel Linux requise."
        },
        {
            id: 3,
            title: "Scan de ports suspect",
            severity: "Low",
            timestamp: "2023-11-19T09:00:00",
            description: "Activité inhabituelle sur le port 8080."
        }
    ])

    // --- Mock Vulnerabilities (SecuScan) ---
    const vulnerabilities = ref([
        {
            id: 1,
            url: "https://api.gouv.bj",
            type: "XSS Reflected",
            severity: "High",
            status: "Open"
        },
        {
            id: 2,
            url: "https://cypass.bj/login",
            type: "Weak Password Policy",
            severity: "Medium",
            status: "Fixed"
        }
    ])

    return {
        users,
        currentUser,
        login,
        logout,
        documents,
        alerts,
        vulnerabilities
    }
})
