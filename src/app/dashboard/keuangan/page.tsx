"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import {
  getRiwayatPembayaran,
  getDaftarPenghuni,
  formatCurrency,
  hapusRiwayatPembayaran,
} from "../data";
import { RiwayatPembayaran } from "../data";

const Keuangan = () => {
  const router = useRouter();
  const [riwayatPembayaran, setRiwayatPembayaran] = useState<
    RiwayatPembayaran[]
  >([]);
  const [penghuni] = useState(getDaftarPenghuni());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pembayaranToDelete, setPembayaranToDelete] =
    useState<RiwayatPembayaran | null>(null);

  useEffect(() => {
    const data = getRiwayatPembayaran();
    setRiwayatPembayaran(data);
  }, []);

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
    return penghuniData ? penghuniData.nama : "Tidak ditemukan";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-5">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md mb-8"
        >
          <FaArrowLeft /> Kembali
        </button>
        <h1 className="text-xl font-bold text-gray-900 mb-4 ">
          Riwayat Pembayaran Kos
        </h1>

        {/* Tampilan Desktop */}
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
              {riwayatPembayaran.map((pembayaran) => (
                <tr key={pembayaran.id} className="hover:bg-gray-50">
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
                      className="text-red-600 hover:text-red-900 p-2"
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tampilan Mobile */}
        <div className="md:hidden space-y-4">
          {riwayatPembayaran.map((pembayaran) => (
            <div
              key={pembayaran.id}
              className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
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
                  <p className="text-base text-gray-500">Nama Penghuni</p>
                  <p className="text-base font-medium text-gray-900">
                    {getNamaPenghuni(pembayaran.idPenghuni)}
                  </p>
                </div>
                <div>
                  <p className="text-base text-gray-500">Jenis Pembayaran</p>
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
      </div>

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Konfirmasi Hapus
            </h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus riwayat pembayaran ini? Tindakan
              ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-full"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPembayaranToDelete(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-4 rounded-full"
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
