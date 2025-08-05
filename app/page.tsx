"use client"
import { useState, useRef, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MenuIcon, ArrowDown, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react" // Removed Mail, Phone, MapPin
import { motion } from "framer-motion"
import { ImageWithBlur } from "@/components/image-with-blur"

interface Report {
  title: string
  subtitle: string
  image: string
  description?: string
}

interface Member {
  name: string
  faculty: string
  major: string
  nim: string
  image: string
}

interface Activity {
  title: string
  description: string
  type: "image" | "video"
  src: string
  thumbnail?: string // Added for video thumbnails
}

interface UmkmDetail {
  name: string
  activities: Activity[] // Akan berisi foto dan video terkait UMKM ini
}

interface UmkmGroup {
  rw: string
  umkms: UmkmDetail[]
}

interface OutputActivity {
  title: string
  author: string
  date: string
  content: string
  images: { src: string; alt: string }[]
}

export default function Component() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Activity | null>(null) // New state for selected video
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false) // New state for video dialog
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("") // New state for search term
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null) // New state for author filter

  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * index,
      },
    }),
  }

  const reports: Report[] = [
    {
      title: "Laporan Pendampingan",
      subtitle: "Digitalisasi & Pembukuan",
      image: "/images/umkm-activities/sylma-collection-brochure-presentation-1.jpeg",
      description:
        "Dokumentasi setelah Saudari Siti Nur Laela selesai memaparkan materi dan memberikan pelatihan pendataan digital serta pembukuan kepada pelaku UMKM.",
    },
    {
      title: "Laporan Inovasi",
      subtitle: "Keuangan & Pendataan Digital",
      image: "/images/umkm-activities/hans-taylor-group-system-presentation.jpeg",
      description:
        "Dokumentasi setelah Saudara Singgih Abiyoga (keuangan UMKM), Muhammad Rama (pendataan UMKM), dan Rizky Dhafin (developer web pendataan UMKM) selesai memaparkan materi.",
    },
    {
      title: "Laporan Sosialisasi",
      subtitle: "Pemberdayaan Masyarakat",
      image: "/images/activities/sosialisasi-umkm-1.jpeg",
      description:
        "Dokumentasi setelah Kelompok 5 memaparkan materi program KKN kepada ibu-ibu PKK di RW 01 Kelurahan Plamongan Sari.",
    },
    {
      title: "Laporan Kesehatan",
      subtitle: "Penyuluhan Posyandu",
      image: "/images/reports/health-checkup.jpeg",
      description:
        "Saudari Tiara Adinda Maharani Perwika sedang melakukan kegiatan penyuluhan kesehatan di Posyandu Balai RW 04.",
    },
    {
      title: "Laporan Komunitas",
      subtitle: "Diskusi Warga",
      image: "/images/activities/group-discussion-session-1.jpeg", // Changed image
      description:
        "Kegiatan diskusi dan interaksi dengan warga setempat untuk memahami kebutuhan dan potensi pengembangan komunitas.",
    },
  ]

  const umkmPreviewImages = [
    { src: "/images/umkm-previews/dashboard-new.png", alt: "Dashboard Sistem Pendataan UMKM" },
    { src: "/images/umkm-previews/kelola-data-new.png", alt: "Kelola Data UMKM" },
    { src: "/images/umkm-previews/laporan-statistik-new.png", alt: "Laporan & Statistik UMKM" },
    { src: "/images/umkm-previews/login-page.png", alt: "Halaman Login Sistem UMKM" },
  ]

  const members: Member[] = [
    {
      name: "GERTRUDIS RADITYA",
      faculty: "Fakultas Hukum",
      major: "S1 - Hukum",
      nim: "11000122190232",
      image: "/images/members/gertrudis-raditya.png",
    },
    {
      name: "SINGGIH ABIYOGA",
      faculty: "Fakultas Sains dan Matematika",
      major: "S1 - Matematika",
      nim: "24010122140121",
      image: "/images/members/singgih-abiyoga.png",
    },
    {
      name: "MUHAMMAD RAMA",
      faculty: "Fakultas Sains dan Matematika",
      major: "S1 - Statistika",
      nim: "24050122140144",
      image: "/images/members/muhammad-rama.png",
    },
    {
      name: "SITI NUR LAELA",
      faculty: "Fakultas Ekonomika dan Bisnis",
      major: "S1 - Manajemen",
      nim: "12010122130172",
      image: "/images/members/siti-nur-laela.png",
    },
    {
      name: "FELICITAS VANIA",
      faculty: "Fakultas Hukum",
      major: "S1 - Hukum",
      nim: "11000122140516",
      image: "/images/members/felicitas-vania.png",
    },
    {
      name: "ANNISA WAHYU SAFITRI",
      faculty: "Fakultas Ilmu Sosial dan Ilmu Politik",
      major: "S1 - Administrasi Publik",
      nim: "14020122140196",
      image: "/images/members/annisa-wahyu-safitri.png",
    },
    {
      name: "ALYA JASMIN RIANSYA",
      faculty: "Fakultas Psikologi",
      major: "S1 - Psikologi",
      nim: "15000122140336",
      image: "/images/members/alya-jasmin-riansya.png",
    },
    {
      name: "RIZKY DHAFIN",
      faculty: "Fakultas Teknik",
      major: "S1 - Teknik Komputer",
      nim: "21120122120027",
      image: "/images/members/rizky-dhafin.png",
    },
    {
      name: "TIARA ADINDA",
      faculty: "Fakultas Sains dan Matematika",
      major: "S1 - Biologi",
      nim: "24020122140197",
      image: "/images/members/tiara-adinda.png",
    },
  ]

  const umkmSocializationActivities: Activity[] = [
    {
      title: "Foto Bersama Ibu PKK RW 01",
      description: "Sesi foto bersama dengan ibu-ibu PKK RW 01 setelah kegiatan sosialisasi program UMKM.",
      type: "image",
      src: "/images/activities/sosialisasi-umkm-1.jpeg",
    },
    {
      title: "Pemaparan Materi oleh Saudari Annisa",
      description:
        "Saudari Annisa Wahyu Safitri sedang memaparkan materi mengenai pembuatan konten promosi digital menggunakan Canva.",
      type: "image",
      src: "/images/activities/sosialisasi-umkm-5.jpeg",
    },
    {
      title: "Interaksi Peserta & Bimbingan",
      description:
        "Momen interaksi antara mahasiswa dan peserta, menjawab pertanyaan dan memberikan bimbingan personal.",
      type: "image",
      src: "/images/activities/sosialisasi-umkm-3.jpeg",
    },
    {
      title: "Pemaparan Materi oleh Saudari Jasmin",
      description:
        "Saudari Alya Jasmin Riansya sedang memaparkan materi mengenai pentingnya Service Quality dalam pemasaran UMKM.",
      type: "image",
      src: "/images/activities/pemaparan-jasmin.jpeg",
    },
  ]

  const umkmData: UmkmGroup[] = [
    {
      rw: "01",
      umkms: [
        {
          name: "Kebab Ali Baba",
          activities: [
            {
              title: "Diskusi Pendampingan UMKM",
              description:
                "Mahasiswa berdiskusi dengan pemilik Kebab Ali Baba mengenai pendataan digital dan pembukuan.",
              type: "image",
              src: "/images/umkm-activities/kebab-ali-baba-discussion-1.jpeg",
            },
            {
              title: "Sesi Tanya Jawab",
              description: "Sesi interaktif antara tim KKN dan pemilik UMKM untuk memahami kebutuhan dan tantangan.",
              type: "image",
              src: "/images/umkm-activities/kebab-ali-baba-discussion-2.jpeg",
            },
            {
              title: "Tampilan Depan Kebab Ali Baba",
              description: "Foto eksterior Kebab Ali Baba, salah satu UMKM yang didampingi.",
              type: "image",
              src: "/images/umkm-activities/kebab-ali-baba-storefront.jpeg",
            },
            {
              title: "Foto Bersama Tim KKN dan Pemilik",
              description: "Tim KKN berfoto bersama pemilik Kebab Ali Baba setelah sesi pendampingan.",
              type: "image",
              src: "/images/umkm-activities/kebab-ali-baba-group-photo.jpeg",
            },
            {
              title: "Video Diskusi Pendampingan",
              description: "Video dokumentasi sesi diskusi pendampingan UMKM Kebab Ali Baba.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-22%20at%2023.58.47_66a15290-eZ2o6QVZhWHZFDrDMDxmVAvrK3GUAC.mp4",
              thumbnail: "/images/umkm-activities/kebab-ali-baba-discussion-1.jpeg",
            },
            {
              title: "Video Review Dokumen",
              description: "Video saat tim KKN dan pemilik UMKM meninjau dokumen pendataan.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-22%20at%2023.58.47_e90e6b65-JA8IM9bEY9WT0e4sJ973tueoS514wP.mp4",
              thumbnail: "/images/umkm-activities/kebab-ali-baba-document-review.jpeg",
            },
          ],
        },
        {
          name: "Sylma Collection",
          activities: [
            {
              title: "Foto Bersama Tim KKN dan Pemilik Sylma Collection",
              description: "Tim KKN berfoto bersama pemilik usaha Sylma Collection setelah sesi pendampingan.",
              type: "image",
              src: "/images/umkm-activities/sylma-collection-group-photo-1.jpeg",
            },
            {
              title: "Pemaparan Materi dan Diskusi oleh Saudara Abi",
              description:
                "Saudara Singgih Abiyoga sedang memaparkan materi dan berdiskusi dengan pemilik Sylma Collection.",
              type: "image",
              src: "/images/umkm-activities/sylma-collection-discussion-1.jpeg",
            },
            {
              title: "Dokumentasi Hasil Pemaparan oleh Saudari Laela",
              description:
                "Saudari Siti Nur Laela sedang mendokumentasikan hasil pemaparan materi kepada pemilik UMKM.",
              type: "image",
              src: "/images/umkm-activities/sylma-collection-brochure-presentation-1.jpeg",
            },
            {
              title: "Pelatihan dan Bimbingan Materi oleh Saudari Laela",
              description:
                "Saudari Siti Nur Laela memberikan pelatihan dan bimbingan langsung mengenai materi pendataan digital.",
              type: "image",
              src: "/images/umkm-activities/sylma-collection-tablet-demonstration-1.jpeg",
            },
            {
              title: "Foto Bersama Tim KKN dan Pemilik (Pose Salam)",
              description: "Tim KKN dan pemilik Sylma Collection berfoto bersama dengan pose salam.",
              type: "image",
              src: "/images/umkm-activities/sylma-collection-group-photo-2.jpeg",
            },
            {
              title: "Memberikan perkenalan terkait website pendataan",
              description: "Video dokumentasi sesi diskusi pendampingan UMKM Sylma Collection.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-24%20at%2019.59.21_ada30a8a-EH9YErVPR9qHZtvRe7HKTTlVjZC8QA.mp4",
              thumbnail: "/images/umkm-activities/sylma-collection-video-thumb-4.png",
            },
            {
              title: "Kondisi lingkungan dari Sylma Collection",
              description: "Video saat tim KKN dan pemilik UMKM meninjau produk-produk Sylma Collection.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-24%20at%2019.59.18_1698ef16-KRny46kKmzV7HW9KkwJ7gi8omaSrAM.mp4",
              thumbnail: "/images/umkm-activities/sylma-collection-video-thumb-2.png",
            },
            {
              title: "Sesi QnA terkait pendataan oleh Saudara Rama",
              description: "Video dokumentasi sesi foto bersama dengan tim KKN dan pemilik Sylma Collection.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-24%20at%2019.59.16_62b6efe9-05upHHRjAonOjsz60ag2wWN6ZKsHkZ.mp4",
              thumbnail: "/images/umkm-activities/sylma-collection-video-thumb-3.png",
            },
            {
              title: "Penjelasan terkait design brand dari Canva",
              description: "Video dokumentasi demonstrasi sistem digital kepada pemilik UMKM Sylma Collection.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-24%20at%2019.59.34_40cfca81-7oq8nKHcx3va1pQOQiOKnjCTKHg7Z6.mp4",
              thumbnail: "/images/umkm-activities/sylma-collection-video-thumb-6.png",
            },
            {
              title: "Kondisi pada saat berdiskusi terhadap pelaku UMKM",
              description: "Video dokumentasi penjelasan lebih lanjut mengenai sistem melalui tablet.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-24%20at%2019.59.42_ee1fafab-kMtxwsn50ukarpFGnZnxHtnaqjyP1O.mp4",
              thumbnail: "/images/umkm-activities/sylma-collection-video-thumb-1.png",
            },
            {
              title: "Sesi diskusi kepada pelaku UMKM",
              description: "Video dokumentasi penjelasan materi pendataan digital menggunakan brosur.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-24%20at%2019.59.36_e8e0ed24-dVYCjGqfAKfCphVNYqGi6afQs73TYH.mp4",
              thumbnail: "/images/umkm-activities/sylma-collection-video-thumb-5.png",
            },
          ],
        },
      ],
    },
    {
      rw: "04",
      umkms: [
        {
          name: "Hans Taylor",
          activities: [
            {
              title: "Dokumentasi foto bersama",
              description: "Dokumentasi foto bersama tim KKN dengan pemilik Hans Taylor.",
              type: "image",
              src: "/images/umkm-activities/hans-taylor-group-system-presentation.jpeg",
            },
            {
              title: "Penjelasan dan pemaparan materi oleh Saudara Abi",
              description:
                "Saudara Singgih Abiyoga sedang memberikan penjelasan dan pemaparan materi kepada pemilik Hans Taylor.",
              type: "image",
              src: "/images/umkm-activities/hans-taylor-explanation-1.jpeg",
            },
            {
              title: "Penjelasan dan pemaparan materi oleh Saudara Rama",
              description:
                "Saudara Muhammad Rama sedang memberikan penjelasan dan pemaparan materi kepada pemilik Hans Taylor.",
              type: "image",
              src: "/images/umkm-activities/hans-taylor-explanation-2.jpeg",
            },
            {
              title: "Video penjelasan oleh Saudara Abi",
              description:
                "Video dokumentasi penjelasan materi oleh Saudara Singgih Abiyoga kepada pemilik Hans Taylor.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-23%20at%2000.05.18_5b87d02d-GdTKFBePwW8ivEczTLJosddkA4Lt4r.mp4",
              thumbnail: "/images/umkm-activities/hans-taylor-explanation-1.jpeg",
            },
            {
              title: "Video pemaparan materi oleh Saudara Rama",
              description: "Video dokumentasi pemaparan materi oleh Saudara Muhammad Rama kepada pemilik Hans Taylor.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-23%20at%2000.05.15_137c7104-ubcazDW8zlH06c0gQqHluXr4rwdXOO.mp4",
              thumbnail: "/images/umkm-activities/hans-taylor-explanation-2.jpeg",
            },
          ],
        },
        {
          name: "Catering",
          activities: [
            {
              title: "Foto Bersama Tim KKN dan Pemilik Catering",
              description: "Tim KKN berfoto bersama pemilik usaha catering after sesi pendampingan.",
              type: "image",
              src: "/images/umkm-activities/catering-group-photo-1.jpeg",
            },
            {
              title: "Foto Bersama dengan Salam",
              description: "Tim KKN dan pemilik catering berfoto bersama dengan pose salam.",
              type: "image",
              src: "/images/umkm-activities/catering-group-photo-2.jpeg",
            },
            {
              title: "Penjelasan Sistem Digital kepada Pemilik Catering",
              description: "Mahasiswa menjelaskan sistem pendataan digital UMKM kepada pemilik usaha catering.",
              type: "image",
              src: "/images/umkm-activities/catering-explanation-1.jpeg",
            },
            {
              title: "Video Penjelasan Sistem Digital (1)",
              description: "Video dokumentasi penjelasan sistem digital kepada pemilik catering.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-23%20at%2000.11.16_cbd04352-ANsutteufFvuGINki9Gz3hA5wlTab5.mp4",
              thumbnail: "/images/umkm-activities/catering-video-thumb-5.png", // Moved from video 5
            },
            {
              title: "Video Penjelasan Sistem Digital (2)",
              description: "Video lanjutan penjelasan sistem digital dan interaksi dengan pemilik catering.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-23%20at%2000.09.16_e005e18c-qbBumh8KgOKz8esxV1WG1OKtOlGUsb.mp4",
              thumbnail: "/images/umkm-activities/catering-video-thumb-6.png", // Moved from video 6
            },
            {
              title: "Video Penjelasan Sistem Digital (3)",
              description: "Video dokumentasi penjelasan sistem digital kepada pemilik catering.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-23%20at%2000.09.16_ff2f500b-nPRIRxwpeWyP9EoluSKtaJFXUkFVlw.mp4",
              thumbnail: "/images/umkm-activities/catering-video-thumb-4.png", // Moved from video 4
            },
            {
              title: "Video Penjelasan Sistem Digital (4)",
              description: "Video dokumentasi penjelasan sistem digital kepada pemilik catering.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-23%20at%2000.11.12_25eb2649-favp9LsxcsmR2t7vziVUQyn3hlkhFg.mp4",
              thumbnail: "/images/umkm-activities/catering-video-thumb-1.png", // Moved from video 1
            },
            {
              title: "Video Penjelasan Sistem Digital (5)",
              description: "Video dokumentasi penjelasan sistem digital kepada pemilik catering.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-23%20at%2000.09.16_94406ccc-2M85KkNqqHWzlgrzJvKC85m320NdYl.mp4",
              thumbnail: "/images/umkm-activities/catering-explanation-1.jpeg", // Moved from video 7
            },
            {
              title: "Video Penjelasan Sistem Digital (6)",
              description: "Video dokumentasi penjelasan sistem digital kepada pemilik catering.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-23%20at%2000.09.16_42ce9d4e-4iOLAEE9WuUZERQ3EuCULYKPG7VEw1.mp4",
              thumbnail: "/images/umkm-activities/catering-video-thumb-2.png", // Moved from video 2
            },
            {
              title: "Video Penjelasan Sistem Digital (7)",
              description: "Video dokumentasi penjelasan sistem digital kepada pemilik catering.",
              type: "video",
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-07-23%20at%2000.09.16_ceb8f9d6-8LxSSRpKqE0U3gPZ8Gy9hT09iIgyY0.mp4",
              thumbnail: "/images/umkm-activities/catering-video-thumb-3.png", // Moved from video 3 (by elimination)
            },
          ],
        },
      ],
    },
  ]

  const outputActivities: OutputActivity[] = [
    {
      title: "Kelompok 5 KKN TIM 105 UNDIP Gelar Sosialisasi UMKM di Kelurahan Plamongan Sari RW 1",
      author: "GERTRUDIS RADITYA",
      date: "14 Juli 2025",
      content: `
  <p class="text-lg text-gray-700 leading-relaxed mb-4">
    Kelompok 5 KKN TIM 105 Universitas Diponegoro (UNDIP) menyelenggarakan program sosialisasi bertajuk Peningkatan Kapasitas Pemasaran dan Inovasi UMKM di Kelurahan Plamongan Sari RW 1. Kegiatan ini merupakan bagian dari program Kuliah Kerja Nyata Tematik (KKNT) yang mengusung tema pemberdayaan UMKM, dengan arahan langsung dari Dosen Pembimbing Lapangan, Bapak Fajrul Falah, S.Hum., M.Hum. dan Ibu Riris Tiani, S.S., M.Hum. Salah satu bentuk implementasi program ini adalah sosialisasi pemanfaatan teknologi digital dalam pengembangan usaha mikro, kecil, dan menengah (UMKM). Pada kesempatan tersebut, Gertrudis Raditya, mahasiswa Fakultas Hukum UNDIP, memperkenalkan aplikasi Grab Merchant kepada para ibu PKK RW 1 sebagai salah satu solusi untuk meningkatkan jangkauan pemasaran produk UMKM.
  </p>
  <div class="flex flex-col sm:flex-row gap-4 mb-4 justify-center">
    <img
      src="/images/article-images/gertrudis-presentation.png"
      alt="Gertrudis Raditya sedang presentasi"
      width="300"
      height="200"
      class="rounded-lg shadow-md w-full sm:w-auto object-cover"
    />
    <img
      src="/images/article-images/gertrudis-group-photo.png"
      alt="Foto bersama peserta sosialisasi"
      width="300"
      height="200"
      class="rounded-lg shadow-md w-full sm:w-auto object-cover"
    />
  </div>
  <p class="text-lg text-gray-700 leading-relaxed mb-4">
    Kelurahan Plamongan Sari, khususnya RW 1, memiliki potensi UMKM yang sangat besar. Terdapat banyak pelaku usaha lokal dengan produk yang beragam. Namun demikian, masih banyak dari mereka yang belum akrab dengan pemanfaatan teknologi digital sebagai sarana promosi dan penjualan. Melalui kegiatan ini, kelompok KKN berupaya memberikan edukasi yang praktis dan aplikatif agar para pelaku UMKM di wilayah tersebut dapat lebih memahami pentingnya digitalisasi, serta mampu memanfaatkan platform seperti Grab Merchant untuk memperluas pasar dan meningkatkan pendapatan. Program ini diharapkan menjadi langkah awal dalam mendorong transformasi UMKM lokal menuju usaha yang lebih modern dan kompetitif di era digital.
  </p>
  `,
      images: [
        {
          src: "/images/article-images/gertrudis-presentation.png",
          alt: "Gertrudis Raditya sedang presentasi",
        },
        {
          src: "/images/article-images/gertrudis-group-photo.png",
          alt: "Foto bersama peserta sosialisasi",
        },
      ],
    },
    {
      title: "Mahasiswa Undip Bantu UMKM Plamongan Sari Go Digital dalam Laporan Keuangan",
      author: "MUHAMMAD RAMA",
      date: "17 Juli 2025",
      content: `
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Mahasiswa Kelompok 5 KKN-T Tim 105 Universitas Diponegoro (Undip) menggelar kegiatan pendampingan bagi pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) di Kelurahan Plamongan Sari RW 4, Kecamatan Pedurungan, Kota Semarang, pada Kamis, 17 Juli 2025. Kegiatan ini merupakan bagian dari program kerja bertema “Peningkatan Kapasitas Pemasaran dan Inovasi UMKM di Kota Semarang” yang menjadi fokus kelompok KKN-T dalam mendukung pemberdayaan ekonomi masyarakat di tingkat lokal.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        UMKM memiliki peran penting dalam menggerakkan roda perekonomian masyarakat. Namun, tidak sedikit pelaku usaha di tingkat kelurahan yang belum terbiasa melakukan pencatatan keuangan secara sistematis. Kondisi ini membuat mereka kesulitan mengetahui secara pasti kondisi usaha, termasuk besarnya keuntungan atau kerugian, serta perkembangan usaha dari waktu ke waktu. Melihat permasalahan tersebut, mahasiswa KKN-T menghadirkan solusi berupa edukasi dan pendampingan penggunaan template laporan keuangan berbasis Excel, yang dirancang sederhana namun mampu membantu UMKM mencatat arus kas harian hingga rekap tahunan.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 mb-4">
        <img
          src="/images/article-images/hans-taylor-excel-demonstration.jpeg"
          alt="Mahasiswa Undip mendampingi UMKM Hans Taylor"
          width="600"
          height="400"
          class="rounded-lg shadow-md w-full sm:w-1/2 object-cover"
        />
        <img
          src="/images/article-images/catering-group-with-students.jpeg"
          alt="Mahasiswa Undip mendampingi UMKM Catering Aminah"
          width="600"
          height="400"
          class="rounded-lg shadow-md w-full sm:w-1/2 object-cover"
        />
      </div>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Pendampingan dilakukan dengan mengunjungi dua UMKM di RW 4 pada hari yang sama. Kunjungan pertama dilakukan ke Hans Taylor, sebuah usaha konveksi milik Bapak Nur Hasim, pada pukul 11.00 WIB. Sementara pada pukul 15.00 WIB, tim melanjutkan kunjungan ke Catering Aminah, usaha katering rumahan milik Ibu Siti Aminah. Kedua pelaku usaha ini menyambut baik inovasi yang dibawa mahasiswa KKN-T dan antusias belajar cara menggunakannya.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Template laporan keuangan yang diperkenalkan memiliki sejumlah fitur utama yang mempermudah pencatatan bagi pelaku UMKM. Template ini menyediakan kolom untuk mencatat pemasukan dan pengeluaran harian lengkap dengan tanggal, deskripsi, tipe transaksi, cara pembayaran, dan saldo akhir yang otomatis terhitung. Selain itu, tersedia rekap bulanan yang menyajikan total pemasukan, pengeluaran, profit bersih, rugi bersih, saldo akhir, persentase keuntungan atau kerugian, serta margin perbandingan dengan bulan sebelumnya. Di akhir tahun, template juga menyediakan rekap tahunan yang menyajikan rangkuman seluruh bulan beserta analisis selisih saldo awal dan akhir tahun. Fitur lain yang menarik adalah adanya penanda otomatis untuk bulan dengan profit tertinggi dan bulan dengan kerugian tertinggi, sehingga pelaku usaha dapat dengan mudah mengevaluasi performa usaha mereka.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Dengan adanya template laporan keuangan digital ini, pelaku UMKM diharapkan dapat lebih mudah memantau kondisi keuangan usaha, membuat keputusan berdasarkan data, menyusun laporan keuangan untuk keperluan pembiayaan, serta mengelola usaha secara lebih profesional. Program ini juga sejalan dengan upaya pemerintah kota dalam mendorong digitalisasi UMKM.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Mahasiswa KKN-T Kelompok 5 berharap, melalui program sederhana namun aplikatif ini, UMKM di Kelurahan Plamongan Sari RW 4 dapat semakin berkembang dan meningkatkan daya saing mereka di tengah persaingan pasar. Kegiatan ini menjadi salah satu wujud nyata kontribusi mahasiswa Undip dalam mendukung pemberdayaan ekonomi masyarakat melalui edukasi praktis dan inovasi yang bermanfaat bagi pelaku usaha.
      </p>
      <h3 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Materi Pendukung</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <Card className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white w-full hover:scale-[1.02]">
          <Link href="https://drive.google.com/drive/folders/1vIv_IrrxlvoutMchmy-8fVTHycsOnAIm" target="_blank" rel="noopener noreferrer" className="flex items-center w-full h-full">
            <PlayCircle class="h-8 w-8 text-red-500 mr-3 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900">Tutorial Video</p>
              <p class="text-sm text-gray-600">Tonton video panduan penggunaan template.</p>
            </div>
          </Link>
        </Card>
        <Card className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white w-full hover:scale-[1.02]">
          <Link href="https://docs.google.com/spreadsheets/d/1uN7vFbRrE-4nZHDdyHfGNAiz7hNszOLh/edit?usp=sharing&ouid=113915600500505698242&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="flex items-center w-full h-full">
            <FileSpreadsheet class="h-8 w-8 text-green-600 mr-3 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900">Excel Perhitungan Arus Kas</p>
              <p class="text-sm text-gray-600">Unduh template Excel untuk pencatatan keuangan.</p>
            </div>
          </Link>
        </Card>
      </div>
      <p class="text-sm text-gray-500 mt-8">
        Tim KKN-T Kelompok 5 – Tim 105 Universitas Diponegoro<br/>
        Kelurahan Plamongan Sari, RW 4<br/>
        Periode: 1-27 Juli 2025<br/>
        Tema: Peningkatan Kapasitas Pemasaran dan Inovasi UMKM di Kota Semarang
      </p>
    `,
      images: [
        {
          src: "/images/article-images/hans-taylor-excel-demonstration.jpeg",
          alt: "Mahasiswa Undip mendampingi UMKM Hans Taylor",
        },
        {
          src: "/images/article-images/catering-group-with-students.jpeg",
          alt: "Mahasiswa Undip mendampingi UMKM Catering Aminah",
        },
      ],
    },
    {
      title: "ANALISIS RASIO PROFITABILITAS UNTUK MENINGKATKAN MANAJEMEN KEUANGAN UMKM",
      author: "SINGGIH ABIYOGA",
      date: "23 Juli 2025", // Assuming current date for the new article
      content: `
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Tanpa manajemen yang tepat, UMKM bisa saja berjalan tanpa arah, bahkan tersandung di tengah jalan. Nah, salah satu cara paling efektif untuk mengevaluasi keuangan UMKM adalah dengan menggunakan analisis rasio keuangan.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Mungkin Anda pernah mendengar istilah seperti Current Ratio, Rasio Profitabilitas, atau Liquidity Ratio, bukan? Semua itu adalah bagian dari kumpulan financial ratio yang memiliki peran penting dalam membaca "kesehatan" keuangan suatu UMKM. Terkhususnya untuk UMKM, analisis Rasio Profitabilitas memiliki peran yang signifikan untuk perkembangan UMKM.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Mari kita pelajari lebih jelas apa yang dimaksud dengan Rasio Profitabilitas, jenis dan rumus, pada artikel di bawah ini!
      </p>
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Rasio Profitabilitas</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Jika kamu sudah masuk ke dalam dunia akuntansi keuangan suatu usaha, pasti tidak asing lagi dengan konsep rasio profitabilitas. Dalam istilah sederhana, rasio profitabilitas adalah alat yang membantu kamu menilai seberapa baik suatu badan usaha dalam menghasilkan laba dari pendapatannya.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Singkat kata, bisa diketahui bahwa rasio profitabilitas adalah ukuran penting yang menunjukkan seberapa efisien badan usaha dalam menghasilkan keuntungan dari aktivitas produksinya.
      </p>
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Jenis-Jenis Rasio Profitabilitas</h3>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li><strong>Gross Profit Margin (GPM):</strong> Perbandingan yang mengukur antara laba kotor kepada penjualan bersih suatu perusahaan. Idealnya di atas 30%, tergantung industrinya. Semakin tinggi, berarti perusahaan efisien mengelola harga pokok produksinya.</li>
        <li><strong>Net Profit Margin (NPM):</strong> Net Profit disebut juga dengan margin laba bersih yang fungsinya untuk mengukur laba bersih atas transaksi penjualan suatu perusahaan. Idealnya 10–20%, tapi bisa bervariasi menurut industri. Semakin tinggi, semakin baik karena berarti lebih banyak laba bersih dari setiap penjualan.</li>
        <li><strong>Return On Asset (ROA):</strong> Rasio profitabilitas selanjutnya adalah ROA, yakni rasio yang menunjukkan kemampuan suatu perusahaan dalam menghasilkan laba dengan memanfaatkan semua aktiva yang dimiliki. Perlu diingat jika laba yang dihasilkan dari rasio ROA ini adalah laba sebelum bunga dan pajak. Sedangkan nilai rasio yang idealnya adalah >5%. Mengukur efisiensi penggunaan aset dalam menghasilkan laba.</li>
        <li><strong>Return On Investment (ROI):</strong> Rasio yang digunakan untuk mengukur kemampuan perusahaan ketika akan menghasilkan laba untuk menutup biaya investasi yang telah dikeluarkan. ROI yang baik dan sehat umumnya berada di angka minimal 15%–20% per tahun.</li>
      </ul>
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Rumus Rasio Profitabilitas</h3>
      <div class="flex justify-center mb-6">
        <img
          src="/images/article-images/profitability-ratios-formulas.png"
          alt="Rumus Rasio Profitabilitas"
          width="700"
          height="500"
          class="rounded-lg shadow-md w-full max-w-xl object-contain"
        />
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Kesimpulan</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Rasio profitabilitas adalah ukuran kunci dalam mengevaluasi kemampuan badan usaha dalam menghasilkan laba dari pendapatannya. Jika kamu adalah pelaku usaha, maka penting untuk memahami rasio ini, karena dapat memberikan wawasan berharga dalam pengambilan keputusan yang kreatif dan inovatif.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Dengan pemahaman yang baik tentang rasio profitabilitas, kamu dapat lebih memahami dinamika usaha modern dan mengelola aspek keuangan yang krusial untuk kesuksesan badan usaha.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Demikian informasi kali ini. Semoga bermanfaat dan tetap semangat menjalankan usaha!
      </p>
    `,
      images: [
        {
          src: "/images/article-images/profitability-ratios-formulas.png",
          alt: "Rumus Rasio Profitabilitas",
        },
      ],
    },
    {
      title: "Perlindungan Konsumen dan Keamanan Digital untuk UMKM",
      author: "FELICITAS VANIA ARDININGRUM",
      date: "24 Juli 2025",
      content: `
      <h3 class="text-2xl font-bold text-gray-900 mb-4">PENTINGNYA PERLINDUNGAN KONSUMEN DALAM MEWUJUDKAN USAHA YANG AMAN DAN KONSUMEN YANG NYAMAN</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Terlepas dari kualitas produk, kenyamanan dan keamanan konsumen merupakan faktor penting dalam menjalankan kegiatan usaha, termasuk Usaha Kecil, Mikro dan Menengah (UMKM). Undang-undang Dasar Negara Republik Indonesia Tahun 1945 secara tegas telah menyatakan dan mengatur bahwa setiap warga negara berhak untuk mendapat perlindungan yang sama di mata hukum. Hal ini berlaku pula bagi setiap warga negara yang memiliki peran sebagai penjual atau produsen dan pembeli produk dan/atau jasa yang telah disediakan penjual dengan sebutan konsumen. Amanat ini telah diatur lebih detail dalam Undang-undang Nomor 8 Tahun 1999 tentang Perlindungan Konsumen. Secara singkat, aturan ini diberlakukan untuk mengatur hak dan kewajiban pelaku usaha yakni produsen dan konsumen. Dalam banyak kasus sengketa konsumen, kedudukan konsumen seringkali berada dalam kondisi yang lebih lemah dibandingkan produsen, maka dari itu undang-undang ini diatur untuk menyamakan kedudukan kedua pihak yang bersengketa, serta menjamin perlindungan hukum bagi para pihak dalam sengketa konsumen. Selain itu, undang-undang ini disahkan untuk meningkatkan kesadaran dan kemampuan konsumen untuk melindungi diri, menghadirkan kepastian hukum serta keterbukaan informasi, menumbuhkan sikap tanggung jawab dan kejujuran sebagai upaya menghadirkan kesadaran pelaku usaha mengenai pentingnya perlindungan konsumen, serta upaya meningkatkan kualitas barang dan/atau jasa yang menjamin kelangsungan usaha, kesehatan, kenyamanan, keamanan dan keselamatan konsumen.
      </p>
      <h4 class="text-xl font-semibold text-gray-900 mb-2">Hak Konsumen berdasarkan Pasal 4 UU Perlindungan Konsumen antara lain:</h4>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li>hak atas kenyamanan, keamanan, dan keselamatan dalam mengkonsumsi barang dan/atau jasa;</li>
        <li>hak untuk memilih serta mendapatkan barang dan/atau jasa sesuai dengan nilai tukar dan kondisi dan jaminan barang dan/atau jasa;</li>
        <li>hak atas informasi yang benar, jelas, dan jujur mengenai kondisi dan jaminan barang dan/atau jasa;</li>
        <li>hak untuk didengar pendapat dan keluhannya atas barang dan/atau upaya jasa yang digunakan;</li>
        <li>hak untuk mendapatkan advokasi, perlindungan, dan upaya penyelesaian sengketa perlindungan konsumen secara patut;</li>
        <li>hak untuk mendapat pembinaan dan pendidikan konsumen;</li>
        <li>hak untuk diperlakukan atau dilayani secara benar dan jujur serta tidak diskriminatif;</li>
        <li>hak untuk mendapatkan kompensasi, ganti rugi dan/atau penggantian, apabila barang dan/atau jasa yang diterima tidak sesuai dengan perjanjian atau tidak sebagaimana mestinya;</li>
        <li>hak-hak yang diatur dalam peraturan perundang-undangan lainnya.</li>
      </ul>
      <h4 class="text-xl font-semibold text-gray-900 mb-2">Sedangkan kewajiban konsumen diatur dalam Pasal 5 UU Perlindungan Konsumen antara lain:</h4>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li>membawa atau mengikuti petunjuk informasi dan prosedur pemakaian atau pemanfaatan barang dan/atau jasa, demi keamanan dan keselamatan;</li>
        <li>beritikad baik dalam melakukan transaksi pembelian barang dan/atau jasa;</li>
        <li>membayar sesuai dengan nilai tukar yang disepakati;</li>
        <li>mengikuti upaya penyelesaian hukum sengketa perlindungan konsumen secara patut</li>
      </ul>
      <h4 class="text-xl font-semibold text-gray-900 mb-2">Selain konsumen, hak pelaku usaha juga diatur dalam Pasal 6 UU Perlindungan Konsumen meliputi:</h4>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li>hak untuk menerima pembayaran yang sesuai dengan kesepakatan mengenai kondisi dan nilai tukar barang dan/atau jasa yang diperdagangkan;</li>
        <li>hak untuk mendapat perlindungan hukum dari tindakan konsumen yang beritikad tidak baik;</li>
        <li>hak untuk melakukan pembelaan diri sepatutnya di dalam penyelesaian hukum sengketa konsumen;</li>
        <li>hak untuk rehabilitasi nama baik apabila terbukti secara hukum bahwa kerugian konsumen tidak diakibatkan oleh barang dan/atau jasa yang diperdagangkan;</li>
        <li>hak-hak yang diatur dalam ketentuan peraturan perundang-undangan lainnya.</li>
      </ul>
      <h4 class="text-xl font-semibold text-gray-900 mb-2">Sedangkan kewajiban pelaku usaha telah diatur dalam Pasal 7 UU Perlindungan Konsumen, yakni:</h4>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li>beritikad baik dalam melakukan kegiatan usaha;</li>
        <li>memberikan informasi yang benar, jelas dan jujur mengenai kondisi dan jaminan barang dan/atau jasa serta memberi penjelasan penggunaan, perbaikan dan pemeliharaan;</li>
        <li>memperlakukan atau melayani konsumen secara benar dan jujur serta tidak diskriminatif;</li>
        <li>menjamin mutu barang dan/atau jasa yang diproduksi dan/atau diperdagangkan berdasarkan ketentuan standar mutu barang dan/atau jasa yang berlaku;</li>
        <li>memberi kesempatan kepada konsumen untuk menguji, dan/atau mencoba barang dan/atau jasa tertentu serta memberi jaminan dan/atau garansi atas barang yang dibuat dan/atau yang diperdagangkan;</li>
        <li>memberi kompensasi, ganti rugi dan/atau penggantian atas kerugian akibat penggunaan, pemakaian dan pemanfaatan barang dan/atau jasa yang diperdagangkan;</li>
        <li>memberi kompensasi, ganti rugi dan/atau penggantian apabila barang dan/atau jasa yang diterima atau dimanfaatkan tidak sesuai dengan perjanjian.</li>
      </ul>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Undang-undang ini secara tegas melarang pelaku usaha untuk melakukan manipulasi dan/atau menyembunyikan informasi produk baik yang tercantum dalam kemasan, maupun informasi dalam iklan yang bersifat cetak maupun iklan bersifat online.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Pelaksanaan hak dan kewajiban baik oleh pelaku usaha maupun konsumen secara tepat, dapat mewujudkan kegiatan perbelanjaan yang aman dan nyaman, sehingga dapat memajukan perekonomian daerah.
      </p>

      <h3 class="text-2xl font-bold text-gray-900 mb-4 mt-8">CYBERCRIME ATAS INFORMASI DALAM DUNIA DIGITAL</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Besarnya harapan Usaha Mikro, Kecil dan Menengah (UMKM) untuk mengembangkan usahanya, terutama dengan memanfaatkan kemajuan teknologi seringkali membawa dampak buruk bagi pemilik, apabila tidak dikelola dengan baik. Hal ini terjadi karena adanya risiko cybercrime atau kejahatan siber seperti pencurian data, penipuan hingga peretasan. Maka dari itu, penting bagi pelaku UMKM untuk mengetahui dan memahami cybercrime untuk melindungi diri dan usahanya dari ancaman digital.
      </p>
      <h4 class="text-xl font-semibold text-gray-900 mb-2">Apa itu Cybercrime?</h4>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Cybercrime adalah pelanggaran hukum menggunakan komputer, jaringan atau perangkat digital dan internet sebagai alat, sasaran, atau tempat terjadinya tindak pidana, misalnya penipuan online, pemalsuan informasi digital dan peretasan data pelanggan.
      </p>
      <h4 class="text-xl font-semibold text-gray-900 mb-2">Risiko dan/atau ancaman cybercrime dapat dihindari pelaku usaha dengan menerapkan prinsip kehati-hatian, seperti:</h4>
      <h5 class="text-lg font-semibold text-gray-900 mb-2">Edukasi & Literasi Digital</h5>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Pelaku UMKM dapat mengikuti pelatihan tentang cyber security atau keamanan digital, pentingnya perlindungan data pribadi dalam dunia digital, serta memahami regulasi e-commerce baik yang diadakan oleh pemerintah melalui lembaga terkait maupun oleh non-pemerintah.
      </p>
      <h5 class="text-lg font-semibold text-gray-900 mb-2">Sistem Keamanan Digital</h5>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Pelaku UMKM perlu menggunakan kata sandi atau password yang kuat serta rutin memperbaharui perangkat lunak, untuk mencegah terjadinya peretasan.
      </p>
      <h5 class="text-lg font-semibold text-gray-900 mb-2">Melindungi Data Konsumen</h5>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Data konsumen dan/atau pribadi merupakan informasi sensitif yang tidak dapat disebarluaskan dengan mudah. Maka dari itu, pelaku UMKM jangan pernah membagikan data sensitif konsumen ke pihak lain tanpa izin dari konsumen yang bersangkutan, terutama dalam informasi-informasi tertentu sesuai dengan ketentuan dalam Undang-undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi.
      </p>
      <h5 class="text-lg font-semibold text-gray-900 mb-2">Legalitas Marketplace</h5>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Pelaku usaha wajib memastikan legalitas marketplace tempat bertransaksi. Marketplace terpercaya memberikan jaminan keamanan serta menciptakan kenyamanan bagi konsumen.
      </p>
      <h4 class="text-xl font-semibold text-gray-900 mb-2">Atas risiko yang semakin berkembang mengikuti perkembangan teknologi saat ini, UMKM memiliki beberapa hak perlindungan yang telah diatur, antara lain:</h4>
      <h5 class="text-lg font-semibold text-gray-900 mb-2">Hak Mendapat Pembinaan & Dukungan</h5>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Pemerintah wajib memberikan edukasi, pelatihan dan bantuan bagi UMKM untuk mengetahui perkembangan teknologi (digital) serta hukum, sehingga terhindar dari permasalahan yang UMKM yang melibatkan teknologi dan hukum.
      </p>
      <h5 class="text-lg font-semibold text-gray-900 mb-2">Hak Atas Perlindungan Data</h5>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Setiap UMKM berhak mendapat perlindungan atas data pribadi, data konsumen dan data bisnis dari penyalahgunaan oleh pihak ketiga, sesuai dengan yang tercantum dalam Undang-undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi.
      </p>
      <h5 class="text-lg font-semibold text-gray-900 mb-2">Hak Akses Pembiayaan Digital</h5>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        UMKM memiliki akses untuk menerima pembiayaan digital melalui fintech, P2P Lending serta platform digital legal lainnya yang harus dipastikan berada dalam pengawasan Otoritas Jasa Keuangan (OJK) dan dijaminkan oleh Lembaga Penjaminan Simpanan (LPS).
      </p>
      <h5 class="text-lg font-semibold text-gray-900 mb-2">Kemudahan Penyelesaian Sengketa</h5>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        UMKM memiliki jaminan untuk dapat menempuh jalur hukum apabila terjadi suatu sengketa dalam kegiatan jual beli yang memanfaatkan kemajuan teknologi.
      </p>
      `,
      images: [],
    },
    {
      title:
        "“Cara Cerdas, Pembeli Puas”: Membangun Daya Tarik UMKM Melalui Penerapan Indikator Service Quality dalam Konsep Pemasaran",
      author: "ALYA JASMIN RIANSYA",
      date: "25 Juli 2025",
      content: `
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Ketika melakukan analisis keputusan pembeli, penting untuk mengetahui beberapa faktor yang dapat mempengaruhi persepsi dan keputusan konsumen. Diantaranya yaitu perbedaan internal individu, yang meliputi kebutuhan dan keinginan, motivasi, pemikiran, dan pengalaman dalam membeli. Kemudian konsumen akan dipengaruhi oleh faktor lingkungannya, seperti faktor demografis, lingkungan sosial, kondisi ekonomi setempat, dan pengaruh kelompok acuan. Dari kedua faktor tersebut, keputusan pembeli dapat dikontrol dengan strategi pemasaran. Selain dalam bentuk promosi, pengusaha UMKM juga dapat mengupayakan dengan meningkatkan kualitas pelayanan.
      </p>
      <div class="flex justify-center mb-6">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-TSVSfd80gSfbHfZOFV1VcuVGOvADli.png"
          alt="Wujudkan UMKM Digital dan Pelayanan Cerdas, Lahir Desa Tangguh dan Masyarakat Makmur"
          width="800"
          height="500"
          class="rounded-lg shadow-md w-full max-w-2xl object-contain"
        />
      </div>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Kualitas pelayanan merupakan salah satu komponen penting dalam menjalankan usaha untuk mendapatkan ketertarikan dari pembeli, mewujudkan kepuasan konsumen dan karyawan, serta membangun loyalitas konsumen terhadap produk UMKM. Maka dari itu, penting menerapkan beberapa strategi pelayanan yang dapat menarik perhatian dan menjaga tingkat konsistensi pembelian di generasi saat ini. Beberapa indikaror yang dapat diterapkan dalam UMKM atau usaha rumahan adalah:
      </p>
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Penampilan Fisik (Tangible)</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Meliputi penampilan fisik dan bukti nyata bentuk pelayanan yang diberikan. Penampilan fisik meliputi fasilitas, karyawan, dan bagaimana penjual menyajikan produknya. Hal tersebut tentunya dapat memberikan kesan pertama yang positif bagi pembelinya. Beberapa contoh indikator tangible yang baik adalah:
      </p>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li>Kondisi toko yang bersih, nyaman, desain menarik, dan lokasi toko yang bersih serta higienis</li>
        <li>Penyajian dan pengemasan produk yang sesuai dengan produk dan harga.</li>
        <li>Fasilitas fisik yang lengkap: barcode atau mesin Qris, tisu, tempat duduk dan meja yang memadai</li>
        <li>Penampilan penjual yang rapih dan sopan</li>
      </ul>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Semua hal itu tentu akan memberikan nilai positif di mata pelanggan dengan memperhatikan kebutuhan, keinginan, dan permintaan dari konsumen, dengan contoh studi kasus:
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        <strong>“Masyarakat setempat gemar membeli makan di warung nasi”</strong>
      </p>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li><strong>Kebutuhan:</strong> pilihan konsumen adalah warung nasi, namun kebutuhan ini akan dipengaruhi oleh beberapa faktor seperti kebersihan penyajian makanan dan penataan tempat duduk.</li>
        <li><strong>Keinginan:</strong> tentukan target konsumen, jika jangkauan pemasaran ingin lebih luas, maka biasanya konsumen selain membutuhkan makanan sebagai kebutuhan dasar, ada keinginan merasakan suasana nyaman dan estetika dari penyajian makanan.</li>
      </ul>
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Empati dan Responsif</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Dua komponen ini merupakan keterampilan yang perlu dimiliki oleh penjual atau pemilik gerai usaha. Merupakan kemampuan untuk memahami konsumen dengan cara memperhatikan kebutuhan dan keinginan konsumen, serta memberikan layanan yang cepat tanggap. Apabila dalam pelayanan, pegawai dapat memberikan penjelasan yang mendetail, membina, mengarahkan, membujuk atau memberikan solusi, maka akan lebih mudah dimengerti oleh pelanggan dan pelayanan akan mendapat respon yang positif. Sebagai pelaku usaha selain mencari keuntungan, tentunya penting dalam membangun kedekatan emosional dan kepercayaan dengan pelanggan. Beberapa bentuk nyata yang dapat ditampilkan adalah:
      </p>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li>Menguasai detail informasi produk dan memberikan solusi
          <ul class="list-circle list-inside ml-4">
            <li>“Kalau suka yang gak terlalu pedas bisa pilih menu ini”</li>
            <li>“Kalau mau gak terlalu manis, gulanya bisa dipisah”</li>
            <li>“Kalau menu ini porsinya besar jadi bisa sharing”</li>
          </ul>
        </li>
        <li>Mengenali kebiasaan pelanggan tetap
          <ul class="list-circle list-inside ml-4">
            <li>“Bungkus buat anaknya ya bu? Nanti saya buat gak terlalu pedas ya”</li>
            <li>“Stoknya hari ini sudah habis ka, tapi besok pagi bisa saya buat dan antar duluan”</li>
          </ul>
        </li>
        <li>Ketika komunikasi melalui pesan online, pastikan jawab dengan cepat dan responsif.</li>
        <li>Memberi sapaan hangat dan selalu mengucapkan terima kasih kepada pembeli.</li>
      </ul>
      <div class="flex justify-center mb-6">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IO9ptFpeOisEQeHXxNR8Ti5CdwZQgz.png"
          alt="Screenshot Google Form: Tangible and Empati & Responsif"
          width="800"
          height="500"
          class="rounded-lg shadow-md w-full max-w-2xl object-contain"
        />
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Reliabilty (Keandalan)</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Setiap pelayanan memerlukan pegawai yang memiliki pengetahuan, keahlian, dan profesionalisme dalam bidang kerjanya sehingga tidak ada bentuk keluhan dan kesan negatif yang diterima oleh masyarakat (Parasuraman, 2001). Keahlian yang dimaksud adalah handal dalam penguasaan bidang kerja dan pemanfaatan teknologi yang mendukung. Tak hanya berlaku untuk pegawai, penting bagi pelaku usaha untuk menerapkan konsistensi agar sesuai dengan apa yang dijanjikan oleh pembeli.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Bentuk nyata yang dapat ditunjukkan:
      </p>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li>Konsistensi jam buka tutup dan kesesuaian daftar harga.</li>
        <li>Memberikan informasi seputar fasilitas dan produk (promosi, paket murah, komposisi produk)</li>
        <li>Melayani dengan baik dan konsisten meskipun ramai pelanggan</li>
        <li>Handal dalam memasarkan produk ke masyarakat, baik melalui media online atau secara langsung.</li>
        <li>Pelaku usaha dapat menyesuaikan permintaan konsumen dalam bentuk kemasan produk.</li>
      </ul>
      <div class="flex justify-center mb-6">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-thkmFDZLKjBj6FAXpEfm1iXr2V3G27.png"
          alt="Screenshot Google Form: Reliability"
          width="800"
          height="500"
          class="rounded-lg shadow-md w-full max-w-2xl object-contain"
        />
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-4 mt-8">KONTRIBUSI KE UMKM</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Survey kepuasan konsumen melalui penilaian terhadap indikator kualitas pelayanan untuk UMKM Catering Ibu Aminah
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Lokasi: <Link href="https://g.co/kgs/Kuj46Fi" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://g.co/kgs/Kuj46Fi</Link>
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Link Form: <Link href="https://docs.google.com/forms/d/e/1FAIpQLScyocVE10ipbcEr8W58It7YizVf_SxE32KSi5TssuZ-zTcbvA/viewform?usp=header" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://docs.google.com/forms/d/e/1FAIpQLScyocVE10ipbcEr8W58It7YizVf_SxE32KSi5TssuZ-zTcbvA/viewform?usp=headeryang</Link>
      </p>
      `,
      images: [
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-TSVSfd80gSfbHfZOFV1VcuVGOvADli.png",
          alt: "Wujudkan UMKM Digital dan Pelayanan Cerdas, Lahir Desa Tangguh dan Masyarakat Makmur",
        },
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IO9ptFpeOisEQeHXxNR8Ti5CdwZQgz.png",
          alt: "Screenshot Google Form: Tangible and Empati & Responsif",
        },
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-thkmFDZLKjBj6FAXpEfm1iXr2V3G27.png",
          alt: "Screenshot Google Form: Reliability",
        },
      ],
    },
    {
      title: "Meningkatkan Jangkauan Usaha Melalui Google Maps: Solusi Digital Bagi UMKM",
      author: "TIARA ADINDA MAHARANI PERWIKA",
      date: "25 Juli 2025",
      content: `
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Pada era digital seperti saat ini, kehadiran usaha di dunia maya menjadi salah satu kunci penting untuk memperluas jangkauan konsumen dan meningkatkan daya saing. Sayangnya, banyak pelaku UMKM (Usaha Mikro, Kecil, dan Menengah), terutama di wilayah pedesaan atau kelurahan, belum sepenuhnya memanfaatkan platform digital gratis yang tersedia. Salah satu contoh paling sederhana namun sangat efektif adalah Google Maps.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Google Maps bukan sekadar aplikasi untuk mencari arah jalan. Di balik tampilannya yang sederhana, terdapat potensi besar untuk memperkenalkan usaha kepada masyarakat luas. Ketika seseorang mencari produk atau jasa, mereka sering mengetik kata kunci seperti “warung makan terdekat”, “laundry terdekat”, atau “toko bahan bangunan dekat sini”. Hasil pencarian tersebut umumnya menampilkan tempat usaha yang sudah terdaftar di Google Maps. Artinya, jika usaha kita belum terdaftar, maka akan luput dari perhatian calon pembeli meskipun lokasinya dekat.
      </p>
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Mengapa Google Maps Penting untuk UMKM?</h3>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li><strong>Meningkatkan Visibilitas Usaha</strong><br/>
          Saat usaha terdaftar di Google Maps, informasi usaha tersebut bisa muncul saat orang mencarinya lewat Google Search maupun Maps. Ini meningkatkan kemungkinan konsumen baru datang, bahkan dari luar daerah.</li>
        <li><strong>Memberi Kesan Profesional dan Terpercaya</strong><br/>
          Usaha yang muncul di Google dengan nama, alamat, dan jam operasional terlihat lebih profesional. Apalagi jika sudah ada ulasan dari pelanggan. Ini membangun kepercayaan.</li>
        <li><strong>Mempermudah Arah dan Navigasi</strong><br/>
          Konsumen tidak perlu bertanya-tanya arah ke tempat usaha, cukup klik lokasi dan mengikuti petunjuk dari Google Maps.</li>
        <li><strong>Mendukung Promosi Tanpa Biaya</strong><br/>
          Tidak perlu iklan mahal, cukup membuat profil usaha dan mengunggah beberapa foto, orang - orang dapat melihat produk dan lokasi kita.</li>
      </ul>
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Tantangan dan Solusi</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Pada beberapa pelaku UMKM merasa ragu karena belum terbiasa dengan teknologi. Namun, sosialisasi ini dirancang dengan pendekatan sederhana, menggunakan HP pribadi, dan bisa dipraktikkan secara langsung. Peserta yang tidak memiliki HP Android pun tetap bisa terlibat melalui bantuan anggota keluarga atau tetangga. Namun, tantangan jaringan internet juga masih menjadi permasalahan di beberapa tempat. Maka dari itu, kegiatan sosialisasi sebaiknya dilakukan di lokasi yang memiliki sinyal stabil atau menggunakan Wi-Fi publik, seperti di balai desa.
      </p>
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Dampak Jangka Panjang bagi UMKM</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Dengan terdaftarnya usaha di Google Maps, maka akan terbuka lebih banyak peluang:
      </p>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li>Peluang pesanan online lebih tinggi</li>
        <li>Konsumen dari luar desa bisa menemukan produk lokal</li>
        <li>UMKM desa mulai dikenal dan punya identitas digital</li>
        <li>Usaha lebih mudah diakses untuk kerjasama atau kolaborasi</li>
      </ul>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Langkah kecil seperti ini bisa menjadi awal dari transformasi digital UMKM, terutama di tingkat desa. Seiring berjalannya waktu, pelaku usaha juga bisa belajar lebih jauh, seperti membuat katalog digital, promosi via WhatsApp, dan menerima pesanan online.
      </p>
      `,
      images: [],
    },
    {
      title:
        "Pembuatan Konten Promosi Digital Menggunakan Canva: Strategi Inovatif dan Sarana Pemberdayaan UMKM di Era Digital",
      author: "ANNISA WAHYU SAFITRI",
      date: "25 Juli 2025", // Assuming current date for the new article
      content: `
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Di tengah derasnya arus digitalisasi, Usaha Mikro, Kecil, dan Menengah (UMKM) menjadi aktor penting dalam roda perekonomian lokal. Mereka tidak hanya menopang ekonomi rumah tangga, tetapi juga merepresentasikan potensi budaya, kearifan lokal, dan inovasi yang tumbuh dari bawah. Namun di balik geliat itu, banyak pelaku UMKM masih terkendala satu hal mendasar: kemampuan mengemas produk secara menarik dan menjualnya lewat platform digital.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Era digital menuntut lebih dari sekadar keberadaan produk tetapi menuntut cerita, visual, dan cara menyampaikan yang mampu menarik perhatian konsumen dalam hitungan detik. Di sinilah konten promosi digital memainkan peran sentral. Konten bukan lagi pelengkap, melainkan jantung dari strategi pemasaran modern. Namun, bagaimana jika pelaku UMKM belum memiliki latar belakang desain grafis atau sumber daya untuk menyewa jasa profesional?
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Jawabannya hadir melalui sebuah alat sederhana namun revolusioner yaitu Canva. Canva adalah platform desain grafis berbasis daring yang dirancang untuk siapa saja bahkan bagi mereka yang belum pernah menyentuh software desain sekalipun. Dengan antarmuka drag-and-drop, koleksi ribuan template gratis, serta fitur fleksibel yang mudah digunakan melalui HP ataupun laptop, Canva menjadi jembatan antara ide kreatif dan kebutuhan pemasaran UMKM.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Lebih dari sekadar alat bantu! Canva telah menjadi media pemberdayaan. Dalam berbagai pelatihan literasi digital untuk UMKM di desa, kelurahan, hingga kota, Canva digunakan untuk membantu pelaku usaha membuat desain brosur, katalog digital, konten Instagram, hingga video promosi secara mandiri. Mereka belajar cara menyampaikan nilai unik produknya, menciptakan identitas visual usaha, dan menghadirkan narasi yang menggugah emosi calon pelanggan.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Sehingga, para pelaku UMKM tidak hanya didorong menjadi pengguna teknologi, tetapi juga produsen konten digital yang kreatif. Mereka tidak lagi sekadar mengunggah foto produk ala kadarnya, tetapi menyusun materi promosi dengan struktur yang kuat dari pemilihan warna yang konsisten, penggunaan tipografi yang tepat, penempatan logo, hingga kalimat ajakan (call to action) yang menarik pelanggan.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Transformasi ini meluas hingga membentuk ekosistem pemberdayaan digital yang menyentuh berbagai lapisan masyarakat. Pemuda desa yang dulunya hanya menggunakan media sosial untuk hiburan kini menjadi fasilitator digital bagi usaha di lingkungannya. Ibu rumah tangga mulai belajar membuat promosi melalui WhatsApp Business, sementara para pengrajin tradisional mulai menvisualisasikan proses pembuatan produk mereka dalam bentuk konten edukatif yang menarik.
      </p>
      <div class="flex justify-center mb-6">
        <img
          src="/images/article-images/canva-training-group.png"
          alt="Pelatihan Pembuatan Konten Digital Menggunakan Canva"
          width="800"
          height="500"
          class="rounded-lg shadow-md w-full max-w-2xl object-contain"
        />
      </div>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Pada 14 Juli 2025, sebuah langkah konkret diambil untuk mengakselerasi transformasi ini melalui pelatihan secara door to door kepada para pelaku UMKM di wilayah RW dan RT, sekaligus menyelenggarakan sosialisasi kepada ibu-ibu PKK sebagai agen perubahan komunitas. Kegiatan ini bukan hanya menyampaikan materi secara satu arah, tetapi dilakukan secara dialogis dan partisipatif, mendekatkan teknologi ke dapur rumah tangga dan membuka ruang bagi setiap individu untuk bertanya, mencoba, dan menciptakan. Di akhir kegiatan, peserta pelatihan tidak hanya pulang dengan pengetahuan baru, tetapi juga mendapatkan prototype berupa template Canva yang telah disesuaikan dengan kebutuhan UMKM lokal, seperti katalog produk makanan rumahan, flyer jasa kerajinan, atau konten promosi jasa digital, yang seluruhnya dapat diakses publik secara gratis melalui tautan yang dibagikan. Ini menjadi langkah penting dalam menciptakan inklusi digital tidak sekadar memberi pengetahuan, tetapi juga memberikan alat dan rasa percaya diri untuk berkarya.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Tidak hanya itu, Canva juga menciptakan inklusi teknologi yang memberikan peluang bagi mereka yang sebelumnya tidak tersentuh dunia digital untuk mulai percaya diri. Ini bukan hanya soal peningkatan omzet, tetapi soal transformasi mentalitas dari pasif menjadi aktif, dari konsumen informasi menjadi pembuat narasi.
      </p>
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Untuk mendukung proses ini, berikut beberapa langkah strategis yang biasa diterapkan dalam pelatihan pembuatan konten promosi dengan Canva:</h3>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
        <li><strong>Identifikasi Tujuan Konten:</strong> Tentukan apakah konten bertujuan memperkenalkan produk baru, membangun kepercayaan, atau meningkatkan penjualan.</li>
        <li><strong>Pemilihan Template dan Format:</strong> Pilih template sesuai platform target (Instagram, feed Shopee, video story, dll.).</li>
        <li><strong>Personalisasi Visual:</strong> Ganti gambar, sesuaikan warna dan font dengan brand UMKM.</li>
        <li><strong>Tambahkan Call to Action:</strong> Misalnya “Beli Sekarang!”, “Pesan via WA”, atau “Lihat Produk Lainnya”.</li>
        <li><strong>Publikasikan dan Evaluasi:</strong> Unggah konten secara konsisten, lalu pelajari respons konsumen untuk konten berikutnya.</li>
      </ul>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Kegiatan ini bukan hanya soal desain melainkan tentang bagaimana strategi komunikasi visual bisa menjembatani kepercayaan antara produk lokal dan konsumen digital. Bahkan dengan tren algoritma media sosial yang sangat visual, konten desain yang baik menjadi investasi jangka panjang bagi pertumbuhan UMKM.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Pada akhirnya, pembuatan konten digital menggunakan Canva bukan sekadar kegiatan teknis, tetapi bagian dari ekosistem pemberdayaan dengan mempertemukan inovasi teknologi dengan nilai lokal, kreativitas dengan partisipasi sosial, serta narasi digital dengan semangat ekonomi kerakyatan. Di tengah disrupsi digital, UMKM yang mampu menyuarakan dirinya dengan cara yang otentik dan menarik akan lebih mudah bertahan dan berkembang.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Dengan Canva di tangan, pelaku UMKM tidak lagi hanya menjadi penonton dalam arena digital, tetapi pemain aktif yang mampu menciptakan perubahan yang bukan hanya untuk usahanya, tapi juga untuk komunitasnya.
      </p>
      `,
      images: [
        {
          src: "/images/article-images/canva-training-group.png",
          alt: "Pelatihan Pembuatan Konten Digital Menggunakan Canva",
        },
      ],
    },
    {
      title: "Digitalisasi Pencatatan Keuangan UMKM melalui Penggunaan Aplikasi atau Web SI APIK",
      author: "SITI NUR LAELA YUNI SAHARA",
      date: "25 Juli 2025", // Assuming current date for the new article
      content: `
  <p class="text-lg text-gray-700 leading-relaxed mb-4">
    Di tengah pesatnya pertumbuhan Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia, masih banyak pelaku usaha yang menjalankan bisnisnya tanpa sistem pencatatan keuangan yang baik. Padahal, UMKM menyumbang lebih dari 60 persen terhadap Produk Domestik Bruto (PDB) dan menyerap mayoritas tenaga kerja nasional. Sayangnya, kontribusi besar ini belum sepenuhnya diiringi oleh kemampuan pengelolaan usaha yang modern dan tertata. Salah satu kelemahan paling umum yang dihadapi UMKM saat ini adalah ketidakteraturan dalam pencatatan keuangan.
  </p>
  <p class="text-lg text-gray-700 leading-relaxed mb-4">
    Banyak UMKM di Indonesia masih mengandalkan pencatatan manual, bahkan ada yang sepenuhnya mengandalkan ingatan. Hal ini membuat mereka tidak mengetahui secara pasti berapa keuntungan sebenarnya, berapa modal yang tersisa, atau bahkan apakah usaha mereka sedang mengalami kerugian. Tanpa catatan keuangan yang rapi, pelaku UMKM juga sulit mendapatkan akses pembiayaan dari bank atau lembaga keuangan karena tidak dapat menunjukkan laporan keuangan yang valid. Di era digital saat ini, pola kerja seperti ini membuat UMKM rentan stagnan, sulit berkembang, dan tidak siap menghadapi persaingan pasar yang semakin kompetitif.
  </p>
  <p class="text-lg text-gray-700 leading-relaxed mb-4">
    Sebagai respons terhadap masalah tersebut, Bank Indonesia mengembangkan aplikasi SI APIK (Sistem Aplikasi Pencatatan Informasi Keuangan), sebuah solusi digital pencatatan keuangan sederhana yang dirancang khusus untuk pelaku UMKM. Aplikasi ini bisa diakses secara gratis melalui web dan dapat digunakan secara offline setelah instalasi awal. SI APIK hadir untuk membantu pelaku usaha mencatat transaksi harian mereka dengan mudah, cepat, dan sistematis.
  </p>
  <p class="text-lg text-gray-700 leading-relaxed mb-4">
    Melalui SI APIK, pengguna dapat mencatat berbagai jenis transaksi seperti penjualan, pembelian bahan, pembayaran utang, penarikan modal, hingga pengeluaran operasional. Lebih dari sekadar aplikasi pencatat transaksi, SI APIK juga menyediakan berbagai laporan keuangan otomatis, mulai dari laporan laba rugi, neraca, arus kas, hingga analisis beban usaha tahunan. Semua laporan ini bisa diakses kapan saja untuk membantu pemilik usaha memahami kondisi keuangan dan mengambil keputusan bisnis yang lebih cerdas.
  </p>
  <p class="text-lg text-gray-700 leading-relaxed mb-4">
    SI APIK ditujukan untuk semua kalangan UMKM—baik usaha rumahan, pedagang kaki lima, hingga pengusaha kecil menengah yang mulai berkembang. Tidak diperlukan latar belakang akuntansi atau keuangan untuk bisa menggunakannya. Proses registrasi juga tergolong mudah. Pelaku usaha cukup memiliki laptop atau komputer, koneksi internet saat pertama kali mendaftar, serta email aktif. Setelah mengunjungi situs resmi SI APIK dan membuat akun dengan mengisi nama, username, email, serta password, pengguna bisa langsung mulai mengisi data usaha dan melakukan pencatatan.
  </p>
  <p class="text-lg text-gray-700 leading-relaxed mb-4">
    Untuk memaksimalkan manfaat dari aplikasi ini, pelaku UMKM disarankan menyiapkan data usaha sederhana seperti nama usaha, alamat, deskripsi singkat, serta informasi modal awal. Setelah itu, proses pencatatan bisa dilakukan setiap kali ada transaksi masuk atau keluar. Semua data akan tersimpan dengan aman dan bisa dicadangkan atau dipulihkan kapan saja melalui fitur backup dan restore.
  </p>
  <p class="text-lg text-gray-700 leading-relaxed mb-4">
    Digitalisasi pencatatan keuangan melalui SI APIK merupakan langkah strategis agar UMKM Indonesia semakin tertib secara finansial dan siap bersaing di era modern. Dengan pencatatan yang rapi dan laporan yang jelas, pelaku usaha bisa lebih mudah mengevaluasi kinerja, memperluas pasar, serta mendapatkan kepercayaan dari investor maupun mitra bisnis.
  </p>
  <p class="text-lg text-gray-700 leading-relaxed mb-4">
    Kini saatnya pelaku UMKM tidak lagi mencatat secara konvensional, tetapi mulai beralih ke pencatatan digital yang praktis dan efisien. Dengan SI APIK, setiap transaksi yang kecil sekalipun menjadi bermakna karena akan membentuk fondasi keuangan yang kuat bagi keberlanjutan usaha.
  </p>
  <p class="text-lg text-gray-700 leading-relaxed mb-4">
    Sebagai langkah awal, pelaku UMKM yang ingin memulai dapat mengakses modul panduan praktis penggunaan aplikasi SI APIK yang telah disusun secara sistematis. Modul ini mencakup langkah-langkah mulai dari registrasi akun, pengisian data usaha, pencatatan transaksi, hingga cara melihat laporan keuangan. Panduan ini akan sangat membantu bagi pengguna baru agar lebih cepat memahami dan memanfaatkan seluruh fitur SI APIK secara optimal. Modul dapat diakses pada link berikut: <Link href="https://bit.ly/PanduanPraktisAplikasiSIAPIK" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://bit.ly/PanduanPraktisAplikasiSIAPIK</Link>
  </p>
  `,
      images: [],
    },
    {
      title:
        "Inovasi Digital KKN-T Undip: Website Pendataan UMKM Tingkatkan Kapasitas Pemasaran di Plamongan Sari RW 04",
      author: "RIZKY DHAFIN ALMANSYAH",
      date: "25 Juli 2025",
      content: `
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        SEMARANG – Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia terus menjadi pilar ekonomi, namun di tingkat akar rumput, tantangan pendataan dan pengembangan seringkali masih menghambat. Menjawab kebutuhan ini, Kelompok 5 Kuliah Kerja Nyata Tematik (KKN-T) Tim 105 Universitas Diponegoro telah meluncurkan sebuah inovasi digital yang signifikan: <strong>Sistem Pendataan UMKM RT/RW</strong>. Proyek ini berfokus pada peningkatan kapasitas pemasaran dan inovasi UMKM di Desa Plamongan Sari, khususnya di wilayah RW 04, Kota Semarang.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Sebelumnya, pengelolaan data UMKM di tingkat RW masih banyak dilakukan secara manual. Hal ini menciptakan kendala serius seperti data yang tidak terpusat, kesulitan dalam memantau perkembangan usaha, terbatasnya potensi pemasaran, serta minimnya identifikasi peluang inovasi. Kondisi ini mendorong mahasiswa KKN-T Undip untuk merancang solusi yang lebih modern dan efisien.
      </p>
      <div class="flex justify-center mb-6">
        <img
          src="/images/article-images/umkm-dashboard-preview-large.png"
          alt="Dashboard Sistem Pendataan UMKM"
          width="800"
          height="500"
          class="rounded-lg shadow-md w-full max-w-2xl object-contain"
        />
      </div>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Website "Sistem Pendataan UMKM RT/RW" dikembangkan dengan fondasi teknologi terkini untuk memastikan performa optimal dan kemudahan penggunaan. Next.js 14 dengan App Router dipilih sebagai <em>framework</em> utama, memungkinkan aplikasi web yang cepat dan responsif. Desain antarmuka yang bersih dan modern diwujudkan melalui penggunaan Tailwind CSS dan komponen UI dari shadcn/ui, memastikan tampilan yang menarik di berbagai perangkat. Untuk penyimpanan data yang terpusat dan handal, tim mengintegrasikan Neon Database, sebuah solusi PostgreSQL <em>serverless</em> yang memungkinkan data UMKM tersimpan secara <em>online</em> dan dapat diakses dari mana saja. Keamanan data juga menjadi prioritas dengan implementasi sistem autentikasi kustom yang mendukung peran pengguna (Admin RW dan User Warga), memastikan akses data hanya oleh pihak yang berwenang.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Platform digital ini hadir dengan serangkaian fitur komprehensif. Sistem multi-user memungkinkan Admin RW untuk mengelola seluruh data UMKM di wilayahnya, memantau statistik, dan membuat laporan, sementara User Warga dapat mendaftarkan dan mengelola data UMKM miliknya sendiri. Fitur manajemen data UMKM sangat lengkap, mencakup formulir pendaftaran detail dengan lebih dari 25 bidang data, kemudahan untuk memperbarui informasi, serta fitur pencarian canggih dan filter berdasarkan jenis usaha atau status operasional. Data yang terkumpul juga dapat diekspor ke format CSV untuk analisis lebih lanjut.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Selain itu, website ini dilengkapi dengan dashboard dan laporan interaktif. Dashboard menyajikan ringkasan statistik penting secara <em>real-time</em>, seperti total UMKM, UMKM aktif, dan penyerapan tenaga kerja. Visualisasi sederhana menunjukkan sebaran UMKM berdasarkan jenis dan kategori usaha, membantu identifikasi sektor dominan. Kemampuan untuk mengunduh laporan statistik dalam format teks juga tersedia, memberikan gambaran komprehensif tentang ekosistem UMKM di RW 04.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Kehadiran Sistem Pendataan UMKM RT/RW ini diharapkan membawa dampak positif yang signifikan. Efisiensi pendataan akan meningkat drastis, menggantikan metode manual dengan sistem digital yang terpusat. Pengurus RW dapat membuat keputusan yang lebih tepat terkait program pembinaan atau bantuan UMKM berdasarkan data yang akurat dan terkini. Lebih jauh lagi, dengan data yang terorganisir, potensi UMKM dapat lebih mudah diidentifikasi, membuka peluang untuk pelatihan, pendampingan, atau akses ke pasar yang lebih luas, sekaligus mendorong inovasi dalam produk, layanan, atau strategi pemasaran.
      </p>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        Proyek ini merupakan contoh nyata bagaimana inovasi digital dapat memberdayakan komunitas di tingkat lokal, mendorong pertumbuhan ekonomi, dan meningkatkan kesejahteraan warga.
      </p>
      `,
      images: [
        {
          src: "/images/article-images/umkm-dashboard-preview-large.png",
          alt: "Dashboard Sistem Pendataan UMKM",
        },
      ],
    },
  ]

  // Get unique authors for the filter dropdown
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>()
    outputActivities.forEach((article) => authors.add(article.author))
    return Array.from(authors)
  }, [outputActivities])

  // Filtered articles based on search term and selected author
  const filteredOutputActivities = useMemo(() => {
    return outputActivities.filter((article) => {
      const matchesSearchTerm =
        searchTerm === "" ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesAuthor = selectedAuthor === null || article.author === selectedAuthor
      return matchesSearchTerm && matchesAuthor
    })
  }, [outputActivities, searchTerm, selectedAuthor])

  const handleCardClick = (report: Report) => {
    setSelectedReport(report)
    setIsDialogOpen(true)
  }

  const handleVideoCardClick = (activity: Activity) => {
    setSelectedVideo(activity)
    setIsVideoDialogOpen(true)
  }

  const scrollCarousel = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = 256 + 24 // Card width (w-64 = 256px) + gap (space-x-6 = 24px)
      let newIndex = currentIndex

      if (direction === "right") {
        newIndex = (currentIndex + 1) % reports.length
      } else {
        newIndex = (currentIndex - 1 + reports.length) % reports.length
      }
      setCurrentIndex(newIndex)
      scrollContainerRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-6 md:px-10 flex items-center justify-between shadow-sm fixed w-full z-50 top-0 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-gray-800 hover:text-[#e63946] font-bold py-2 px-4 rounded-md">
            KKNT Kelompok 5
          </Button>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#beranda" className="text-gray-700 hover:text-[#e63946] font-medium" prefetch={false}>
            Beranda
          </Link>
          <Link href="#laporan-kegiatan" className="text-gray-700 hover:text-[#e63946] font-medium" prefetch={false}>
            Laporan Kegiatan
          </Link>
          <Link href="#profil-kelompok" className="text-gray-700 hover:text-[#e63946] font-medium" prefetch={false}>
            Profil Kelompok
          </Link>
          <Link href="#pelaksanaan-multi-1" className="text-gray-700 hover:text-[#e63946] font-medium" prefetch={false}>
            Pelaksanaan Multi 1
          </Link>
          <Link href="#luaran-kegiatan" className="text-gray-700 hover:text-[#e63946] font-medium" prefetch={false}>
            Luaran Kegiatan
          </Link>
          <Link href="#anggota-kelompok" className="text-gray-700 hover:text-[#e63946] font-medium" prefetch={false}>
            Anggota Kelompok
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 py-6">
              <Link href="#beranda" className="text-gray-800 hover:text-[#e63946] font-medium" prefetch={false}>
                Beranda
              </Link>
              <Link
                href="#laporan-kegiatan"
                className="text-gray-800 hover:text-[#e63946] font-medium"
                prefetch={false}
              >
                Laporan Kegiatan
              </Link>
              <Link href="#profil-kelompok" className="text-gray-800 hover:text-[#e63946] font-medium" prefetch={false}>
                Profil Kelompok
              </Link>
              <Link
                href="#pelaksanaan-multi-1"
                className="text-gray-800 hover:text-[#e63946] font-medium"
                prefetch={false}
              >
                Pelaksanaan Multi 1
              </Link>
              <Link href="#luaran-kegiatan" className="text-gray-800 hover:text-[#e63946] font-medium" prefetch={false}>
                Luaran Kegiatan
              </Link>
              <Link
                href="#anggota-kelompok"
                className="text-gray-800 hover:text-[#e63946] font-medium"
                prefetch={false}
              >
                Anggota Kelompok
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 overflow-hidden pt-[72px]" id="beranda">
        <section
          className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 md:px-10"
          style={{ backgroundImage: `url('/images/kknt-banner.png')` }}
        >
          <span className="sr-only">
            KKNT-105 Kelompok 5: Peningkatan Kapasitas Pemasaran Dan Inovasi Akses Terhadap UMKM Melalui Teknologi
            Digital Dan Bahasa Di Kota Semarang
          </span>
        </section>

        {/* Laporan Kegiatan Section */}
        <section className="relative z-20 -mt-20 md:-mt-32 lg:-mt-40 px-4 md:px-10 pb-16" id="laporan-kegiatan">
          <div className="relative max-w-6xl mx-auto">
            <div
              ref={scrollContainerRef}
              className="flex space-x-6 overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide"
            >
              {reports.map((report, index) => (
                <motion.div
                  key={index}
                  variants={fadeInAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  custom={index}
                  className="flex-none w-64"
                >
                  <Card
                    className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer hover:scale-105"
                    onClick={() => handleCardClick(report)}
                  >
                    <CardContent className="p-0 relative h-96">
                      <ImageWithBlur
                        src={report.image || "/placeholder.svg"}
                        alt={`Thumbnail ${report.title}`}
                        width={300}
                        height={400}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 text-white">
                        <h3 className="font-bold text-xl mb-1">{report.title}</h3>
                        <p className="text-sm opacity-80">{report.subtitle}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              <motion.div
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                custom={reports.length}
                className="flex-none w-64"
              >
                <Link
                  href="#pelaksanaan-multi-1"
                  className="block h-full"
                  style={{ textDecoration: "none" }}
                  prefetch={false}
                >
                  <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-center p-6 h-full">
                    <CardContent className="flex flex-col items-center justify-center h-full text-white">
                      <h3 className="text-2xl font-bold mb-2">Lihat Semua Laporan</h3>
                      <ArrowDown className="h-8 w-8" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </div>
            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md z-10 hidden md:flex"
              onClick={() => scrollCarousel("left")}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md z-10 hidden md:flex"
              onClick={() => scrollCarousel("right")}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </section>

        {/* Profil Kelompok Section (formerly About Section) */}
        <section className="py-20 px-4 md:px-10 bg-gradient-to-br from-slate-50 to-blue-50" id="profil-kelompok">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Profil KKNT Kelompok 5</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Kami adalah kelompok mahasiswa yang berdedikasi dalam program Kuliah Kerja Nyata Tematik (KKNT) dengan
                fokus pada pemberdayaan masyarakat dan pengembangan potensi desa.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Melalui berbagai program dan kegiatan, kami berupaya memberikan kontribusi nyata dalam bidang
                pendidikan, ekonomi, lingkungan, dan kesehatan untuk menciptakan perubahan positif di desa mitra kami.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/images/kknt-group-profile.jpeg"
                alt="Foto Kelompok KKNT 5"
                width={600}
                height={400}
                className="rounded-xl shadow-lg w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Pelaksanaan Multi 1 Section (formerly Tentang KKNT Section) */}
        <section className="py-20 px-4 md:px-10 bg-gradient-to-br from-blue-50 to-slate-100" id="pelaksanaan-multi-1">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Pelaksanaan Multi 1: Pemberdayaan UMKM Desa melalui Teknologi dan Inovasi Digital
            </motion.h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
              Program kerja Multi 1 kami berfokus pada peningkatan kapasitas UMKM di desa melalui pemanfaatan teknologi
              digital dan inovasi. Kegiatan yang telah kami laksanakan meliputi sosialisasi, pelatihan, dan pendampingan
              langsung kepada pelaku UMKM, khususnya ibu-ibu di RT 03 RW 01 Kelurahan Plamongsari, untuk membantu mereka
              mengembangkan usaha di era digital.
            </p>

            {/* Sistem Pendataan UMKM Subsection */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Sistem Pendataan UMKM Digital</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-left"
                >
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Kami telah mengembangkan sistem pendataan UMKM berbasis website untuk memudahkan pengelolaan data
                    usaha mikro, kecil, dan menengah di wilayah kami. Sistem ini memungkinkan pendaftaran UMKM,
                    pemantauan laporan kegiatan, serta analisis statistik untuk mendukung pengembangan UMKM lokal.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#e63946] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">Pendaftaran UMKM yang mudah dan terintegrasi</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#e63946] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">Pemantauan laporan kegiatan secara real-time</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#e63946] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">Analisis statistik untuk pengembangan UMKM</p>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="bg-[#e63946] hover:bg-[#d62839] text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="https://pendataanumkmkel5undip.netlify.app/" target="_blank" rel="noopener noreferrer">
                      Kunjungi Sistem Pendataan UMKM
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-center"
                >
                  <Image
                    src="/images/umkm-system-preview-new.png"
                    alt="Preview Sistem Pendataan UMKM Digital"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-lg w-full h-auto object-cover border border-gray-200"
                  />
                </motion.div>
              </div>
            </div>

            {/* Sosialisasi Pelaku UMKM Section */}
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Sosialisasi Pelaku UMKM</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {umkmSocializationActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  variants={fadeInAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  custom={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-4 text-left h-full flex flex-col justify-between overflow-hidden">
                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                      <ImageWithBlur
                        src={activity.src || "/placeholder.svg"}
                        alt={activity.title}
                        width={300}
                        height={160}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{activity.title}</h3>
                    <p className="text-gray-600 text-sm">{activity.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pendataan Digital & Pembukuan UMKM - New Structure */}
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Pendataan Digital & Pembukuan UMKM</h3>
            {umkmData.map((group, groupIndex) => (
              <div key={`rw-${groupIndex}`} className="mb-12">
                <h4 className="text-2xl font-bold text-gray-800 mb-6">UMKM di RW {group.rw}</h4>
                <div className="grid grid-cols-1 gap-8">
                  {" "}
                  {/* Changed from md:grid-cols-2 to grid-cols-1 */}
                  {group.umkms.map((umkm, umkmIndex) => (
                    <motion.div
                      key={`umkm-${groupIndex}-${umkmIndex}`}
                      variants={fadeInAnimationVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      custom={umkmIndex}
                      className="text-left"
                    >
                      <Card className="p-6 h-full flex flex-col justify-between shadow-md rounded-xl bg-white">
                        <h5 className="text-xl font-semibold text-gray-900 mb-4">{umkm.name}</h5>
                        {umkm.activities.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {" "}
                            {/* This grid is for activities within each UMKM */}
                            {umkm.activities.map((activity, activityIndex) => (
                              <div key={`activity-${groupIndex}-${umkmIndex}-${activityIndex}`}>
                                {activity.type === "image" ? (
                                  <Image
                                    src={activity.src || "/placeholder.svg"}
                                    alt={activity.title}
                                    width={300}
                                    height={200}
                                    className="rounded-lg object-cover w-full h-auto"
                                  />
                                ) : (
                                  <Card
                                    className="overflow-hidden rounded-lg shadow-sm cursor-pointer"
                                    onClick={() => handleVideoCardClick(activity)}
                                  >
                                    <CardContent className="p-0 relative h-40">
                                      <ImageWithBlur
                                        src={activity.thumbnail || "/placeholder.svg"}
                                        alt={`Thumbnail ${activity.title}`}
                                        width={300}
                                        height={160}
                                      />
                                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <PlayCircle className="h-12 w-12 text-white/80" />
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                                <p className="text-sm text-gray-600 mt-2">{activity.title}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            Foto dan video kegiatan untuk UMKM ini akan segera ditambahkan.
                          </p>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Luaran Kegiatan Kami Section */}
        <section className="py-20 px-4 md:px-10 bg-gradient-to-br from-slate-100 to-blue-50" id="luaran-kegiatan">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Luaran Kegiatan Kami
            </motion.h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Input
                type="text"
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e63946] focus:border-[#e63946]"
              />
              <Select onValueChange={(value) => setSelectedAuthor(value === "all" ? null : value)}>
                <SelectTrigger className="w-full sm:w-[200px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e63946] focus:border-[#e63946]">
                  <SelectValue placeholder="Filter Penulis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Penulis</SelectItem>
                  {uniqueAuthors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {filteredOutputActivities.length > 0 ? (
                filteredOutputActivities.map((article, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInAnimationVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    custom={index}
                  >
                    <Card className="p-8 shadow-lg rounded-xl bg-white text-left">
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Oleh: {article.author} | Tanggal: {article.date}
                      </p>
                      <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </Card>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-600 text-lg">Tidak ada artikel yang cocok dengan kriteria pencarian Anda.</p>
              )}
            </div>
          </div>
        </section>

        {/* Anggota Kelompok Section */}
        <section className="py-20 px-4 md:px-10 bg-gradient-to-br from-blue-50 to-indigo-50" id="anggota-kelompok">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Anggota Kelompok Kami
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {members.map((member, index) => (
                <motion.div
                  key={index}
                  variants={fadeInAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  custom={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-4 text-center h-full flex flex-col items-center justify-start">
                    <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-gray-200">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        layout="fill"
                        objectFit="cover"
                        className="object-top"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-gray-700">{member.faculty}</p>
                    <p className="text-sm text-gray-600 mb-2">{member.major}</p>
                    <p className="text-xs text-gray-500">NIM: {member.nim}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">KKNT Kelompok 5</h3>
            <p className="text-sm">Mengabdi untuk negeri, membangun desa, mengembangkan potensi.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#beranda" className="hover:text-[#e63946]">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="#laporan-kegiatan" className="hover:text-[#e63946]">
                  Laporan Kegiatan
                </Link>
              </li>
              <li>
                <Link href="#profil-kelompok" className="hover:text-[#e63946]">
                  Profil Kelompok
                </Link>
              </li>
              <li>
                <Link href="#pelaksanaan-multi-1" className="hover:text-[#e63946]">
                  Pelaksanaan Multi 1
                </Link>
              </li>
              <li>
                <Link href="#luaran-kegiatan" className="hover:text-[#e63946]">
                  Luaran Kegiatan
                </Link>
              </li>
              <li>
                <Link href="#anggota-kelompok" className="hover:text-[#e63946]">
                  Anggota Kelompok
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-[#e63946]">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#e63946]">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} KKNT Kelompok 5. Hak Cipta Dilindungi.
        </div>
      </footer>

      {/* Dialog for Report Details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-lg">
          {selectedReport && (
            <div className="flex flex-col">
              <div className="relative w-full h-64">
                <Image
                  src={selectedReport.image || "/placeholder.svg"}
                  alt={selectedReport.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-2">{selectedReport.title}</DialogTitle>
                  <DialogDescription className="text-gray-600 mb-4">{selectedReport.subtitle}</DialogDescription>
                </DialogHeader>
                <p className="text-gray-700 leading-relaxed">{selectedReport.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Video Playback */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-lg">
          {selectedVideo && (
            <div className="flex flex-col">
              <div className="relative w-full h-[500px] bg-black">
                <video
                  src={selectedVideo.src}
                  controls
                  autoPlay // Autoplay the video when dialog opens
                  className="w-full h-full object-contain" // Maintain aspect ratio
                  preload="auto" // Preload the entire video
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-2">{selectedVideo.title}</DialogTitle>
                  <DialogDescription className="text-gray-600 mb-4">{selectedVideo.description}</DialogDescription>
                </DialogHeader>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
