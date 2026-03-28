export const legalResponses: Record<string, string> = {
  'hukum pidana': 'Hukum Pidana di Indonesia diatur dalam Kitab Undang-Undang Hukum Pidana (KUHP) yang telah diperbarui melalui UU No. 1 Tahun 2023 tentang KUHP baru. KUHP baru ini mulai berlaku 3 tahun setelah diundangkan. Beberapa perubahan signifikan meliputi:\n\n1. **Delik Penghinaan Presiden** (Pasal 218-220)\n2. **Living Law** - Hukum yang hidup di masyarakat (Pasal 2)\n3. **Restorative Justice** - Keadilan restoratif\n4. **Pedoman Pemidanaan** yang lebih komprehensif\n\nApakah ada aspek spesifik dari hukum pidana yang ingin Anda ketahui lebih lanjut?',
  
  'hukum perdata': 'Hukum Perdata Indonesia bersumber dari Kitab Undang-Undang Hukum Perdata (KUH Perdata/BW). Beberapa aspek penting:\n\n1. **Buku I** - Tentang Orang (hak dan kewajiban pribadi)\n2. **Buku II** - Tentang Benda (hak kebendaan)\n3. **Buku III** - Tentang Perikatan (perjanjian dan kontrak)\n4. **Buku IV** - Tentang Pembuktian dan Daluwarsa\n\n**Syarat Sah Perjanjian (Pasal 1320 KUH Perdata):**\n- Sepakat mereka yang mengikatkan diri\n- Kecakapan untuk membuat perikatan\n- Suatu hal tertentu\n- Suatu sebab yang halal',
  
  'ketenagakerjaan': 'Hukum Ketenagakerjaan Indonesia diatur dalam beberapa peraturan utama:\n\n1. **UU No. 13 Tahun 2003** tentang Ketenagakerjaan\n2. **UU No. 11 Tahun 2020** tentang Cipta Kerja (Omnibus Law)\n3. **PP No. 35 Tahun 2021** tentang PKWT, Alih Daya, Waktu Kerja, dan PHK\n\n**Hak-hak Pekerja:**\n- Upah Minimum (UMR/UMK/UMP)\n- Jaminan Sosial (BPJS Ketenagakerjaan & Kesehatan)\n- Cuti Tahunan minimal 12 hari\n- Pesangon sesuai masa kerja\n- Perlindungan K3\n\n**Ketentuan PHK:**\nPHK hanya dapat dilakukan setelah memperoleh penetapan dari lembaga penyelesaian perselisihan hubungan industrial.',
  
  'hukum perusahaan': 'Hukum Perusahaan Indonesia diatur dalam:\n\n1. **UU No. 40 Tahun 2007** tentang Perseroan Terbatas\n2. **UU No. 11 Tahun 2020** (Cipta Kerja) yang mengubah beberapa ketentuan\n\n**Jenis Badan Usaha:**\n- PT (Perseroan Terbatas) - Modal dasar min. Rp 50 juta\n- CV (Commanditaire Vennootschap)\n- Firma\n- Koperasi\n- PT Perorangan (UMK)\n\n**Organ PT:**\n- RUPS (Rapat Umum Pemegang Saham)\n- Direksi\n- Dewan Komisaris\n\n**Kewajiban:** Laporan keuangan tahunan, RUPS tahunan, kepatuhan pajak.',
  
  'pertanahan': 'Hukum Pertanahan Indonesia berdasarkan:\n\n1. **UU No. 5 Tahun 1960** (UUPA - Undang-Undang Pokok Agraria)\n2. **PP No. 24 Tahun 1997** tentang Pendaftaran Tanah\n3. **PP No. 18 Tahun 2021** tentang HPL, Hak Atas Tanah, dan Satuan Rumah Susun\n\n**Jenis Hak Atas Tanah:**\n- Hak Milik (HM) - hak terkuat dan terpenuh\n- Hak Guna Usaha (HGU) - max 35 tahun\n- Hak Guna Bangunan (HGB) - max 30 tahun\n- Hak Pakai - max 25 tahun\n- Hak Pengelolaan (HPL)\n\n**Pendaftaran Tanah:** Wajib dilakukan di Kantor Pertanahan/BPN setempat untuk mendapatkan sertifikat.',
  
  'default': 'Terima kasih atas pertanyaan Anda. Sebagai AI Legal Assistant Salomo Partners, saya dapat membantu dengan berbagai topik hukum Indonesia:\n\n**Bidang yang dapat saya bantu:**\n- Hukum Pidana (KUHP)\n- Hukum Perdata (KUH Perdata)\n- Hukum Ketenagakerjaan\n- Hukum Perusahaan/Korporasi\n- Hukum Pertanahan/Agraria\n- Hukum Keluarga (Perceraian, Waris)\n- Hukum Hak Kekayaan Intelektual\n- Hukum Pajak\n- Hukum Lingkungan\n\nSilakan ajukan pertanyaan spesifik Anda dan saya akan memberikan informasi berdasarkan peraturan perundang-undangan yang berlaku di Indonesia.',
}

export function getAiResponse(query: string): string {
  const q = query.toLowerCase()
  for (const [key, value] of Object.entries(legalResponses)) {
    if (key !== 'default' && q.includes(key)) return value
  }
  if (q.includes('pidana') || q.includes('kuhp') || q.includes('criminal')) return legalResponses['hukum pidana']
  if (q.includes('perdata') || q.includes('kontrak') || q.includes('perjanjian') || q.includes('civil')) return legalResponses['hukum perdata']
  if (q.includes('kerja') || q.includes('phk') || q.includes('upah') || q.includes('labor') || q.includes('employ')) return legalResponses['ketenagakerjaan']
  if (q.includes('perusahaan') || q.includes('pt ') || q.includes('perseroan') || q.includes('company') || q.includes('corporate')) return legalResponses['hukum perusahaan']
  if (q.includes('tanah') || q.includes('agraria') || q.includes('property') || q.includes('land') || q.includes('hgb') || q.includes('hgu')) return legalResponses['pertanahan']
  return legalResponses['default']
}

export const sampleTranscription = {
  raw: `Baik, jadi pada hari ini tanggal 28 Maret 2026, kami melakukan rapat internal mengenai kasus sengketa tanah di Jalan Sudirman. Hadir dalam rapat ini Ahmad Faisal selaku Senior Partner, Siti Rahayu selaku Associate, dan Dewi Putri selaku Junior Associate.

Poin pertama yang dibahas adalah mengenai status kepemilikan tanah berdasarkan sertifikat HGB nomor 1234 yang diterbitkan oleh BPN Jakarta Pusat. Menurut hasil verifikasi kami, sertifikat tersebut masih berlaku hingga tahun 2030.

Poin kedua, pihak lawan mengklaim kepemilikan berdasarkan akta jual beli tahun 1998 yang menurut penelusuran kami memiliki beberapa kejanggalan. Pertama, tanda tangan notaris pada akta tersebut berbeda dengan specimen yang ada di Majelis Pengawas Notaris. Kedua, nomor akta tersebut tidak terdaftar di buku repertorium notaris yang bersangkutan.

Poin ketiga, strategi yang kami usulkan adalah mengajukan gugatan pembatalan akta jual beli tersebut ke Pengadilan Negeri Jakarta Pusat, dengan dasar hukum Pasal 1320 dan 1335 KUH Perdata tentang syarat sahnya perjanjian.

Kesimpulan rapat: Tim akan mempersiapkan berkas gugatan dalam waktu 14 hari kerja. Siti Rahayu ditugaskan untuk mengumpulkan bukti-bukti pendukung, sementara Dewi Putri akan melakukan riset yurisprudensi terkait.`,

  summary: `## Ringkasan Rapat Internal
**Tanggal:** 28 Maret 2026
**Peserta:** Ahmad Faisal (Senior Partner), Siti Rahayu (Associate), Dewi Putri (Junior Associate)
**Kasus:** Sengketa Tanah Jl. Sudirman (CSE-2026-003)

### Poin-Poin Utama:

**1. Status Kepemilikan**
- Sertifikat HGB No. 1234 dari BPN Jakarta Pusat masih berlaku hingga 2030
- Verifikasi telah dilakukan dan dikonfirmasi valid

**2. Klaim Pihak Lawan**
- Berdasarkan AJB tahun 1998 yang ditemukan kejanggalan:
  - Tanda tangan notaris tidak sesuai specimen di Majelis Pengawas Notaris
  - Nomor akta tidak terdaftar di buku repertorium notaris

**3. Strategi Hukum**
- Mengajukan gugatan pembatalan AJB ke PN Jakarta Pusat
- Dasar hukum: Pasal 1320 & 1335 KUH Perdata

### Tindak Lanjut:
| Tugas | Penanggung Jawab | Deadline |
|-------|-----------------|----------|
| Persiapan berkas gugatan | Tim | 14 hari kerja |
| Pengumpulan bukti pendukung | Siti Rahayu | 14 hari kerja |
| Riset yurisprudensi | Dewi Putri | 14 hari kerja |`
}

export const lawCompareResult = {
  similarities: [
    'Kedua pasal sama-sama mengatur tentang syarat sahnya suatu perbuatan hukum',
    'Keduanya mensyaratkan adanya kesepakatan para pihak sebagai elemen utama',
    'Pelanggaran terhadap kedua pasal dapat mengakibatkan batalnya perbuatan hukum',
    'Keduanya merupakan dasar hukum yang sering digunakan dalam perkara perdata',
  ],
  differences: [
    'Pasal 1320 mengatur syarat sah perjanjian secara umum (4 syarat), sedangkan Pasal 1365 mengatur tentang perbuatan melawan hukum',
    'Pasal 1320 bersifat preventif (sebelum perjanjian dibuat), Pasal 1365 bersifat represif (setelah terjadi kerugian)',
    'Beban pembuktian pada Pasal 1320 ada pada pihak yang menyatakan perjanjian tidak sah, sedangkan pada Pasal 1365 beban pembuktian ada pada penggugat',
    'Pasal 1320 mengatur pembatalan perjanjian, Pasal 1365 mengatur ganti rugi',
  ],
  recommendation: 'Dalam konteks perkara ini, disarankan untuk menggunakan kedua pasal secara kumulatif. Pasal 1320 KUH Perdata sebagai dasar untuk membuktikan bahwa perjanjian yang dibuat tidak memenuhi syarat sahnya perjanjian (khususnya syarat subjektif: kesepakatan dan kecakapan). Sedangkan Pasal 1365 KUH Perdata digunakan sebagai dasar tuntutan ganti rugi atas kerugian yang timbul akibat perbuatan melawan hukum pihak lawan. Pendekatan ini memberikan posisi hukum yang lebih kuat dalam proses litigasi.',
}

export const ocrSampleResult = `SURAT KUASA KHUSUS
Nomor: 045/SKK/SP/III/2026

Yang bertanda tangan di bawah ini:

Nama    : Budi Santoso
Alamat  : Jl. Gatot Subroto No. 45, Jakarta Selatan
NIK     : 3174052805780001

Selanjutnya disebut sebagai PEMBERI KUASA

Dengan ini memberikan kuasa penuh kepada:

Nama    : Ahmad Faisal, S.H., M.H.
Alamat  : Salomo Partners, Jl. HR Rasuna Said Kav. C-5, Jakarta
NIA     : 12.34567.89

Selanjutnya disebut sebagai PENERIMA KUASA

--- KHUSUS ---

Untuk dan atas nama Pemberi Kuasa, mewakili kepentingan hukum dalam perkara perdata Nomor 123/Pdt.G/2026/PN.Jkt.Pst di Pengadilan Negeri Jakarta Pusat, dengan hak untuk:

1. Mengajukan gugatan, jawaban, replik, duplik
2. Mengajukan dan menolak bukti-bukti
3. Mengajukan dan menolak saksi-saksi
4. Mengajukan kesimpulan
5. Melakukan upaya hukum banding, kasasi
6. Melakukan perdamaian (dading)

Demikian surat kuasa ini dibuat untuk dipergunakan sebagaimana mestinya.

Jakarta, 15 Maret 2026

PEMBERI KUASA                    PENERIMA KUASA

(Budi Santoso)                   (Ahmad Faisal, S.H., M.H.)`
