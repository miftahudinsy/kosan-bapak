"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaBed, FaHistory, FaTrash } from "react-icons/fa";
import { getDaftarPenghuniLama, hapusPenghuniLama } from "../data";

interface PenghuniLama {
  id: number;
  nama: string;
  noKamar: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  noHP: string;
  noKTP?: string;
  deposit?: string;
}

export default function PenghuniLama() {
  const router = useRouter();
  const [penghuniLama, setPenghuniLama] = useState<PenghuniLama[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPenghuniId, setSelectedPenghuniId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const data = getDaftarPenghuniLama();
    setPenghuniLama(data);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleDeleteClick = (id: number) => {
    setSelectedPenghuniId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPenghuniId) {
      const updatedData = hapusPenghuniLama(selectedPenghuniId);
      setPenghuniLama(updatedData);
      setIsDeleteModalOpen(false);
      setSelectedPenghuniId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedPenghuniId(null);
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
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md mb-8"
        >
          <FaArrowLeft /> Kembali
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Daftar Penghuni Lama
          </h1>
        </div>

        {penghuniLama.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <FaHistory className="text-gray-400 text-5xl" />
            </div>
            <p className="text-gray-500 text-lg">
              Belum ada data penghuni lama
            </p>
          </div>
        ) : (
          <>
            {/* Tampilan Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. Kamar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Mulai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Selesai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. HP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {penghuniLama.map((penghuni) => (
                    <tr key={penghuni.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {penghuni.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {penghuni.noKamar}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(penghuni.tanggalMulai)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(penghuni.tanggalSelesai)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {penghuni.noHP}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteClick(penghuni.id)}
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

            {/* Tampilan Mobile */}
            <div className="md:hidden space-y-4">
              {penghuniLama.map((penghuni) => (
                <div
                  key={penghuni.id}
                  className="bg-white border border-gray-200 border-l-4 border-l-gray-500 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <FaBed className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {penghuni.nama}
                        </p>
                        <p className="text-sm text-gray-500">
                          Kamar {penghuni.noKamar}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(penghuni.id)}
                      className="text-red-600 hover:text-red-900 p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Mulai</p>
                      <p className="text-base font-medium text-gray-900">
                        {formatDate(penghuni.tanggalMulai)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Selesai</p>
                      <p className="text-base font-medium text-gray-900">
                        {formatDate(penghuni.tanggalSelesai)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">No. HP</p>
                      <p className="text-base font-medium text-gray-900">
                        {penghuni.noHP}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal Konfirmasi Hapus */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Konfirmasi Hapus</h2>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus data penghuni lama ini?
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-4 rounded-lg"
                >
                  Ya, Hapus
                </button>
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
