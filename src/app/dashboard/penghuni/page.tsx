// c:\Users\mifta\next-js\bapak-kosan\src\app\dashboard\penghuni\page.tsx
"use client";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FaBed, FaArrowLeft, FaPlus } from "react-icons/fa";
import { getDaftarPenghuni, tambahPenghuni } from "../data";

interface PenghuniData {
  id: number;
  nama: string;
  noKamar: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

const Penghuni = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    noKamar: "",
    tanggalMulai: "",
    tanggalSelesai: "",
  });
  const [penghuniList, setPenghuniList] = useState<PenghuniData[]>([]);

  useEffect(() => {
    const data = getDaftarPenghuni();
    setPenghuniList(data);
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
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // Menambahkan data baru ke daftarPenghuni
    tambahPenghuni(formData);

    // update list data
    const updatedData = getDaftarPenghuni();
    setPenghuniList(updatedData);

    // Menutup Modal
    handleCloseModal();
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
          <h1 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
            Daftar penghuni kos :
          </h1>
          <button
            onClick={handleTambahPenghuniClick}
            className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 p-4 py-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 text-gray-600 font-bold "
          >
            <FaPlus className="text-blue-600" /> Tambah Penghuni Baru
          </button>
        </div>

        <section className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {penghuniList.map((penghuni) => (
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
                      Kos sampai :{" "}
                      <span className="font-medium">
                        {formatDate(penghuni.tanggalSelesai)}
                      </span>
                    </p>
                    {(() => {
                      const today = new Date();
                      const selesaiDate = new Date(penghuni.tanggalSelesai);
                      const diffTime = selesaiDate.getTime() - today.getTime();
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
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg relative">
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
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="nama"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nama
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
                <div className="mb-4">
                  <label
                    htmlFor="noKamar"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nomor Kamar
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
                <div className="mb-4">
                  <label
                    htmlFor="tanggalMulai"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Tanggal Mulai Kos
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
                <div className="mb-6">
                  <label
                    htmlFor="tanggalSelesai"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Kos Sampai Tanggal
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
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full w-full"
                >
                  Simpan
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Penghuni;
