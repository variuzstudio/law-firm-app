'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'id'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Login
    'login.title': 'LexSupport',
    'login.subtitle': 'Intelligent Legal Workspace',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot password?',
    'login.button': 'Sign In',
    'login.noAccount': "Don't have an account?",
    'login.register': 'Register',

    // Sidebar
    'nav.dashboard': 'Dashboard',
    'nav.cases': 'Cases',
    'nav.clients': 'Clients',
    'nav.documents': 'Documents',
    'nav.calendar': 'Calendar',
    'nav.billing': 'Billing',
    'nav.settings': 'Settings',
    'nav.logout': 'Sign Out',

    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.overview': 'Here\'s your practice overview for today',
    'dashboard.activeCases': 'Active Cases',
    'dashboard.totalClients': 'Total Clients',
    'dashboard.pendingTasks': 'Pending Tasks',
    'dashboard.revenue': 'Monthly Revenue',
    'dashboard.recentCases': 'Recent Cases',
    'dashboard.upcomingEvents': 'Upcoming Events',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.caseDistribution': 'Case Distribution',
    'dashboard.viewAll': 'View All',
    'dashboard.monthlyRevenue': 'Monthly Revenue',

    // Cases
    'cases.title': 'Case Management',
    'cases.subtitle': 'Manage and track all your legal cases',
    'cases.new': 'New Case',
    'cases.search': 'Search cases...',
    'cases.filter': 'Filter',
    'cases.caseNumber': 'Case No.',
    'cases.caseName': 'Case Name',
    'cases.client': 'Client',
    'cases.type': 'Type',
    'cases.status': 'Status',
    'cases.priority': 'Priority',
    'cases.assignee': 'Assignee',
    'cases.date': 'Date',
    'cases.actions': 'Actions',
    'cases.active': 'Active',
    'cases.pending': 'Pending',
    'cases.closed': 'Closed',
    'cases.review': 'In Review',
    'cases.high': 'High',
    'cases.medium': 'Medium',
    'cases.low': 'Low',
    'cases.view': 'View',
    'cases.edit': 'Edit',
    'cases.delete': 'Delete',
    'cases.all': 'All Cases',
    'cases.details': 'Case Details',
    'cases.description': 'Description',
    'cases.notes': 'Notes',
    'cases.timeline': 'Timeline',
    'cases.addNote': 'Add Note',
    'cases.save': 'Save',
    'cases.cancel': 'Cancel',
    'cases.close': 'Close',

    // Clients
    'clients.title': 'Client Management',
    'clients.subtitle': 'Manage your client relationships',
    'clients.new': 'New Client',
    'clients.search': 'Search clients...',
    'clients.name': 'Name',
    'clients.email': 'Email',
    'clients.phone': 'Phone',
    'clients.company': 'Company',
    'clients.cases': 'Cases',
    'clients.status': 'Status',
    'clients.joined': 'Joined',
    'clients.active': 'Active',
    'clients.inactive': 'Inactive',

    // Documents
    'docs.title': 'Document Management',
    'docs.subtitle': 'Store and manage all legal documents',
    'docs.upload': 'Upload Document',
    'docs.search': 'Search documents...',
    'docs.name': 'Document Name',
    'docs.type': 'Type',
    'docs.case': 'Related Case',
    'docs.size': 'Size',
    'docs.modified': 'Last Modified',
    'docs.download': 'Download',
    'docs.preview': 'Preview',
    'docs.contract': 'Contract',
    'docs.pleading': 'Pleading',
    'docs.correspondence': 'Correspondence',
    'docs.evidence': 'Evidence',
    'docs.memo': 'Memo',

    // Calendar
    'calendar.title': 'Calendar',
    'calendar.subtitle': 'Schedule and manage appointments',
    'calendar.newEvent': 'New Event',
    'calendar.today': 'Today',
    'calendar.month': 'Month',
    'calendar.week': 'Week',
    'calendar.day': 'Day',
    'calendar.hearing': 'Hearing',
    'calendar.meeting': 'Meeting',
    'calendar.deadline': 'Deadline',
    'calendar.consultation': 'Consultation',
    'calendar.upcoming': 'Upcoming Events',

    // Billing
    'billing.title': 'Billing & Invoicing',
    'billing.subtitle': 'Manage invoices and payments',
    'billing.newInvoice': 'New Invoice',
    'billing.search': 'Search invoices...',
    'billing.invoiceNo': 'Invoice No.',
    'billing.client': 'Client',
    'billing.amount': 'Amount',
    'billing.status': 'Status',
    'billing.dueDate': 'Due Date',
    'billing.paid': 'Paid',
    'billing.unpaid': 'Unpaid',
    'billing.overdue': 'Overdue',
    'billing.partial': 'Partial',
    'billing.totalRevenue': 'Total Revenue',
    'billing.outstanding': 'Outstanding',
    'billing.collected': 'Collected',
    'billing.overdueAmount': 'Overdue Amount',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your account and preferences',
    'settings.profile': 'Profile',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',
    'settings.fullName': 'Full Name',
    'settings.email': 'Email',
    'settings.role': 'Role',
    'settings.firm': 'Firm Name',
    'settings.save': 'Save Changes',
    'settings.emailNotif': 'Email Notifications',
    'settings.pushNotif': 'Push Notifications',
    'settings.caseUpdates': 'Case Updates',
    'settings.deadlineReminders': 'Deadline Reminders',
    'settings.newMessages': 'New Messages',
    'settings.changePassword': 'Change Password',
    'settings.currentPassword': 'Current Password',
    'settings.newPassword': 'New Password',
    'settings.confirmPassword': 'Confirm Password',
    'settings.twoFactor': 'Two-Factor Authentication',
    'settings.twoFactorDesc': 'Add an extra layer of security to your account',
    'settings.enable': 'Enable',
    'settings.disable': 'Disable',

    // Common
    'common.search': 'Search',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.loading': 'Loading...',
    'common.noData': 'No data available',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.actions': 'Actions',
    'common.showing': 'Showing',
    'common.of': 'of',
    'common.entries': 'entries',
  },
  id: {
    // Login
    'login.title': 'LexSupport',
    'login.subtitle': 'Ruang Kerja Hukum Cerdas',
    'login.email': 'Alamat Email',
    'login.password': 'Kata Sandi',
    'login.remember': 'Ingat saya',
    'login.forgot': 'Lupa kata sandi?',
    'login.button': 'Masuk Sistem',
    'login.noAccount': 'Belum punya akun?',
    'login.register': 'Daftar',

    // Sidebar
    'nav.dashboard': 'Dasbor',
    'nav.cases': 'Perkara',
    'nav.clients': 'Klien',
    'nav.documents': 'Dokumen',
    'nav.calendar': 'Kalender',
    'nav.billing': 'Tagihan',
    'nav.settings': 'Pengaturan',
    'nav.logout': 'Keluar',

    // Dashboard
    'dashboard.welcome': 'Selamat datang kembali',
    'dashboard.overview': 'Berikut ringkasan praktik Anda hari ini',
    'dashboard.activeCases': 'Perkara Aktif',
    'dashboard.totalClients': 'Total Klien',
    'dashboard.pendingTasks': 'Tugas Tertunda',
    'dashboard.revenue': 'Pendapatan Bulanan',
    'dashboard.recentCases': 'Perkara Terbaru',
    'dashboard.upcomingEvents': 'Jadwal Mendatang',
    'dashboard.recentActivity': 'Aktivitas Terbaru',
    'dashboard.caseDistribution': 'Distribusi Perkara',
    'dashboard.viewAll': 'Lihat Semua',
    'dashboard.monthlyRevenue': 'Pendapatan Bulanan',

    // Cases
    'cases.title': 'Manajemen Perkara',
    'cases.subtitle': 'Kelola dan lacak semua perkara hukum',
    'cases.new': 'Perkara Baru',
    'cases.search': 'Cari perkara...',
    'cases.filter': 'Filter',
    'cases.caseNumber': 'No. Perkara',
    'cases.caseName': 'Nama Perkara',
    'cases.client': 'Klien',
    'cases.type': 'Tipe',
    'cases.status': 'Status',
    'cases.priority': 'Prioritas',
    'cases.assignee': 'Penanggung Jawab',
    'cases.date': 'Tanggal',
    'cases.actions': 'Aksi',
    'cases.active': 'Aktif',
    'cases.pending': 'Tertunda',
    'cases.closed': 'Ditutup',
    'cases.review': 'Dalam Peninjauan',
    'cases.high': 'Tinggi',
    'cases.medium': 'Sedang',
    'cases.low': 'Rendah',
    'cases.view': 'Lihat',
    'cases.edit': 'Ubah',
    'cases.delete': 'Hapus',
    'cases.all': 'Semua Perkara',
    'cases.details': 'Detail Perkara',
    'cases.description': 'Deskripsi',
    'cases.notes': 'Catatan',
    'cases.timeline': 'Linimasa',
    'cases.addNote': 'Tambah Catatan',
    'cases.save': 'Simpan',
    'cases.cancel': 'Batal',
    'cases.close': 'Tutup',

    // Clients
    'clients.title': 'Manajemen Klien',
    'clients.subtitle': 'Kelola hubungan klien Anda',
    'clients.new': 'Klien Baru',
    'clients.search': 'Cari klien...',
    'clients.name': 'Nama',
    'clients.email': 'Email',
    'clients.phone': 'Telepon',
    'clients.company': 'Perusahaan',
    'clients.cases': 'Perkara',
    'clients.status': 'Status',
    'clients.joined': 'Bergabung',
    'clients.active': 'Aktif',
    'clients.inactive': 'Tidak Aktif',

    // Documents
    'docs.title': 'Manajemen Dokumen',
    'docs.subtitle': 'Simpan dan kelola semua dokumen hukum',
    'docs.upload': 'Unggah Dokumen',
    'docs.search': 'Cari dokumen...',
    'docs.name': 'Nama Dokumen',
    'docs.type': 'Tipe',
    'docs.case': 'Perkara Terkait',
    'docs.size': 'Ukuran',
    'docs.modified': 'Terakhir Diubah',
    'docs.download': 'Unduh',
    'docs.preview': 'Pratinjau',
    'docs.contract': 'Kontrak',
    'docs.pleading': 'Pembelaan',
    'docs.correspondence': 'Korespondensi',
    'docs.evidence': 'Bukti',
    'docs.memo': 'Memo',

    // Calendar
    'calendar.title': 'Kalender',
    'calendar.subtitle': 'Jadwalkan dan kelola pertemuan',
    'calendar.newEvent': 'Acara Baru',
    'calendar.today': 'Hari Ini',
    'calendar.month': 'Bulan',
    'calendar.week': 'Minggu',
    'calendar.day': 'Hari',
    'calendar.hearing': 'Sidang',
    'calendar.meeting': 'Rapat',
    'calendar.deadline': 'Tenggat',
    'calendar.consultation': 'Konsultasi',
    'calendar.upcoming': 'Jadwal Mendatang',

    // Billing
    'billing.title': 'Tagihan & Faktur',
    'billing.subtitle': 'Kelola faktur dan pembayaran',
    'billing.newInvoice': 'Faktur Baru',
    'billing.search': 'Cari faktur...',
    'billing.invoiceNo': 'No. Faktur',
    'billing.client': 'Klien',
    'billing.amount': 'Jumlah',
    'billing.status': 'Status',
    'billing.dueDate': 'Jatuh Tempo',
    'billing.paid': 'Lunas',
    'billing.unpaid': 'Belum Bayar',
    'billing.overdue': 'Terlambat',
    'billing.partial': 'Sebagian',
    'billing.totalRevenue': 'Total Pendapatan',
    'billing.outstanding': 'Belum Terbayar',
    'billing.collected': 'Terkumpul',
    'billing.overdueAmount': 'Jumlah Terlambat',

    // Settings
    'settings.title': 'Pengaturan',
    'settings.subtitle': 'Kelola akun dan preferensi Anda',
    'settings.profile': 'Profil',
    'settings.appearance': 'Tampilan',
    'settings.notifications': 'Notifikasi',
    'settings.security': 'Keamanan',
    'settings.language': 'Bahasa',
    'settings.theme': 'Tema',
    'settings.light': 'Terang',
    'settings.dark': 'Gelap',
    'settings.system': 'Sistem',
    'settings.fullName': 'Nama Lengkap',
    'settings.email': 'Email',
    'settings.role': 'Jabatan',
    'settings.firm': 'Nama Firma',
    'settings.save': 'Simpan Perubahan',
    'settings.emailNotif': 'Notifikasi Email',
    'settings.pushNotif': 'Notifikasi Push',
    'settings.caseUpdates': 'Pembaruan Perkara',
    'settings.deadlineReminders': 'Pengingat Tenggat',
    'settings.newMessages': 'Pesan Baru',
    'settings.changePassword': 'Ubah Kata Sandi',
    'settings.currentPassword': 'Kata Sandi Saat Ini',
    'settings.newPassword': 'Kata Sandi Baru',
    'settings.confirmPassword': 'Konfirmasi Kata Sandi',
    'settings.twoFactor': 'Autentikasi Dua Faktor',
    'settings.twoFactorDesc': 'Tambahkan lapisan keamanan ekstra ke akun Anda',
    'settings.enable': 'Aktifkan',
    'settings.disable': 'Nonaktifkan',

    // Common
    'common.search': 'Cari',
    'common.add': 'Tambah',
    'common.edit': 'Ubah',
    'common.delete': 'Hapus',
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.close': 'Tutup',
    'common.back': 'Kembali',
    'common.next': 'Selanjutnya',
    'common.previous': 'Sebelumnya',
    'common.loading': 'Memuat...',
    'common.noData': 'Tidak ada data',
    'common.confirm': 'Konfirmasi',
    'common.yes': 'Ya',
    'common.no': 'Tidak',
    'common.actions': 'Aksi',
    'common.showing': 'Menampilkan',
    'common.of': 'dari',
    'common.entries': 'entri',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id')

  useEffect(() => {
    const saved = localStorage.getItem('lexsupport-language') as Language
    if (saved && (saved === 'en' || saved === 'id')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('lexsupport-language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
