"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import {
  FaArrowLeft,
  FaBed,
  FaEdit,
  FaCalendarPlus,
  FaTrash,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  getDaftarPenghuni,
  editPenghuni,
  perpanjangKos,
  hapusPenghuni,
  KontakDaruratType,
  tambahRiwayatPembayaran,
  formatCurrency,
  akhiriSewaKos,
} from "../../data";

interface KontakDarurat {
  nama: string;
  tipe: KontakDaruratType;
  noHP: string;
}

interface PenghuniData {
  id: number;
  nama: string;
  noKamar: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  noHP: string;
  noKTP?: string;
  deposit?: string;
  kontakDarurat?: KontakDarurat;
}

export default function DetailPenghuni({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [penghuni, setPenghuni] = useState<PenghuniData | null>(null);
  const resolvedParams = React.use(params);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPerpanjangModalOpen, setIsPerpanjangModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAkhiriSewaModalOpen, setIsAkhiriSewaModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    noKamar: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    noHP: "",
    noKTP: "",
    deposit: "",
    kontakDaruratNama: "",
    kontakDaruratTipe: "",
    kontakDaruratNoHP: "",
    nominalPembayaran: "",
  });

  useEffect(() => {
    const daftarPenghuni = getDaftarPenghuni();
    const penghuniData = daftarPenghuni.find(
      (p) => p.id === parseInt(resolvedParams.id)
    );
    setPenghuni(penghuniData || null);
    if (penghuniData) {
      setFormData({
        nama: penghuniData.nama || "",
        noKamar: penghuniData.noKamar || "",
        tanggalMulai: penghuniData.tanggalMulai || "",
        tanggalSelesai: penghuniData.tanggalSelesai || "",
        noHP: penghuniData.noHP || "",
        noKTP: penghuniData.noKTP || "",
        deposit: penghuniData.deposit || "",
        kontakDaruratNama: penghuniData.kontakDarurat?.nama || "",
        kontakDaruratTipe: penghuniData.kontakDarurat?.tipe || "",
        kontakDaruratNoHP: penghuniData.kontakDarurat?.noHP || "",
        nominalPembayaran: "",
      });
    }
  }, [resolvedParams.id]);

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (penghuni) {
      // Persiapkan data kontak darurat
      let kontakDaruratData: KontakDarurat | undefined;

      // Jika ada data kontak darurat
      if (
        formData.kontakDaruratNama ||
        formData.kontakDaruratTipe ||
        formData.kontakDaruratNoHP
      ) {
        kontakDaruratData = {
          nama: formData.kontakDaruratNama,
          tipe: formData.kontakDaruratTipe as KontakDaruratType,
          noHP: formData.kontakDaruratNoHP,
        };
      }

      // Edit data penghuni
      const updatedData = editPenghuni(penghuni.id, {
        nama: formData.nama,
        noKamar: formData.noKamar,
        tanggalMulai: formData.tanggalMulai,
        tanggalSelesai: formData.tanggalSelesai,
        noHP: formData.noHP,
        noKTP: formData.noKTP,
        deposit: formData.deposit,
        kontakDarurat: kontakDaruratData,
      });

      // Update state dengan data terbaru
      const updatedPenghuni = updatedData.find((p) => p.id === penghuni.id);
      if (updatedPenghuni) {
        setPenghuni(updatedPenghuni);
      }
    }
    setIsEditModalOpen(false);
  };

  const handlePerpanjangSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (penghuni) {
      // Perpanjang masa kos
      const updatedData = perpanjangKos(penghuni.id, formData.tanggalSelesai);

      // Tambah riwayat pembayaran
      if (formData.nominalPembayaran) {
        tambahRiwayatPembayaran({
          idPenghuni: penghuni.id,
          tanggal: new Date().toISOString(),
          nominal: formatCurrency(formData.nominalPembayaran),
          jenis: "Perpanjangan",
        });
      }

      // Update state dengan data terbaru
      const updatedPenghuni = updatedData.find((p) => p.id === penghuni.id);
      if (updatedPenghuni) {
        setPenghuni(updatedPenghuni);
      }
    }
    setIsPerpanjangModalOpen(false);
  };

  const handleDelete = () => {
    if (penghuni) {
      // Hapus data penghuni
      hapusPenghuni(penghuni.id);
      setIsDeleteModalOpen(false);
      router.back();
    }
  };

  const handleAkhiriSewa = () => {
    if (penghuni) {
      // Pindahkan ke daftar penghuni lama
      const updatedData = akhiriSewaKos(penghuni.id);
      setIsAkhiriSewaModalOpen(false);
      router.push("/dashboard/penghuni-lama");
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

  // Fungsi untuk menampilkan kontak darurat
  const renderKontakDarurat = () => {
    if (!penghuni?.kontakDarurat) return null;

    const kontakDarurat = penghuni.kontakDarurat;
    return (
      <div className="space-y-1">
        <h2 className="text-gray-600">Kontak Darurat</h2>
        <div className="space-y-2">
          {kontakDarurat.nama && (
            <p className="text-lg font-semibold text-gray-900">
              {kontakDarurat.nama}
              {kontakDarurat.tipe && (
                <span className="ml-2 text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  {kontakDarurat.tipe}
                </span>
              )}
            </p>
          )}
          {kontakDarurat.noHP && (
            <p className="text-lg font-semibold text-gray-900">
              {kontakDarurat.noHP}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (!penghuni) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md mb-8"
          >
            <FaArrowLeft /> Kembali
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            Data tidak ditemukan
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-5">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md mb-8"
        >
          <FaArrowLeft /> Kembali
        </button>

        <div className="space-y-6">
          <div className="flex items-center justify-between ">
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Penghuni
            </h1>
            <div className="flex flex-col items-center bg-blue-100 p-4 px-9 rounded-xl">
              <FaBed className="text-4xl text-blue-600 mb-1" />
              <span className="text-2xl font-bold text-blue-700">
                {penghuni.noKamar}
              </span>
            </div>
          </div>

          <div className="bg-blue-100 rounded-xl p-6 space-y-6">
            {/* Nama Penghuni */}
            <div className="space-y-1">
              <h2 className="text-gray-600">Nama Penghuni</h2>
              <p className="text-xl font-bold text-blue-800">{penghuni.nama}</p>
            </div>

            {/* Nomor Kamar */}
            <div className="space-y-1">
              <h2 className="text-gray-600">Nomor Kamar</h2>
              <p className="text-lg font-semibold text-gray-900">
                {penghuni.noKamar}
              </p>
            </div>

            {/* Nomor HP */}
            {penghuni.noHP && (
              <div className="space-y-1">
                <h2 className="text-gray-600">Nomor HP</h2>
                <p className="text-lg font-semibold text-gray-900">
                  {penghuni.noHP}
                </p>
              </div>
            )}

            {/* Nomor KTP */}
            {penghuni.noKTP && (
              <div className="space-y-1">
                <h2 className="text-gray-600">Nomor KTP</h2>
                <p className="text-lg font-semibold text-gray-900">
                  {penghuni.noKTP}
                </p>
              </div>
            )}

            {/* Kontak Darurat */}
            {renderKontakDarurat()}

            {/* Deposit */}
            {penghuni.deposit && (
              <div className="space-y-1">
                <h2 className="text-gray-600">Deposit</h2>
                <p className="text-lg font-semibold text-green-600">
                  {penghuni.deposit}
                </p>
              </div>
            )}

            {/* Tanggal Mulai dan Selesai */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <h2 className="text-gray-600">Tanggal Mulai Kos</h2>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(penghuni.tanggalMulai)}
                </p>
              </div>

              <div className="space-y-1">
                <h2 className="text-gray-600">Tanggal Selesai Kos</h2>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(penghuni.tanggalSelesai)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-gray-600">Status</h2>
              {(() => {
                const today = new Date();
                const selesaiDate = new Date(penghuni.tanggalSelesai);
                const diffTime = selesaiDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 0) {
                  return (
                    <div className="bg-green-100 p-4 rounded-lg">
                      <p className="text-green-600 font-semibold">
                        Aktif - Sisa {diffDays} hari
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <div className="bg-red-100 p-4 rounded-lg">
                      <p className="text-red-600 font-semibold">
                        Terlambat {Math.abs(diffDays)} hari
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => setIsPerpanjangModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-5 rounded-lg font-medium transition-colors"
            >
              <FaCalendarPlus /> Perpanjang Kos
            </button>
            <button
              onClick={() => setIsAkhiriSewaModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-5 rounded-lg font-medium transition-colors"
            >
              <FaSignOutAlt /> Akhiri Sewa Kos
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-5 rounded-lg font-medium transition-colors"
            >
              <FaEdit /> Edit Data
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-5 rounded-lg font-medium transition-colors"
            >
              <FaTrash /> Hapus
            </button>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Edit Data Penghuni</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nomor Kamar
                </label>
                <input
                  type="text"
                  name="noKamar"
                  value={formData.noKamar}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nomor HP
                </label>
                <input
                  type="text"
                  name="noHP"
                  value={formData.noHP}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nomor KTP
                </label>
                <input
                  type="text"
                  name="noKTP"
                  value={formData.noKTP}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Kontak Darurat - Form Fields */}
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">
                  Kontak Darurat
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="kontakDaruratNama"
                      value={formData.kontakDaruratNama}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">
                      Hubungan
                    </label>
                    <select
                      name="kontakDaruratTipe"
                      value={formData.kontakDaruratTipe}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Hubungan</option>
                      <option value={KontakDaruratType.ORANG_TUA}>
                        Orang Tua
                      </option>
                      <option value={KontakDaruratType.WALI}>Wali</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">
                      Nomor HP
                    </label>
                    <input
                      type="text"
                      name="kontakDaruratNoHP"
                      value={formData.kontakDaruratNoHP}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Deposit
                </label>
                <input
                  type="text"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 300.000"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tanggal Mulai Kos
                </label>
                <input
                  type="date"
                  name="tanggalMulai"
                  value={formData.tanggalMulai}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tanggal Selesai Kos
                </label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={formData.tanggalSelesai}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-4 rounded-lg"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Perpanjang */}
      {isPerpanjangModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Perpanjang Kos</h2>
            <form onSubmit={handlePerpanjangSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tanggal Selesai Kos
                </label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={formData.tanggalSelesai}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nominal Pembayaran
                </label>
                <input
                  type="text"
                  name="nominalPembayaran"
                  value={formData.nominalPembayaran}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 1.200.000"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-4 px-4 rounded-lg"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setIsPerpanjangModalOpen(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus data penghuni ini? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-4 rounded-lg"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Akhiri Sewa */}
      {isAkhiriSewaModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Konfirmasi Akhiri Sewa</h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin mengakhiri masa sewa kos untuk penghuni
              ini? Data akan dipindahkan ke daftar penghuni lama.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleAkhiriSewa}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-4 px-4 rounded-lg"
              >
                Ya, Akhiri Sewa
              </button>
              <button
                onClick={() => setIsAkhiriSewaModalOpen(false)}
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
}
