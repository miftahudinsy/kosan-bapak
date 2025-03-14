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

  // Format currency khusus untuk statistik dan grafik
  const formatStatisticCurrency = (amount: number | string): string => {
    if (typeof amount === "string") {
      amount = parseInt(amount.replace(/\D/g, ""), 10);
    }
    if (isNaN(amount)) {
      return "Rp0,-";
    }
    amount = amount * 1000;
    return `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`;
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
      // Hapus semua karakter non-numerik kecuali titik desimal
      const numericValue = value.replace(/[^0-9.]/g, "");
      return parseFloat(numericValue) || 0;
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

        <div className="flex justify-center mb-8 sm:mb-4">
          <div className="flex space-x-2 bg-blue-50 p-1.5 rounded-full">
            <button
              onClick={() => setActiveTab("pemasukan")}
              className={`px-4 py-3 rounded-full font-semibold transition-all ${
                activeTab === "pemasukan"
                  ? "bg-white text-black shadow-md"
                  : "text-gray-600"
              }`}
            >
              Pemasukan
            </button>
            <button
              onClick={() => setActiveTab("pengeluaran")}
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
                      {riwayatPembayaran
                        .sort(
                          (a, b) =>
                            new Date(b.tanggal).getTime() -
                            new Date(a.tanggal).getTime()
                        )
                        .map((pembayaran) => (
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
                </div>

                {/* Tampilan Mobile Pemasukan */}
                <div className="md:hidden space-y-4">
                  {riwayatPembayaran
                    .sort(
                      (a, b) =>
                        new Date(b.tanggal).getTime() -
                        new Date(a.tanggal).getTime()
                    )
                    .map((pembayaran) => (
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
                      {riwayatPengeluaran
                        .sort(
                          (a, b) =>
                            new Date(b.tanggal).getTime() -
                            new Date(a.tanggal).getTime()
                        )
                        .map((pengeluaran) => (
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
                </div>

                {/* Tampilan Mobile Pengeluaran */}
                <div className="md:hidden space-y-4">
                  {riwayatPengeluaran
                    .sort(
                      (a, b) =>
                        new Date(b.tanggal).getTime() -
                        new Date(a.tanggal).getTime()
                    )
                    .map((pengeluaran) => (
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
