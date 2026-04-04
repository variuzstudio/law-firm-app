export const cases = [
  { id: 'CSE-2026-001', name: 'PT Maju Jaya vs PT Sentosa', client: 'PT Maju Jaya', type: 'Corporate', status: 'active', priority: 'high', assignee: 'Ahmad Faisal', date: '2026-03-15', description: 'Corporate dispute regarding breach of contract in supply agreement.' },
  { id: 'CSE-2026-002', name: 'Pembagian Warisan Keluarga Santoso', client: 'Budi Santoso', type: 'Family', status: 'active', priority: 'medium', assignee: 'Siti Rahayu', date: '2026-03-10', description: 'Inheritance distribution case involving multiple beneficiaries.' },
  { id: 'CSE-2026-003', name: 'Sengketa Tanah Jl. Sudirman', client: 'CV Bersama', type: 'Property', status: 'pending', priority: 'high', assignee: 'Ahmad Faisal', date: '2026-03-08', description: 'Land dispute over commercial property ownership.' },
  { id: 'CSE-2026-004', name: 'Perceraian Hendra & Maya', client: 'Hendra Wijaya', type: 'Family', status: 'review', priority: 'medium', assignee: 'Dewi Putri', date: '2026-03-05', description: 'Divorce proceedings with custody arrangement.' },
  { id: 'CSE-2026-005', name: 'Gugatan PHK PT Teknologi', client: 'Rizki Pratama', type: 'Labor', status: 'active', priority: 'high', assignee: 'Siti Rahayu', date: '2026-02-28', description: 'Wrongful termination lawsuit against tech company.' },
  { id: 'CSE-2026-006', name: 'Akuisisi PT Digital Nusantara', client: 'PT Global Invest', type: 'Corporate', status: 'active', priority: 'high', assignee: 'Ahmad Faisal', date: '2026-02-25', description: 'Due diligence and legal advisory for acquisition.' },
  { id: 'CSE-2026-007', name: 'Sengketa Merek Dagang INDOTECH', client: 'PT Indotech', type: 'IP', status: 'pending', priority: 'medium', assignee: 'Dewi Putri', date: '2026-02-20', description: 'Trademark infringement dispute.' },
  { id: 'CSE-2026-008', name: 'Kontrak Kerjasama Internasional', client: 'PT Export Indo', type: 'Corporate', status: 'closed', priority: 'low', assignee: 'Ahmad Faisal', date: '2026-02-15', description: 'International cooperation agreement review and drafting.' },
  { id: 'CSE-2026-009', name: 'Pelanggaran Hak Cipta Software', client: 'Andi Nugroho', type: 'IP', status: 'review', priority: 'medium', assignee: 'Siti Rahayu', date: '2026-02-10', description: 'Software copyright infringement case.' },
  { id: 'CSE-2026-010', name: 'Restrukturisasi Hutang PT Makmur', client: 'PT Makmur Sentosa', type: 'Corporate', status: 'active', priority: 'high', assignee: 'Ahmad Faisal', date: '2026-02-05', description: 'Debt restructuring and negotiation with creditors.' },
]

export const clients = [
  { id: 1, name: 'PT Maju Jaya', email: 'legal@majujaya.co.id', phone: '+62 21 5551234', company: 'PT Maju Jaya', cases: 3, status: 'active', joined: '2024-06-15', type: 'Corporate' },
  { id: 2, name: 'Budi Santoso', email: 'budi.santoso@gmail.com', phone: '+62 812 3456789', company: '-', cases: 1, status: 'active', joined: '2025-01-20', type: 'Individual' },
  { id: 3, name: 'CV Bersama', email: 'info@cvbersama.com', phone: '+62 21 5559876', company: 'CV Bersama', cases: 2, status: 'active', joined: '2024-09-10', type: 'Corporate' },
  { id: 4, name: 'Hendra Wijaya', email: 'hendra.w@outlook.com', phone: '+62 813 9876543', company: '-', cases: 1, status: 'active', joined: '2025-11-05', type: 'Individual' },
  { id: 5, name: 'Rizki Pratama', email: 'rizki.p@yahoo.com', phone: '+62 856 1234567', company: '-', cases: 1, status: 'active', joined: '2026-01-12', type: 'Individual' },
  { id: 6, name: 'PT Global Invest', email: 'legal@globalinvest.co.id', phone: '+62 21 5554321', company: 'PT Global Invest', cases: 2, status: 'active', joined: '2024-03-22', type: 'Corporate' },
  { id: 7, name: 'PT Indotech', email: 'contact@indotech.id', phone: '+62 21 5556789', company: 'PT Indotech', cases: 1, status: 'active', joined: '2025-07-18', type: 'Corporate' },
  { id: 8, name: 'PT Export Indo', email: 'legal@exportindo.com', phone: '+62 21 5558765', company: 'PT Export Indo', cases: 1, status: 'inactive', joined: '2024-11-30', type: 'Corporate' },
  { id: 9, name: 'Andi Nugroho', email: 'andi.n@gmail.com', phone: '+62 878 9012345', company: '-', cases: 1, status: 'active', joined: '2025-12-08', type: 'Individual' },
  { id: 10, name: 'PT Makmur Sentosa', email: 'legal@makmur.co.id', phone: '+62 21 5552468', company: 'PT Makmur Sentosa', cases: 1, status: 'active', joined: '2025-08-14', type: 'Corporate' },
]

export const documents = [
  { id: 1, name: 'Surat Kuasa - PT Maju Jaya', type: 'contract', case: 'CSE-2026-001', size: '2.4 MB', modified: '2026-03-25', author: 'Ahmad Faisal' },
  { id: 2, name: 'Gugatan - Sengketa Tanah Sudirman', type: 'pleading', case: 'CSE-2026-003', size: '5.1 MB', modified: '2026-03-24', author: 'Ahmad Faisal' },
  { id: 3, name: 'Perjanjian Kerjasama Internasional', type: 'contract', case: 'CSE-2026-008', size: '3.8 MB', modified: '2026-03-23', author: 'Ahmad Faisal' },
  { id: 4, name: 'Bukti Transaksi - PT Makmur', type: 'evidence', case: 'CSE-2026-010', size: '1.2 MB', modified: '2026-03-22', author: 'Siti Rahayu' },
  { id: 5, name: 'Memo Internal - Strategi Kasus', type: 'memo', case: 'CSE-2026-001', size: '0.8 MB', modified: '2026-03-21', author: 'Ahmad Faisal' },
  { id: 6, name: 'Surat Somasi - PT Teknologi', type: 'correspondence', case: 'CSE-2026-005', size: '1.5 MB', modified: '2026-03-20', author: 'Siti Rahayu' },
  { id: 7, name: 'Akta Warisan Keluarga Santoso', type: 'contract', case: 'CSE-2026-002', size: '4.2 MB', modified: '2026-03-19', author: 'Siti Rahayu' },
  { id: 8, name: 'Laporan Due Diligence - Digital Nusantara', type: 'memo', case: 'CSE-2026-006', size: '8.7 MB', modified: '2026-03-18', author: 'Ahmad Faisal' },
  { id: 9, name: 'Bukti Pendaftaran Merek INDOTECH', type: 'evidence', case: 'CSE-2026-007', size: '2.1 MB', modified: '2026-03-17', author: 'Dewi Putri' },
  { id: 10, name: 'Kesepakatan Perceraian - Draft', type: 'contract', case: 'CSE-2026-004', size: '1.9 MB', modified: '2026-03-16', author: 'Dewi Putri' },
]

export const calendarEvents = [
  { id: 1, title: 'Sidang PT Maju Jaya vs PT Sentosa', type: 'hearing', date: '2026-03-28', time: '09:00', location: 'PN Jakarta Pusat', case: 'CSE-2026-001', color: '#ef4444' },
  { id: 2, title: 'Konsultasi Klien - Budi Santoso', type: 'consultation', date: '2026-03-28', time: '14:00', location: 'Kantor', case: 'CSE-2026-002', color: '#3b82f6' },
  { id: 3, title: 'Rapat Tim - Review Kasus', type: 'meeting', date: '2026-03-29', time: '10:00', location: 'Ruang Rapat A', case: '-', color: '#8b5cf6' },
  { id: 4, title: 'Deadline Pengajuan Gugatan', type: 'deadline', date: '2026-03-30', time: '17:00', location: '-', case: 'CSE-2026-003', color: '#f59e0b' },
  { id: 5, title: 'Sidang Perceraian Hendra & Maya', type: 'hearing', date: '2026-03-31', time: '09:30', location: 'PA Jakarta Selatan', case: 'CSE-2026-004', color: '#ef4444' },
  { id: 6, title: 'Meeting Akuisisi - PT Global Invest', type: 'meeting', date: '2026-04-01', time: '11:00', location: 'Kantor Klien', case: 'CSE-2026-006', color: '#8b5cf6' },
  { id: 7, title: 'Konsultasi Merek Dagang', type: 'consultation', date: '2026-04-02', time: '15:00', location: 'Kantor', case: 'CSE-2026-007', color: '#3b82f6' },
  { id: 8, title: 'Deadline Laporan Due Diligence', type: 'deadline', date: '2026-04-03', time: '23:59', location: '-', case: 'CSE-2026-006', color: '#f59e0b' },
  { id: 9, title: 'Sidang PHK - Rizki Pratama', type: 'hearing', date: '2026-04-05', time: '10:00', location: 'PHI Jakarta', case: 'CSE-2026-005', color: '#ef4444' },
  { id: 10, title: 'Mediasi - PT Makmur Sentosa', type: 'meeting', date: '2026-04-07', time: '14:00', location: 'Kantor Mediator', case: 'CSE-2026-010', color: '#8b5cf6' },
]

export const activities = [
  { id: 1, action: 'Document uploaded', detail: 'Surat Kuasa - PT Maju Jaya', time: '2 hours ago', user: 'Ahmad Faisal', icon: 'file' },
  { id: 2, action: 'Case updated', detail: 'CSE-2026-005 status changed to Active', time: '4 hours ago', user: 'Siti Rahayu', icon: 'briefcase' },
  { id: 3, action: 'New client added', detail: 'PT Makmur Sentosa', time: '6 hours ago', user: 'Dewi Putri', icon: 'user' },
  { id: 4, action: 'Invoice sent', detail: 'INV-2026-003 to CV Bersama', time: '1 day ago', user: 'Ahmad Faisal', icon: 'receipt' },
  { id: 5, action: 'Meeting scheduled', detail: 'Akuisisi PT Digital Nusantara', time: '1 day ago', user: 'Ahmad Faisal', icon: 'calendar' },
  { id: 6, action: 'Case closed', detail: 'CSE-2026-008 marked as closed', time: '2 days ago', user: 'Ahmad Faisal', icon: 'check' },
  { id: 7, action: 'Note added', detail: 'Strategy memo for CSE-2026-001', time: '2 days ago', user: 'Siti Rahayu', icon: 'edit' },
  { id: 8, action: 'Payment received', detail: 'INV-2026-006 - Rp 150.000.000', time: '3 days ago', user: 'System', icon: 'dollar' },
]

export const caseTypeData = [
  { name: 'Corporate', value: 4, color: '#3b82f6' },
  { name: 'Family', value: 2, color: '#8b5cf6' },
  { name: 'Property', value: 1, color: '#f59e0b' },
  { name: 'Labor', value: 1, color: '#ef4444' },
  { name: 'IP', value: 2, color: '#22c55e' },
]
