"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaTrash,
  FaPlus,
  FaMoneyBillWave,
  FaCalculator,
} from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import {
  getRiwayatPembayaran,
  getDaftarPenghuni,
  formatCurrency,
  hapusRiwayatPembayaran,
  getRiwayatPengeluaran,
  tambahRiwayatPengeluaran,
  hapusRiwayatPengeluaran,
  PenghuniData,
  getDaftarPenghuniLama,
} from "../data";
import dynamic from "next/dynamic";

const TrendChart = dynamic(() => import("./TrendChart"), {
  ssr: false,
});

const ExpensePieChart = dynamic(() => import("./PieChart"), {
  ssr: false,
});

// Interface untuk data dari Supabase
interface SupabaseDataItem {
  id: string | number;
  kos_id: string | number;
  tanggal: string;
  jumlah: number;
  kategori: string;
  keterangan?: string;
  deskripsi?: string;
  jenis: string;
  penghuni_id?: string | number;
}

// Interface untuk data yang ditampilkan di aplikasi
interface RiwayatPembayaran {
  id: string | number;
  penghuni_id: string;
  tanggal: string;
  nominal: string;
  jumlah: number;
  jenis: string;
  kategori: string;
  keterangan?: string;
  deskripsi?: string;
  kos_id?: string | number;
}

interface RiwayatPengeluaran {
  id: string | number;
  tanggal: string;
  nominal: string;
  jumlah: number;
  deskripsi: string;
  jenis: string;
  kategori: string;
  keterangan?: string;
  kos_id?: string | number;
}

interface SupabasePenghuniItem {
  id: string | number;
  kos_id: string | number;
  nama: string;
  nomor_kamar: string;
  nomor_hp: string;
  nomor_ktp: string;
  kontak_darurat: string;
  deposit: number | string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

const Keuangan = () => {
  const router = useRouter();
  const supabase = createClient();
  const [riwayatPembayaran, setRiwayatPembayaran] = useState<
    RiwayatPembayaran[]
  >([]);
  const [riwayatPengeluaran, setRiwayatPengeluaran] = useState<
    RiwayatPengeluaran[]
  >([]);
  const [penghuni, setPenghuni] = useState<SupabasePenghuniItem[]>([]);
  const [penghuniLama, setPenghuniLama] = useState<SupabasePenghuniItem[]>([]);
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
  const [tanggalDisplay, setTanggalDisplay] = useState("");
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
  const [chartData, setChartData] = useState<
    Array<{
      name: string;
      pemasukan: number;
      pengeluaran: number;
    }>
  >([]);
  const [pieChartData, setPieChartData] = useState<
    Array<{ name: string; value: number }>
  >([]);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Dapatkan kos_id user
        const { data: kosData, error: kosError } = await supabase
          .from("kos")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (kosError || !kosData) {
          console.error("Error fetching kos:", kosError);
          return;
        }

        // Ambil data pembayaran (pemasukan)
        const { data: pembayaranData, error: pembayaranError } = await supabase
          .from("keuangan")
          .select("*")
          .eq("kos_id", kosData.id)
          .eq("jenis", "pemasukan");

        if (pembayaranError) {
          console.error("Error fetching pembayaran:", pembayaranError);
        } else {
          // Format data pembayaran untuk state
          const formattedPembayaran = pembayaranData.map(
            (item: SupabaseDataItem) => ({
              id: item.id,
              penghuni_id: item.penghuni_id?.toString() || "",
              tanggal: item.tanggal,
              nominal: item.jumlah.toString(),
              jumlah: item.jumlah,
              jenis: item.kategori,
              kategori: item.kategori,
              keterangan: item.keterangan || "",
              deskripsi: item.deskripsi || "",
              kos_id: item.kos_id,
            })
          );
          setRiwayatPembayaran(formattedPembayaran);
        }

        // Ambil data pengeluaran
        const { data: pengeluaranData, error: pengeluaranError } =
          await supabase
            .from("keuangan")
            .select("*")
            .eq("kos_id", kosData.id)
            .eq("jenis", "pengeluaran");

        if (pengeluaranError) {
          console.error("Error fetching pengeluaran:", pengeluaranError);
        } else {
          // Format data pengeluaran untuk state
          const formattedPengeluaran = pengeluaranData.map(
            (item: SupabaseDataItem) => ({
              id: item.id,
              tanggal: item.tanggal,
              nominal: item.jumlah.toString(),
              jumlah: item.jumlah,
              deskripsi: item.deskripsi || "",
              jenis: item.kategori,
              kategori: item.kategori,
              keterangan: item.keterangan || "",
              kos_id: item.kos_id,
            })
          );
          setRiwayatPengeluaran(formattedPengeluaran);
        }

        // Ambil data penghuni aktif
        const { data: penghuniData, error: penghuniError } = await supabase
          .from("penghuni")
          .select("*")
          .eq("kos_id", kosData.id)
          .eq("status", "aktif");

        if (penghuniError) {
          console.error("Error fetching penghuni:", penghuniError);
        } else {
          // Format data penghuni untuk state
          const formattedPenghuni = penghuniData.map(
            (item: SupabasePenghuniItem) => ({
              ...item,
              id: item.id.toString(),
              kos_id: item.kos_id.toString(),
            })
          );
          setPenghuni(formattedPenghuni);
        }

        // Ambil data penghuni lama
        const { data: penghuniLamaData, error: penghuniLamaError } =
          await supabase
            .from("penghuni")
            .select("*")
            .eq("kos_id", kosData.id)
            .eq("status", "tidak aktif");

        if (penghuniLamaError) {
          console.error("Error fetching penghuni lama:", penghuniLamaError);
        } else {
          // Format data penghuni lama untuk state
          const formattedPenghuniLama = penghuniLamaData.map(
            (item: SupabasePenghuniItem) => ({
              ...item,
              id: item.id.toString(),
              kos_id: item.kos_id.toString(),
            })
          );
          setPenghuniLama(formattedPenghuniLama);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Verifikasi pengguna
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      }
    };

    checkUser();
  }, [router, supabase]);

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
      .reduce((sum, p) => sum + ensureNumber(p.jumlah), 0);

    // Total Pengeluaran Bulan Ini
    const totalPengeluaranBulanIni = riwayatPengeluaran
      .filter(
        (p) =>
          new Date(p.tanggal).getMonth() === bulanIni &&
          new Date(p.tanggal).getFullYear() === tahunIni
      )
      .reduce((sum, p) => sum + ensureNumber(p.jumlah), 0);

    // Persentase Perubahan
    const totalPemasukanBulanLalu = riwayatPembayaran
      .filter(
        (p) =>
          new Date(p.tanggal).getMonth() === bulanIni - 1 &&
          new Date(p.tanggal).getFullYear() === tahunIni
      )
      .reduce((sum, p) => sum + ensureNumber(p.jumlah), 0);

    const totalPengeluaranBulanLalu = riwayatPengeluaran
      .filter(
        (p) =>
          new Date(p.tanggal).getMonth() === bulanIni - 1 &&
          new Date(p.tanggal).getFullYear() === tahunIni
      )
      .reduce((sum, p) => sum + ensureNumber(p.jumlah), 0);

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
      const tanggalSelesai = new Date(p.tanggal_selesai);
      const sekarang = new Date();
      return tanggalSelesai > sekarang;
    });

    const estimasiPendapatanBulanan = kamarTerisi.reduce((total, p) => {
      const pembayaranAwal =
        riwayatPembayaran
          .filter(
            (rp) =>
              rp.penghuni_id === p.id.toString() &&
              rp.kategori === "pembayaran_awal"
          )
          .map((rp) => ensureNumber(rp.jumlah))
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
          .reduce((sum, p) => sum + ensureNumber(p.jumlah), 0);
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
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const targetMonth = new Date(tahunIni, bulanIni - (5 - i), 1);
      const targetMonthEnd = new Date(tahunIni, bulanIni - (5 - i) + 1, 0);

      const pemasukanBulanan = riwayatPembayaran
        .filter((p) => {
          const tanggalPembayaran = new Date(p.tanggal);
          return (
            tanggalPembayaran >= targetMonth &&
            tanggalPembayaran <= targetMonthEnd
          );
        })
        .reduce((sum, p) => sum + ensureNumber(p.jumlah), 0);

      const pengeluaranBulanan = riwayatPengeluaran
        .filter((p) => {
          const tanggalPengeluaran = new Date(p.tanggal);
          return (
            tanggalPengeluaran >= targetMonth &&
            tanggalPengeluaran <= targetMonthEnd
          );
        })
        .reduce((sum, p) => sum + ensureNumber(p.jumlah), 0);

      return {
        name: targetMonth.toLocaleDateString("id-ID", {
          month: "short",
          year: "numeric",
        }),
        pemasukan: pemasukanBulanan,
        pengeluaran: pengeluaranBulanan,
      };
    });

    setChartData(monthlyData);
  }, [riwayatPembayaran, riwayatPengeluaran]);

  // Process data for pie chart
  useEffect(() => {
    if (riwayatPengeluaran.length === 0) return;

    const bulanIni = new Date().getMonth();
    const tahunIni = new Date().getFullYear();

    // Helper function untuk memformat kategori dari snake_case ke Title Case
    const formatCategoryName = (type: string): string => {
      if (!type) return "";
      return type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    // Filter pengeluaran bulan ini
    const pengeluaranBulanIni = riwayatPengeluaran.filter(
      (p) =>
        new Date(p.tanggal).getMonth() === bulanIni &&
        new Date(p.tanggal).getFullYear() === tahunIni
    );

    // Hitung total per kategori
    const totalPerKategori = pengeluaranBulanIni.reduce((acc, curr) => {
      const jenis = curr.kategori;
      const nominal = ensureNumber(curr.jumlah);
      acc[jenis] = (acc[jenis] || 0) + nominal;
      return acc;
    }, {} as Record<string, number>);

    // Transform ke format yang dibutuhkan pie chart
    const chartData = Object.entries(totalPerKategori)
      .map(([name, value]) => ({
        name: formatCategoryName(name), // Gunakan formatCategoryName untuk membuat format Title Case
        value,
      }))
      .sort((a, b) => b.value - a.value); // Urutkan dari terbesar

    setPieChartData(chartData);
  }, [riwayatPengeluaran]);

  // Format currency khusus untuk statistik
  const formatStatisticCurrency = (amount: number | string): string => {
    if (typeof amount === "string") {
      amount = parseInt(amount.replace(/\D/g, ""), 10);
    }
    if (isNaN(amount)) {
      return "Rp0";
    }
    // Membulatkan ke ribuan terdekat
    const roundedAmount = Math.round(amount / 1000) * 1000;
    return `Rp${roundedAmount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  // Helper function untuk memastikan nilai numerik valid
  const ensureNumber = (value: string | number): number => {
    if (typeof value === "string") {
      // Hapus semua karakter non-numerik
      const numericValue = value.replace(/\D/g, "");
      return parseInt(numericValue, 10) || 0;
    }
    return value || 0;
  };

  // Fungsi untuk mendapatkan data pembayaran yang akan ditampilkan
  const getCurrentPagePembayaran = (): RiwayatPembayaran[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const sortedData = [...riwayatPembayaran].sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  };

  // Fungsi untuk mendapatkan data pengeluaran yang akan ditampilkan
  const getCurrentPagePengeluaran = (): RiwayatPengeluaran[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const sortedData = [...riwayatPengeluaran].sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
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

  const handleDelete = async () => {
    if (pembayaranToDelete) {
      try {
        // Hapus data dari Supabase
        const { error } = await supabase
          .from("keuangan")
          .delete()
          .eq("id", pembayaranToDelete.id);

        if (error) {
          console.error("Error saat menghapus pembayaran:", error);
          throw error;
        }

        // Update state
        setRiwayatPembayaran((prev) =>
          prev.filter((p) => p.id !== pembayaranToDelete.id)
        );

        // Tampilkan notifikasi
        setToastMessage("Berhasil menghapus data pembayaran");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        console.error("Error:", error);
        setToastMessage("Gagal menghapus data pembayaran");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }

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
    setTanggalDisplay("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "nominal") {
      // Hapus semua karakter non-numerik
      const numericValue = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue, // Simpan nilai numerik saja di state
      }));
    } else if (name === "tanggal") {
      // Format tampilan tanggal
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setTanggalDisplay(formatDate(value));
      } else {
        setTanggalDisplay("");
      }

      // Simpan nilai ISO untuk dikirim ke server
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmitPengeluaran = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Dapatkan kos_id user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: kosData } = await supabase
        .from("kos")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!kosData) {
        throw new Error("Data kos tidak ditemukan");
      }

      // Persiapkan data untuk disimpan
      let kategori = "";
      let keteranganTambahan = "";

      if (formData.jenis === "Lainnya") {
        if (!formData.jenisLainnya || formData.jenisLainnya.trim() === "") {
          alert("Silakan isi jenis pengeluaran lainnya");
          return;
        }
        // Gunakan 'lainnya' sebagai kategori yang valid di database
        kategori = "lainnya";
        keteranganTambahan = formData.jenisLainnya;
      } else {
        kategori = formData.jenis;
      }

      console.log("Kategori sebelum diproses:", kategori);
      const formattedKategori = kategori.toLowerCase().replace(/ /g, "_");
      console.log("Kategori setelah diproses:", formattedKategori);

      const nominal = parseInt(formData.nominal.replace(/\D/g, ""), 10) || 0;

      // Buat keterangan yang mencakup detail kategori kustom jika ada
      const keterangan = keteranganTambahan
        ? `Pengeluaran ${keteranganTambahan} untuk ${formData.deskripsi}`
        : `Pengeluaran untuk ${formData.deskripsi}`;

      const pengeluaranData = {
        kos_id: kosData.id,
        jenis: "pengeluaran",
        kategori: formattedKategori,
        deskripsi: formData.deskripsi,
        jumlah: nominal,
        tanggal: formData.tanggal,
        keterangan: keterangan,
        status: "aktif",
      };

      console.log("Data pengeluaran yang akan disimpan:", pengeluaranData);

      // Simpan ke Supabase
      const { data: newPengeluaran, error } = await supabase
        .from("keuangan")
        .insert(pengeluaranData)
        .select()
        .single();

      if (error) {
        console.error("Error saat menyimpan pengeluaran:", error);
        throw error;
      }

      // Format data untuk state
      const formattedPengeluaran: RiwayatPengeluaran = {
        id: newPengeluaran.id,
        tanggal: newPengeluaran.tanggal,
        nominal: newPengeluaran.jumlah.toString(),
        jumlah: newPengeluaran.jumlah,
        deskripsi: newPengeluaran.deskripsi || "",
        jenis: newPengeluaran.kategori,
        kategori: newPengeluaran.kategori,
        keterangan: newPengeluaran.keterangan || "",
        kos_id: newPengeluaran.kos_id,
      };

      // Update state
      setRiwayatPengeluaran((prev) => [...prev, formattedPengeluaran]);

      // Tampilkan notifikasi
      setToastMessage("Berhasil menyimpan pengeluaran baru");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Reset form dan tutup modal
      handleClosePengeluaranModal();
    } catch (error) {
      console.error("Error:", error);
      setToastMessage("Gagal menyimpan pengeluaran baru");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
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

  // Fungsi untuk memformat angka menjadi format Rupiah
  const formatRupiah = (angka: string | null): string => {
    if (!angka) return "Rp0";

    // Hapus karakter non-numerik
    const number = angka.replace(/[^\d]/g, "");

    // Ubah ke format Rupiah dengan titik sebagai pemisah ribuan
    return `Rp${Number(number).toLocaleString("id-ID").replace(/,/g, ".")}`;
  };

  const getNamaPenghuni = (idPenghuni?: number | string) => {
    if (!idPenghuni) return "Tidak ditemukan";

    // Coba cari dengan ID string (karena di state kita menyimpan ID sebagai string)
    const idString = idPenghuni.toString();

    // Cari di penghuni aktif (pastikan id di array juga string)
    const penghuniData = penghuni.find((p) => p.id.toString() === idString);
    if (penghuniData) {
      return penghuniData.nama;
    }

    // Cari di penghuni lama (pastikan id di array juga string)
    const penghuniLamaData = penghuniLama.find(
      (p) => p.id.toString() === idString
    );
    if (penghuniLamaData) {
      return penghuniLamaData.nama;
    }

    return "Tidak ditemukan";
  };

  const handleDeletePengeluaranClick = (pengeluaran: RiwayatPengeluaran) => {
    setPengeluaranToDelete(pengeluaran);
    setIsDeletePengeluaranModalOpen(true);
  };

  const handleDeletePengeluaran = async () => {
    if (pengeluaranToDelete) {
      try {
        // Hapus data dari Supabase
        const { error } = await supabase
          .from("keuangan")
          .delete()
          .eq("id", pengeluaranToDelete.id);

        if (error) {
          console.error("Error saat menghapus pengeluaran:", error);
          throw error;
        }

        // Update state
        setRiwayatPengeluaran((prev) =>
          prev.filter((p) => p.id !== pengeluaranToDelete.id)
        );

        // Tampilkan notifikasi
        setToastMessage("Berhasil menghapus data pengeluaran");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        console.error("Error:", error);
        setToastMessage("Gagal menghapus data pengeluaran");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }

      setIsDeletePengeluaranModalOpen(false);
      setPengeluaranToDelete(null);
    }
  };

  // Format jenis pembayaran dari snake_case menjadi Title Case
  const formatPaymentType = (type: string): string => {
    if (!type) return "";
    // Ubah dari snake_case menjadi Title Case
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
        <div>
          {/* Trend Chart */}
          <div className="bg-white rounded-2xl shadow-sm mb-10 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                Tren Keuangan
              </h2>
              <p className="text-base text-gray-500 mt-1">
                Perbandingan pemasukan dan pengeluaran 6 bulan terakhir
              </p>
            </div>
            <div className="p-6">
              <TrendChart
                data={chartData}
                formatCurrency={formatStatisticCurrency}
              />
            </div>
          </div>
          {/* Kategori Pengeluaran Chart */}
          <div className="bg-white rounded-2xl shadow-sm mb-10 overflow-hidden">
            <div className="p-4 border-b border-gray-100 ">
              <h2 className="text-2xl font-bold text-gray-900">
                Kategori Pengeluaran
              </h2>
              <p className="text-base text-gray-500 mt-1">
                Pengeluaran bulan ini berdasarkan kategori
              </p>
            </div>
            <div className="p-6">
              <ExpensePieChart
                data={pieChartData}
                formatCurrency={formatStatisticCurrency}
              />
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
                            {getNamaPenghuni(pembayaran.penghuni_id)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPaymentType(pembayaran.kategori)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                            {formatCurrency(pembayaran.jumlah)}
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
                            {getNamaPenghuni(pembayaran.penghuni_id)}
                          </p>
                        </div>
                        <div>
                          <p className="text-base text-gray-500">
                            Jenis Pembayaran
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {formatPaymentType(pembayaran.kategori)}
                          </p>
                        </div>
                        <div>
                          <p className="text-base text-gray-500">Nominal</p>
                          <p className="text-base font-semibold text-green-600">
                            {formatCurrency(pembayaran.jumlah)}
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
                          Kategori
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
                            {formatPaymentType(pengeluaran.kategori)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                            {formatCurrency(pengeluaran.jumlah)}
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
                            {formatPaymentType(pengeluaran.kategori)}
                          </p>
                        </div>
                        <div>
                          <p className="text-base text-gray-500">Nominal</p>
                          <p className="text-base font-semibold text-red-600">
                            {formatCurrency(pengeluaran.jumlah)}
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
                  <option value="Perbaikan">Perbaikan</option>
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
                <div className="relative">
                  <input
                    type="date"
                    id="tanggal"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formData.tanggal ? "text-transparent" : ""
                    }`}
                    required
                    placeholder="Pilih tanggal pengeluaran"
                  />
                  {formData.tanggal && (
                    <div className="absolute inset-0 flex items-center px-4 text-gray-700 pointer-events-none">
                      {formatDate(formData.tanggal)}
                    </div>
                  )}
                </div>
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
                  value={formData.nominal ? formatRupiah(formData.nominal) : ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Contoh: 300.000"
                  onFocus={(e) => (e.target.value = formData.nominal || "")}
                  onBlur={(e) =>
                    (e.target.value = formatRupiah(formData.nominal))
                  }
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
