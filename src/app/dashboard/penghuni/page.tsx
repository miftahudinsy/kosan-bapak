"use client";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FaBed, FaArrowLeft, FaPlus } from "react-icons/fa";
import {
  getDaftarPenghuni,
  tambahPenghuni,
  formatCurrency,
  tambahRiwayatPembayaran,
  KontakDaruratType,
} from "../data";

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

interface FormData {
  nama: string;
  noKamar: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  noHP: string;
  noKTP: string;
  deposit: string;
  kontakDaruratNama: string;
  kontakDaruratTipe: string;
  kontakDaruratNoHP: string;
  nominalPembayaran: string;
}

const Penghuni = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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
  const [penghuniList, setPenghuniList] = useState<PenghuniData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadedData = getDaftarPenghuni();
    setPenghuniList(loadedData);
  }, []);

  const handleKamarClick = (id: number) => {
    router.push(`/dashboard/penghuni/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleTambahPenghuniClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
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
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // Persiapkan data kontak darurat
    let kontakDaruratData: KontakDarurat | undefined;

    // Jika ada data kontak darurat
    if (
      formData.kontakDaruratNama &&
      formData.kontakDaruratTipe &&
      formData.kontakDaruratNoHP
    ) {
      kontakDaruratData = {
        nama: formData.kontakDaruratNama,
        tipe: formData.kontakDaruratTipe as KontakDaruratType,
        noHP: formData.kontakDaruratNoHP,
      };
    }

    // Tambah data penghuni
    const updatedData = tambahPenghuni({
      nama: formData.nama,
      noKamar: formData.noKamar,
      tanggalMulai: formData.tanggalMulai,
      tanggalSelesai: formData.tanggalSelesai,
      noHP: formData.noHP,
      noKTP: formData.noKTP,
      deposit: formData.deposit,
      kontakDarurat: kontakDaruratData || {
        nama: "",
        tipe: KontakDaruratType.ORANG_TUA,
        noHP: "",
      },
    });

    // Tambah riwayat pembayaran
    if (formData.nominalPembayaran) {
      const newPenghuni = updatedData[updatedData.length - 1];
      tambahRiwayatPembayaran({
        idPenghuni: newPenghuni.id,
        tanggal: new Date().toISOString(),
        nominal: formatCurrency(formData.nominalPembayaran),
        jenis: "Pembayaran Awal",
      });
    }

    // Update the UI with the new data
    setPenghuniList(updatedData);

    // Reset form
    setFormData({
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

    setIsModalOpen(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-5 ">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md mb-8"
        >
          <FaArrowLeft /> Kembali
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
          <h1 className="text-xl font-bold text-gray-900 ">
            Daftar penghuni kos :
          </h1>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="relative w-full sm:w-80">
            {" "}
            {/* Wider search input */}
            <input
              type="text"
              placeholder="Cari penghuni atau nomor kamar..."
              className="w-full p-2 pl-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        </div>
        <button
          onClick={handleTambahPenghuniClick}
          className="flex items-center justify-center w-full gap-2 bg-blue-100 hover:bg-blue-200 p-4 py-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 text-gray-600 font-bold "
        >
          <FaPlus className="text-blue-600" /> Tambah Penghuni Baru
        </button>

        <section className="space-y-3">
          {penghuniList.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <FaBed className="text-gray-400 text-5xl" />
              </div>
              <p className="text-gray-500 text-lg">
                Belum ada data penghuni. Silakan tambahkan penghuni baru.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {penghuniList
                .filter(
                  (penghuni) =>
                    penghuni.nama
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    penghuni.noKamar
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .sort(
                  (a, b) =>
                    new Date(a.tanggalSelesai).getTime() -
                    new Date(b.tanggalSelesai).getTime()
                ) // Sort by tanggalSelesai
                .map((penghuni) => (
                  <button
                    key={penghuni.id}
                    onClick={() => handleKamarClick(penghuni.id)}
                    className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left space-y-2">
                        <h3 className="text-xl font-bold text-blue-800">
                          {penghuni.nama}
                        </h3>

                        <p className="text-gray-600">
                          Kos sampai:{" "}
                          <span className="font-medium">
                            {formatDate(penghuni.tanggalSelesai)}
                          </span>
                        </p>
                        {(() => {
                          const today = new Date();
                          const selesaiDate = new Date(penghuni.tanggalSelesai);
                          const diffTime =
                            selesaiDate.getTime() - today.getTime();
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24)
                          );

                          if (diffDays >= 0) {
                            return (
                              <p className="text-gray-600">
                                Sisa{" "}
                                <span className="font-medium">
                                  {diffDays} hari lagi
                                </span>
                              </p>
                            );
                          } else {
                            return (
                              <p className="text-red-600 font-medium">
                                Terlambat! Sudah lewat{" "}
                                <span className="font-medium">
                                  {Math.abs(diffDays)} hari
                                </span>
                              </p>
                            );
                          }
                        })()}
                      </div>
                      <div className="flex flex-col items-center">
                        <FaBed className="text-3xl text-blue-600 mb-1" />
                        <span className="text-2xl font-bold text-blue-700">
                          {penghuni.noKamar}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <button
                onClick={handleCloseModal}
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
                Tambah Penghuni Baru
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Nama */}
                <div className="mb-4">
                  <label
                    htmlFor="nama"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nama"
                    required
                  />
                </div>

                {/* Nomor Kamar */}
                <div className="mb-4">
                  <label
                    htmlFor="noKamar"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nomor Kamar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="noKamar"
                    name="noKamar"
                    value={formData.noKamar}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nomor Kamar"
                    required
                  />
                </div>

                {/* Nomor HP */}
                <div className="mb-4">
                  <label
                    htmlFor="noHP"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nomor HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="noHP"
                    name="noHP"
                    value={formData.noHP}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nomor HP"
                    required
                  />
                </div>

                {/* Nomor KTP (Opsional) */}
                <div className="mb-4">
                  <label
                    htmlFor="noKTP"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nomor KTP <span className="text-gray-400">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    id="noKTP"
                    name="noKTP"
                    value={formData.noKTP}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nomor KTP"
                  />
                </div>

                {/* Kontak Darurat - Nama */}
                <div className="mb-4">
                  <label
                    htmlFor="kontakDaruratNama"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nama Kontak Darurat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="kontakDaruratNama"
                    name="kontakDaruratNama"
                    value={formData.kontakDaruratNama}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nama Kontak Darurat"
                    required
                  />
                </div>

                {/* Kontak Darurat - Tipe */}
                <div className="mb-4">
                  <label
                    htmlFor="kontakDaruratTipe"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Tipe Kontak Darurat <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="kontakDaruratTipe"
                    name="kontakDaruratTipe"
                    value={formData.kontakDaruratTipe}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={KontakDaruratType.ORANG_TUA}>
                      Orang Tua
                    </option>
                    <option value={KontakDaruratType.WALI}>Wali</option>
                  </select>
                </div>

                {/* Kontak Darurat - Nomor HP */}
                <div className="mb-4">
                  <label
                    htmlFor="kontakDaruratNoHP"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nomor HP Kontak Darurat{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="kontakDaruratNoHP"
                    name="kontakDaruratNoHP"
                    value={formData.kontakDaruratNoHP}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nomor HP Kontak Darurat"
                    required
                  />
                </div>

                {/* Deposit (Opsional) */}
                <div className="mb-4">
                  <label
                    htmlFor="deposit"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Deposit <span className="text-gray-400">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    id="deposit"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: 300.000"
                  />
                </div>

                {/* Tanggal Mulai */}
                <div className="mb-4">
                  <label
                    htmlFor="tanggalMulai"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Tanggal Mulai Kos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="tanggalMulai"
                    name="tanggalMulai"
                    value={formData.tanggalMulai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Tanggal Selesai */}
                <div className="mb-4">
                  <label
                    htmlFor="tanggalSelesai"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Kos Sampai Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="tanggalSelesai"
                    name="tanggalSelesai"
                    value={formData.tanggalSelesai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Nominal Pembayaran */}
                <div className="mb-4">
                  <label
                    htmlFor="nominalPembayaran"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nominal Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nominalPembayaran"
                    name="nominalPembayaran"
                    value={formData.nominalPembayaran}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Contoh: 1.200.000"
                  />
                </div>

                {/* Submit Button - Full Width */}
                <div className="col-span-1 md:col-span-2 mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full w-full"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Penghuni;
