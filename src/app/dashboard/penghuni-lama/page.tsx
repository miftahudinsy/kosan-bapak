"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaBed, FaHistory, FaTrash } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";

interface KontakDaruratData {
  nama: string;
  tipe: string;
  nomor_hp: string;
}

interface PenghuniLama {
  id: string;
  kos_id: string;
  nama: string;
  nomor_kamar: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  nomor_hp: string;
  nomor_ktp: string | null;
  deposit: string | null;
  kontak_darurat: KontakDaruratData;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function PenghuniLama() {
  const router = useRouter();
  const supabase = createClient();
  const [penghuniLama, setPenghuniLama] = useState<PenghuniLama[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPenghuniId, setSelectedPenghuniId] = useState<string | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchPenghuniLama = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Dapatkan kos_id user
        const { data: kosData } = await supabase
          .from("kos")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!kosData) return;

        // Ambil data penghuni lama
        const { data: penghuniData, error } = await supabase
          .from("penghuni")
          .select("*")
          .eq("kos_id", kosData.id)
          .eq("status", "tidak aktif");

        if (error) throw error;

        // Format data untuk memastikan id dan kos_id adalah string
        const formattedData = penghuniData.map((p) => ({
          ...p,
          id: p.id.toString(),
          kos_id: p.kos_id.toString(),
        }));

        setPenghuniLama(formattedData);
      } catch (error) {
        console.error("Error fetching penghuni lama:", error);
      }
    };

    fetchPenghuniLama();
  }, [router, supabase]);

  const handleBack = () => {
    router.push("/dashboard/penghuni");
  };

  const handleDeleteClick = (id: string) => {
    setSelectedPenghuniId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPenghuniId) {
      try {
        // Log ID yang akan dihapus
        console.log("ID penghuni yang akan dihapus:", selectedPenghuniId);
        console.log("Tipe data ID:", typeof selectedPenghuniId);

        // Konversi ID ke numerik
        const numericId = parseInt(selectedPenghuniId);
        console.log("ID numerik:", numericId);
        console.log("Tipe data ID numerik:", typeof numericId);

        // Cek data penghuni yang akan dihapus
        const { data: penghuniToDelete, error: checkError } = await supabase
          .from("penghuni")
          .select("*")
          .eq("id", numericId)
          .single();

        console.log("Data penghuni yang akan dihapus:", penghuniToDelete);
        if (checkError) {
          console.error("Error saat memeriksa penghuni:", checkError);
        }

        // PENTING: Periksa apakah ada data keuangan terkait
        const { data: keuanganData, error: keuanganError } = await supabase
          .from("keuangan")
          .select("id")
          .eq("penghuni_id", numericId);

        if (keuanganData && keuanganData.length > 0) {
          console.log(
            "Ada data keuangan terkait:",
            keuanganData.length,
            "entri"
          );

          // Hapus data keuangan terkait terlebih dahulu
          const { error: deleteKeuanganError } = await supabase
            .from("keuangan")
            .delete()
            .eq("penghuni_id", numericId);

          if (deleteKeuanganError) {
            console.error(
              "Error saat menghapus data keuangan:",
              deleteKeuanganError
            );
            throw new Error("Gagal menghapus data keuangan terkait");
          }

          console.log("Berhasil menghapus data keuangan terkait");
        }

        // Lakukan penghapusan penghuni setelah data keuangan dihapus
        const { error } = await supabase
          .from("penghuni")
          .delete()
          .eq("id", numericId);

        if (error) {
          console.error("Error detail saat menghapus:", error);
          throw error;
        }

        // Jika berhasil, update state
        console.log("Berhasil menghapus penghuni dengan ID:", numericId);
        setPenghuniLama((prev) =>
          prev.filter((p) => p.id !== selectedPenghuniId)
        );
        setToastMessage("Berhasil menghapus data penghuni lama");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        console.error("Error lengkap:", error);
        setToastMessage(
          error instanceof Error
            ? `Gagal menghapus data penghuni lama: ${error.message}`
            : "Gagal menghapus data penghuni lama"
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }

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
                        {penghuni.nomor_kamar}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(penghuni.tanggal_mulai)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(penghuni.tanggal_selesai)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {penghuni.nomor_hp}
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
                          Kamar {penghuni.nomor_kamar}
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
                        {formatDate(penghuni.tanggal_mulai)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Selesai</p>
                      <p className="text-base font-medium text-gray-900">
                        {formatDate(penghuni.tanggal_selesai)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">No. HP</p>
                      <p className="text-base font-medium text-gray-900">
                        {penghuni.nomor_hp}
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
