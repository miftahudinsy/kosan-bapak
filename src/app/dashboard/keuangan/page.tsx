"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ArcElement,
  TooltipItem,
} from "chart.js";
import {
  FaArrowLeft,
  FaTrash,
  FaPlus,
  FaMoneyBillWave,
  FaCalculator,
} from "react-icons/fa";
import {
  getRiwayatPembayaran,
  getDaftarPenghuni,
  formatCurrency,
  hapusRiwayatPembayaran,
  getRiwayatPengeluaran,
  tambahRiwayatPengeluaran,
  hapusRiwayatPengeluaran,
  RiwayatPengeluaran,
  PenghuniData,
  getDaftarPenghuniLama,
} from "../data";
import { RiwayatPembayaran } from "../data";
import dynamic from "next/dynamic";

// Dynamic imports untuk chart components
const LineDynamic = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Line),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
        Loading chart...
      </div>
    ),
  }
);

const PieDynamic = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Pie),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
        Loading chart...
      </div>
    ),
  }
);

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Keuangan = () => {
  const router = useRouter();
  const [riwayatPembayaran, setRiwayatPembayaran] = useState<
    RiwayatPembayaran[]
  >([]);
  const [riwayatPengeluaran, setRiwayatPengeluaran] = useState<
    RiwayatPengeluaran[]
  >([]);
  const [penghuni, setPenghuni] = useState<PenghuniData[]>([]);
  const [penghuniLama, setPenghuniLama] = useState<PenghuniData[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pembayaranToDelete, setPembayaranToDelete] =
    useState<RiwayatPembayaran | null>(null);
  const [isDeletePengeluaranModalOpen, setIsDeletePengeluaranModalOpen] =
    useState(false);
  const [pengeluaranToDelete, setPengeluaranToDelete] =
    useState<RiwayatPengeluaran | null>(null);
  const [isPengeluaranModalOpen, setIsPengeluaranModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pemasukan" | "pengeluaran">(
    "pemasukan"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    deskripsi: "",
    jenis: "",
    jenisLainnya: "",
    tanggal: "",
    nominal: "",
  });
  const [statistik, setStatistik] = useState({
    totalPemasukanBulanIni: 0,
    totalPengeluaranBulanIni: 0,
    persentasePerubahanPemasukan: 0,
    persentasePerubahanPengeluaran: 0,
    estimasiPendapatanBulanan: 0,
    estimasiBiayaOperasional: 0,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [
      {
        label: "Pemasukan",
        data: [],
        borderColor: "#10B981", // Emerald 500
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: "#10B981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Pengeluaran",
        data: [],
        borderColor: "#EF4444", // Red 500
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: "#EF4444",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  });

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
          color: "#6B7280",
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#111827",
        bodyColor: "#4B5563",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function (tooltipItem: TooltipItem<"line">): string {
            const label = tooltipItem.dataset.label || "";
            const value = tooltipItem.raw as number;
            return `${label}: ${formatStatisticCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#F3F4F6",
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          callback: function (value: number | string): string {
            return formatStatisticCurrency(value);
          },
        },
      },
    },
  };

  const [pieChartData, setPieChartData] = useState<ChartData<"pie">>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#10B981", // Emerald
          "#3B82F6", // Blue
          "#F59E0B", // Amber
          "#EF4444", // Red
          "#8B5CF6", // Purple
          "#EC4899", // Pink
          "#6366F1", // Indigo
          "#14B8A6", // Teal
        ],
        borderWidth: 1,
      },
    ],
  });

  const pieChartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          font: {
            size: 12,
          },
          color: "#6B7280",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#111827",
        bodyColor: "#4B5563",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function (tooltipItem: TooltipItem<"pie">): string {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw as number;
            return `${label}: ${formatStatisticCurrency(value)}`;
          },
        },
      },
    },
  };

  // Format currency khusus untuk statistik dan grafik
  const formatStatisticCurrency = (amount: number | string): string => {
    if (typeof amount === "string") {
      amount = parseInt(amount.replace(/\D/g, ""), 10);
    }
    if (isNaN(amount)) {
      return "Rp0,-";
    }
    // Membulatkan ke ribuan terdekat
    const roundedAmount = Math.round(amount / 1000) * 1000;
    return `Rp${roundedAmount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`;
  };

  // Load initial data
  useEffect(() => {
    const dataPembayaran = getRiwayatPembayaran();
    const dataPengeluaran = getRiwayatPengeluaran();
    const dataPenghuni = getDaftarPenghuni();
    const dataPenghuniLama = getDaftarPenghuniLama();
    setRiwayatPembayaran(dataPembayaran);
    setRiwayatPengeluaran(dataPengeluaran);
    setPenghuni(dataPenghuni);
    setPenghuniLama(dataPenghuniLama);
  }, []);

  // Helper function untuk memastikan nilai numerik valid
  const ensureNumber = (value: string | number): number => {
    if (typeof value === "string") {
      // Hapus semua karakter non-numerik
      const numericValue = value.replace(/\D/g, "");
      return parseInt(numericValue, 10) || 0;
    }
    return value || 0;
  };

  // Calculate statistics when data changes
  useEffect(() => {
    if (riwayatPembayaran.length === 0 && riwayatPengeluaran.length === 0)
      return;

    const bulanIni = new Date().getMonth();
    const tahunIni = new Date().getFullYear();

    // Total Pemasukan Bulan Ini
    const totalPemasukanBulanIni = riwayatPembayaran
      .filter(
        (p) =>
          new Date(p.tanggal).getMonth() === bulanIni &&
          new Date(p.tanggal).getFullYear() === tahunIni
      )
      .reduce((sum, p) => sum + ensureNumber(p.nominal), 0);

    // Total Pengeluaran Bulan Ini
    const totalPengeluaranBulanIni = riwayatPengeluaran
      .filter(
        (p) =>
          new Date(p.tanggal).getMonth() === bulanIni &&
          new Date(p.tanggal).getFullYear() === tahunIni
      )
      .reduce((sum, p) => sum + ensureNumber(p.nominal), 0);

    // Persentase Perubahan
    const totalPemasukanBulanLalu = riwayatPembayaran
      .filter(
        (p) =>
          new Date(p.tanggal).getMonth() === bulanIni - 1 &&
          new Date(p.tanggal).getFullYear() === tahunIni
      )
      .reduce((sum, p) => sum + ensureNumber(p.nominal), 0);

    const totalPengeluaranBulanLalu = riwayatPengeluaran
      .filter(
        (p) =>
          new Date(p.tanggal).getMonth() === bulanIni - 1 &&
          new Date(p.tanggal).getFullYear() === tahunIni
      )
      .reduce((sum, p) => sum + ensureNumber(p.nominal), 0);

    const persentasePerubahanPemasukan =
      totalPemasukanBulanLalu > 0
        ? ((totalPemasukanBulanIni - totalPemasukanBulanLalu) /
            totalPemasukanBulanLalu) *
          100
        : 0;

    const persentasePerubahanPengeluaran =
      totalPengeluaranBulanLalu > 0
        ? ((totalPengeluaranBulanIni - totalPengeluaranBulanLalu) /
            totalPengeluaranBulanLalu) *
          100
        : 0;

    // Estimasi Pendapatan Bulanan
    const kamarTerisi = penghuni.filter((p) => {
      const tanggalSelesai = new Date(p.tanggalSelesai);
      const sekarang = new Date();
      return tanggalSelesai > sekarang;
    });

    const estimasiPendapatanBulanan = kamarTerisi.reduce((total, p) => {
      const pembayaranAwal =
        riwayatPembayaran
          .filter(
            (rp) => rp.idPenghuni === p.id && rp.jenis === "Pembayaran Awal"
          )
          .map((rp) => ensureNumber(rp.nominal))
          .pop() || 0;
      return total + pembayaranAwal;
    }, 0);

    // Estimasi Biaya Operasional
    const rataRataPengeluaranBulanan =
      Array.from({ length: 3 }, (_, i) => {
        const targetBulan = new Date(tahunIni, bulanIni - 1 - i, 1);
        return riwayatPengeluaran
          .filter(
            (p) =>
              new Date(p.tanggal).getMonth() === targetBulan.getMonth() &&
              new Date(p.tanggal).getFullYear() === targetBulan.getFullYear()
          )
          .reduce((sum, p) => sum + ensureNumber(p.nominal), 0);
      }).reduce((total, monthlyTotal) => total + monthlyTotal, 0) / 3;

    setStatistik({
      totalPemasukanBulanIni,
      totalPengeluaranBulanIni,
      persentasePerubahanPemasukan: isNaN(persentasePerubahanPemasukan)
        ? 0
        : persentasePerubahanPemasukan,
      persentasePerubahanPengeluaran: isNaN(persentasePerubahanPengeluaran)
        ? 0
        : persentasePerubahanPengeluaran,
      estimasiPendapatanBulanan,
      estimasiBiayaOperasional: rataRataPengeluaranBulanan,
    });
  }, [riwayatPembayaran, riwayatPengeluaran, penghuni]);

  // Process data for chart
  useEffect(() => {
    const bulanIni = new Date().getMonth();
    const tahunIni = new Date().getFullYear();

    // Get last 6 months
    const labels = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(tahunIni, bulanIni - i, 1);
      return date.toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      });
    }).reverse();

    // Calculate monthly totals
    const monthlyData = labels.map((_, index) => {
      const targetMonth = new Date(tahunIni, bulanIni - (5 - index), 1);
      const targetMonthEnd = new Date(tahunIni, bulanIni - (5 - index) + 1, 0);

      const pemasukanBulanan = riwayatPembayaran
        .filter((p) => {
          const tanggalPembayaran = new Date(p.tanggal);
          return (
            tanggalPembayaran >= targetMonth &&
            tanggalPembayaran <= targetMonthEnd
          );
        })
        .reduce((sum, p) => sum + ensureNumber(p.nominal), 0);

      const pengeluaranBulanan = riwayatPengeluaran
        .filter((p) => {
          const tanggalPengeluaran = new Date(p.tanggal);
          return (
            tanggalPengeluaran >= targetMonth &&
            tanggalPengeluaran <= targetMonthEnd
          );
        })
        .reduce((sum, p) => sum + ensureNumber(p.nominal), 0);

      return { pemasukan: pemasukanBulanan, pengeluaran: pengeluaranBulanan };
    });

    setChartData({
      labels,
      datasets: [
        {
          label: "Pemasukan",
          data: monthlyData.map((d) => d.pemasukan),
          borderColor: "#10B981", // Emerald 500
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.3,
          borderWidth: 2,
          pointBackgroundColor: "#10B981",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Pengeluaran",
          data: monthlyData.map((d) => d.pengeluaran),
          borderColor: "#EF4444", // Red 500
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.3,
          borderWidth: 2,
          pointBackgroundColor: "#EF4444",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    });
  }, [riwayatPembayaran, riwayatPengeluaran]);

  // Tambahkan useEffect untuk mengupdate pie chart
  useEffect(() => {
    if (riwayatPengeluaran.length === 0) return;

    const bulanIni = new Date().getMonth();
    const tahunIni = new Date().getFullYear();

    // Filter pengeluaran bulan ini
    const pengeluaranBulanIni = riwayatPengeluaran.filter((p) => {
      const tanggal = new Date(p.tanggal);
      return (
        tanggal.getMonth() === bulanIni && tanggal.getFullYear() === tahunIni
      );
    });

    // Hitung total per kategori
    const kategoriTotal = pengeluaranBulanIni.reduce((acc, curr) => {
      const nominal =
        typeof curr.nominal === "string"
          ? parseInt(curr.nominal.replace(/\D/g, ""))
          : curr.nominal;
      acc[curr.jenis] = (acc[curr.jenis] || 0) + nominal;
      return acc;
    }, {} as Record<string, number>);

    // Siapkan data untuk pie chart
    const labels = Object.keys(kategoriTotal);
    const data = Object.values(kategoriTotal);

    setPieChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#10B981", // Emerald
            "#3B82F6", // Blue
            "#F59E0B", // Amber
            "#EF4444", // Red
            "#8B5CF6", // Purple
            "#EC4899", // Pink
            "#6366F1", // Indigo
            "#14B8A6", // Teal
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [riwayatPengeluaran]);

  // Fungsi untuk mendapatkan data pembayaran yang akan ditampilkan
  const getCurrentPagePembayaran = (): RiwayatPembayaran[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return riwayatPembayaran.slice(startIndex, startIndex + itemsPerPage);
  };

  // Fungsi untuk mendapatkan data pengeluaran yang akan ditampilkan
  const getCurrentPagePengeluaran = (): RiwayatPengeluaran[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return riwayatPengeluaran.slice(startIndex, startIndex + itemsPerPage);
  };

  // Fungsi untuk menghitung total halaman pembayaran
  const getTotalPagesPembayaran = (): number => {
    return Math.ceil(riwayatPembayaran.length / itemsPerPage);
  };

  // Fungsi untuk menghitung total halaman pengeluaran
  const getTotalPagesPengeluaran = (): number => {
    return Math.ceil(riwayatPengeluaran.length / itemsPerPage);
  };

  // Reset halaman saat tab berubah
  const handleTabChange = (tab: "pemasukan" | "pengeluaran") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleBack = () => {
    router.back();
  };

  const handleDeleteClick = (pembayaran: RiwayatPembayaran) => {
    setPembayaranToDelete(pembayaran);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (pembayaranToDelete) {
      const updatedData = hapusRiwayatPembayaran(pembayaranToDelete.id);
      setRiwayatPembayaran(updatedData);
      setIsDeleteModalOpen(false);
      setPembayaranToDelete(null);
    }
  };

  const handleTambahPengeluaranClick = () => {
    setIsPengeluaranModalOpen(true);
  };

  const handleClosePengeluaranModal = () => {
    setIsPengeluaranModalOpen(false);
    setFormData({
      deskripsi: "",
      jenis: "",
      jenisLainnya: "",
      tanggal: "",
      nominal: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPengeluaran = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = tambahRiwayatPengeluaran({
      ...formData,
      jenis:
        formData.jenis === "Lainnya" ? formData.jenisLainnya : formData.jenis,
      nominal: formatCurrency(formData.nominal),
    });
    setRiwayatPengeluaran(updatedData);
    handleClosePengeluaranModal();

    // Tampilkan notifikasi
    setToastMessage("Berhasil menyimpan pengeluaran baru");
    setShowToast(true);

    // Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const getNamaPenghuni = (idPenghuni: number) => {
    const penghuniData = penghuni.find((p) => p.id === idPenghuni);
    if (penghuniData) return penghuniData.nama;

    const penghuniLamaData = penghuniLama.find((p) => p.id === idPenghuni);
    return penghuniLamaData ? penghuniLamaData.nama : "Tidak ditemukan";
  };

  const handleDeletePengeluaranClick = (pengeluaran: RiwayatPengeluaran) => {
    setPengeluaranToDelete(pengeluaran);
    setIsDeletePengeluaranModalOpen(true);
  };

  const handleDeletePengeluaran = () => {
    if (pengeluaranToDelete) {
      const updatedData = hapusRiwayatPengeluaran(pengeluaranToDelete.id);
      setRiwayatPengeluaran(updatedData);
      setIsDeletePengeluaranModalOpen(false);
      setPengeluaranToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50 animate-fade-in-down">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-lg font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md mb-8"
        >
          <FaArrowLeft /> Kembali
        </button>

        {/* Statistik Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-green-50 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FaMoneyBillWave className="text-green-500" />
              <h3 className="text-sm font-medium text-gray-600">
                Total Pemasukan Bulan Ini
              </h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatStatisticCurrency(statistik.totalPemasukanBulanIni)}
            </p>
            <p
              className={`text-sm ${
                statistik.persentasePerubahanPemasukan >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {statistik.persentasePerubahanPemasukan >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(statistik.persentasePerubahanPemasukan).toFixed(1)}%
              dari bulan lalu
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FaMoneyBillWave className="text-red-500" />
              <h3 className="text-sm font-medium text-gray-600">
                Total Pengeluaran Bulan Ini
              </h3>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {formatStatisticCurrency(statistik.totalPengeluaranBulanIni)}
            </p>
            <p
              className={`text-sm ${
                statistik.persentasePerubahanPengeluaran >= 0
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {statistik.persentasePerubahanPengeluaran >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(statistik.persentasePerubahanPengeluaran).toFixed(1)}%
              dari bulan lalu
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FaCalculator className="text-blue-500" />
              <h3 className="text-sm font-medium text-gray-600">
                Estimasi Pendapatan Bulanan
              </h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {formatStatisticCurrency(statistik.estimasiPendapatanBulanan)}
            </p>
            <p className="text-sm text-gray-500">Berdasarkan kamar terisi</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FaCalculator className="text-purple-500" />
              <h3 className="text-sm font-medium text-gray-600">
                Estimasi Biaya Operasional
              </h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {formatStatisticCurrency(statistik.estimasiBiayaOperasional)}
            </p>
            <p className="text-sm text-gray-500">
              Berdasarkan rata-rata 3 bulan terakhir
            </p>
          </div>
        </div>

        {/* Grafik Tren */}
        <div className="bg-white rounded-2xl shadow-sm mb-10 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Tren Keuangan</h2>
            <p className="text-base text-gray-500 mt-1">
              Perbandingan pemasukan dan pengeluaran 6 bulan terakhir
            </p>
          </div>
          <div className="p-6">
            <div className="h-[300px] sm:h-[400px]">
              <LineDynamic options={chartOptions} data={chartData} />
            </div>
          </div>
        </div>

        {/* Pie Chart Kategori Pengeluaran */}
        <div className="bg-white rounded-2xl shadow-sm mb-10 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              Kategori Pengeluaran Bulan Ini
            </h2>
            <p className="text-base text-gray-500 mt-1">
              Distribusi pengeluaran berdasarkan kategori
            </p>
          </div>
          <div className="p-6">
            <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
              {pieChartData.labels?.length === 0 ? (
                <p className="text-gray-500 text-center">
                  Belum ada data pengeluaran untuk bulan ini
                </p>
              ) : (
                <div className="w-full h-full max-w-2xl mx-auto">
                  <PieDynamic data={pieChartData} options={pieChartOptions} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8 sm:mb-4">
          <div className="flex space-x-2 bg-blue-50 p-1.5 rounded-full">
            <button
              onClick={() => handleTabChange("pemasukan")}
              className={`px-4 py-3 rounded-full font-semibold transition-all ${
                activeTab === "pemasukan"
                  ? "bg-white text-black shadow-md"
                  : "text-gray-600"
              }`}
            >
              Pemasukan
            </button>
            <button
              onClick={() => handleTabChange("pengeluaran")}
              className={`px-4 py-3 rounded-full font-semibold transition-all ${
                activeTab === "pengeluaran"
                  ? "bg-white text-black shadow-md"
                  : "text-gray-600"
              }`}
            >
              Pengeluaran
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          {activeTab === "pemasukan" ? "Pemasukan Kos" : "Pengeluaran Kos"}
        </h1>

        {activeTab === "pemasukan" ? (
          <>
            {riwayatPembayaran.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  Belum ada data pemasukan
                </p>
              </div>
            ) : (
              <>
                {/* Tampilan Desktop Pemasukan */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Penghuni
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jenis Pembayaran
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nominal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getCurrentPagePembayaran().map((pembayaran) => (
                        <tr key={pembayaran.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(pembayaran.tanggal)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getNamaPenghuni(pembayaran.idPenghuni)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pembayaran.jenis}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                            {formatCurrency(pembayaran.nominal)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleDeleteClick(pembayaran)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination Controls */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sebelumnya
                    </button>
                    <span className="text-gray-600">
                      Halaman {currentPage} dari {getTotalPagesPembayaran()}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, getTotalPagesPembayaran())
                        )
                      }
                      disabled={currentPage === getTotalPagesPembayaran()}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>

                {/* Tampilan Mobile Pemasukan */}
                <div className="md:hidden space-y-4">
                  {getCurrentPagePembayaran().map((pembayaran) => (
                    <div
                      key={pembayaran.id}
                      className="bg-white border border-gray-200 border-l-4 border-l-blue-500 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-base text-gray-500">Tanggal</p>
                          <p className="text-base font-medium text-gray-900">
                            {formatDate(pembayaran.tanggal)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(pembayaran)}
                          className="text-red-600 hover:text-red-900 p-2"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-base text-gray-500">
                            Nama Penghuni
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {getNamaPenghuni(pembayaran.idPenghuni)}
                          </p>
                        </div>
                        <div>
                          <p className="text-base text-gray-500">
                            Jenis Pembayaran
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {pembayaran.jenis}
                          </p>
                        </div>
                        <div>
                          <p className="text-base text-gray-500">Nominal</p>
                          <p className="text-base font-semibold text-green-600">
                            {formatCurrency(pembayaran.nominal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Pagination Controls for Mobile */}
                  <div className="flex flex-col items-center gap-4 mt-4">
                    <span className="text-gray-600 text-center">
                      Halaman {currentPage} dari {getTotalPagesPembayaran()}
                    </span>
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sebelumnya
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, getTotalPagesPembayaran())
                          )
                        }
                        disabled={currentPage === getTotalPagesPembayaran()}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={handleTambahPengeluaranClick}
                className="flex items-center justify-center w-full gap-2 bg-blue-100 hover:bg-blue-200 p-4 py-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 text-gray-500 font-bold"
              >
                <FaPlus className="text-blue-600" /> Tambah Pengeluaran Baru
              </button>
            </div>

            {riwayatPengeluaran.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  Belum ada data pengeluaran, silakan tambahkan pengeluaran baru
                </p>
              </div>
            ) : (
              <>
                {/* Tampilan Desktop Pengeluaran */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deskripsi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jenis
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nominal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getCurrentPagePengeluaran().map((pengeluaran) => (
                        <tr key={pengeluaran.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(pengeluaran.tanggal)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pengeluaran.deskripsi}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pengeluaran.jenis}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                            {formatCurrency(pengeluaran.nominal)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() =>
                                handleDeletePengeluaranClick(pengeluaran)
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination Controls */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sebelumnya
                    </button>
                    <span className="text-gray-600">
                      Halaman {currentPage} dari {getTotalPagesPengeluaran()}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, getTotalPagesPengeluaran())
                        )
                      }
                      disabled={currentPage === getTotalPagesPengeluaran()}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>

                {/* Tampilan Mobile Pengeluaran */}
                <div className="md:hidden space-y-4">
                  {getCurrentPagePengeluaran().map((pengeluaran) => (
                    <div
                      key={pengeluaran.id}
                      className="bg-white border border-gray-200 border-l-4 border-l-red-500 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-base text-gray-500">Tanggal</p>
                          <p className="text-base font-medium text-gray-900">
                            {formatDate(pengeluaran.tanggal)}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleDeletePengeluaranClick(pengeluaran)
                          }
                          className="text-red-600 hover:text-red-900 p-2"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-base text-gray-500">Deskripsi</p>
                          <p className="text-base font-medium text-gray-900">
                            {pengeluaran.deskripsi}
                          </p>
                        </div>
                        <div>
                          <p className="text-base text-gray-500">Jenis</p>
                          <p className="text-base font-medium text-gray-900">
                            {pengeluaran.jenis}
                          </p>
                        </div>
                        <div>
                          <p className="text-base text-gray-500">Nominal</p>
                          <p className="text-base font-semibold text-red-600">
                            {formatCurrency(pengeluaran.nominal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Pagination Controls for Mobile */}
                  <div className="flex flex-col items-center gap-4 mt-4">
                    <span className="text-gray-600 text-center">
                      Halaman {currentPage} dari {getTotalPagesPengeluaran()}
                    </span>
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sebelumnya
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, getTotalPagesPengeluaran())
                          )
                        }
                        disabled={currentPage === getTotalPagesPengeluaran()}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Modal Konfirmasi Hapus Pemasukan */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus riwayat pembayaran ini? Tindakan
              ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-4 rounded-lg"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPembayaranToDelete(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Pengeluaran */}
      {isPengeluaranModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-md w-full mx-4">
            <button
              onClick={handleClosePengeluaranModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Tambah Pengeluaran
            </h2>
            <form onSubmit={handleSubmitPengeluaran} className="space-y-4">
              <div>
                <label
                  htmlFor="deskripsi"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Deskripsi Pengeluaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Contoh: Pembayaran Listrik Bulan Januari"
                />
              </div>

              <div>
                <label
                  htmlFor="jenis"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Jenis Pengeluaran <span className="text-red-500">*</span>
                </label>
                <select
                  id="jenis"
                  name="jenis"
                  value={formData.jenis}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Jenis</option>
                  <option value="Listrik">Listrik</option>
                  <option value="Air">Air</option>
                  <option value="Wifi">Wifi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {formData.jenis === "Lainnya" && (
                <div>
                  <label
                    htmlFor="jenisLainnya"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Jenis Lainnya <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="jenisLainnya"
                    name="jenisLainnya"
                    value={formData.jenisLainnya || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Masukkan jenis pengeluaran"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="tanggal"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Tanggal Pengeluaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="tanggal"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="nominal"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Nominal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nominal"
                  name="nominal"
                  value={formData.nominal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Contoh: 300.000"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg"
              >
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Pengeluaran */}
      {isDeletePengeluaranModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus riwayat pengeluaran ini?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeletePengeluaran}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-4 rounded-lg"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => {
                  setIsDeletePengeluaranModalOpen(false);
                  setPengeluaranToDelete(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Keuangan;
