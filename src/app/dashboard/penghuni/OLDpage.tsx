// c:\Users\mifta\next-js\bapak-kosan\src\app\dashboard\penghuni\page.tsx
"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaBed, FaArrowLeft } from "react-icons/fa";

const Penghuni = () => {
  const daftarPenghuni = {
    id: 1,
    nama: "Budi Dabudi Agung",
    tanggalMulai: "2025-02-14",
    tanggalSelesai: "2025-03-14",
  };
  const router = useRouter();

  const handleKamarClick = (path: string) => {
    router.push(path);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-5 ">
        {/* Tombol Kembali */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md"
        >
          <FaArrowLeft /> Kembali
        </button>

        {/* Dashboard Grid Lantai 1 */}
        <h1 className="text-xl font-bold text-gray-900 mb-3 mt-2">
          Daftar penghuni kos :
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Kamar A1 */}
          <button
            onClick={() => handleKamarClick("dashboard/task")}
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="text-left space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Budi Dabudi Agung
                </h3>
                <p className="text-gray-600">
                  Sewa sampai: <span className="font-medium">9 April 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">30 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">A1</span>
              </div>
            </div>
          </button>

          {/* Kamar A2 */}
          <button
            onClick={() => handleKamarClick("dashboard/task")}
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="text-left space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Sadana Kocak
                </h3>
                <p className="text-gray-600">
                  Sewa sampai: <span className="font-medium">9 April 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">30 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">A2</span>
              </div>
            </div>
          </button>

          {/* Kamar A3 */}
          <button
            onClick={() => handleKamarClick("dashboard/task")}
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="text-left space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Wahuy Basuki Coklat
                </h3>
                <p className="text-gray-600">
                  Sewa sampai: <span className="font-medium">9 April 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">30 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">A3</span>
              </div>
            </div>
          </button>

          {/* Tombol tambah penghuni */}
        </div>
      </div>
    </div>
  );
};

export default Penghuni;
