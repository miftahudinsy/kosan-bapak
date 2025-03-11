// c:\Users\mifta\next-js\bapak-kosan\src\app\dashboard\page.tsx
"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaUsers, FaMoneyBillAlt } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { getDaftarPenghuni, PenghuniData, initialData } from "./data"; // Import data dan interface

const Dashboard = () => {
  const router = useRouter();
  const [daftarPenghuni, setDaftarPenghuni] = useState<PenghuniData[]>([]);

  useEffect(() => {
    // Mengambil data dari getDaftarPenghuni
    const data = getDaftarPenghuni();

    // Jika localstorage kosong, maka inisialisasi dengan initialData
    if (data.length === 0) {
      localStorage.setItem("daftarPenghuni", JSON.stringify(initialData));
      setDaftarPenghuni(initialData);
    } else {
      setDaftarPenghuni(data);
    }
  }, []);

  const handlePenghuniClick = () => {
    router.push("/dashboard/penghuni");
  };

  const handleKeuanganClick = () => {
    router.push("/dashboard/keuangan");
  };

  const handleTambahPenghuniClick = () => {
    router.push("/dashboard/penghuni");
  };

  const handleLogout = () => {
    router.push("/"); // Mengarahkan ke halaman awal
  };

  // Fungsi untuk menghitung kamar yang jatuh tempo
  const hitungKamarJatuhTempo = (penghuniList: PenghuniData[]): number => {
    return penghuniList.filter((penghuni) => {
      const today = new Date();
      const selesaiDate = new Date(penghuni.tanggalSelesai);
      const diffTime = selesaiDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays < 7; // Sisa kurang dari 7 hari DAN lebih dari 0
    }).length;
  };

  // Menghitung jumlah kamar terisi
  const kamarTerisi = daftarPenghuni.length;
  // Anggap jumlah total kamar adalah 10 (bisa diubah sesuai kebutuhan)
  const totalKamar = 10;
  // Menghitung jumlah kamar kosong
  const kamarKosong = totalKamar - kamarTerisi;
  // Menghitung kamar yang sebentar lagi jatuh tempo
  const kamarJatuhTempo = hitungKamarJatuhTempo(daftarPenghuni);

  // Teks tombol
  const buttonText =
    kamarJatuhTempo > 0 ? "Cek Data Penghuni" : "Tambah Penghuni";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-5 ">
        <div className="flex flex-col">
          <h1 className="text-3xl text-center sm:text-left sm:text-4xl font-extrabold text-gray-900 mt-2 sm:mt-0">
            Kos Griya Hasana
          </h1>

          <p className=" text-gray-600 sm:mt-1 text-center sm:text-left mb-2">
            Anda sebagai: Pemilik kos
          </p>
        </div>

        {/* Menu Ringkas + tambah penghuni */}
        <div className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-gray-700 sm:text-lg ">
                Kamar terisi :{" "}
                <span className="font-semibold">{kamarTerisi} Kamar</span>
              </p>
              <p className="text-gray-700 sm:text-lg">
                Kamar Kosong :{" "}
                <span className="font-semibold">{kamarKosong} Kamar</span>
              </p>
              {/* Menampilkan pesan kamar jatuh tempo */}
              {kamarJatuhTempo > 0 && (
                <p className="text-yellow-600 sm:text-lg font-semibold">
                  Ada {kamarJatuhTempo} kamar sebentar lagi jatuh tempo!
                </p>
              )}
            </div>
            <button
              onClick={handleTambahPenghuniClick}
              className="w-full sm:w-auto bg-blue-600 text-white text-center text-base px-6 py-5 sm:py-6 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all  hover:bg-blue-700 transform hover:scale-105"
            >
              {buttonText}
            </button>
          </div>
        </div>

        {/* Dashboard Menu*/}

        <div className="min-h-[200px] sm:min-h-[150px] grid grid-cols-2  gap-5">
          {/* Data Penghuni*/}
          <button
            onClick={handlePenghuniClick}
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center space-y-2"
          >
            <FaUsers className="text-4xl text-blue-600" />
            <h3 className="text-xl text-center font-bold text-blue-800">
              Penghuni Kos
            </h3>
          </button>

          {/* Laporan Keuangan*/}
          <button
            onClick={handleKeuanganClick}
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center space-y-2"
          >
            <FaMoneyBillAlt className="text-4xl text-blue-600" />
            <h3 className="text-xl text-center font-bold text-blue-800">
              Keuangan
            </h3>
          </button>
        </div>
      </div>
      {/* Tombol Keluar*/}
      <div className="flex justify-center mt-5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all mt-5"
        >
          <TbLogout2 /> Keluar
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
