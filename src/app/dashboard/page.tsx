// c:\Users\mifta\next-js\bapak-kosan\src\app\dashboard\page.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUsers, FaMoneyBillAlt, FaCog } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";

interface KosData {
  id: string;
  nama_kos: string;
  jumlah_kamar: number;
  template_pesan: string;
  plan_type?: string;
}

interface PenghuniData {
  id: string;
  nama: string;
  nomor_kamar: string;
  nomor_hp: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  biayaSewa: number;
  status: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [daftarPenghuni, setDaftarPenghuni] = useState<PenghuniData[]>([]);
  const [kosData, setKosData] = useState<KosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function getKosData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("kos")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error:", error);
        return;
      }

      if (!data || data.length === 0) {
        router.push("/welcome");
        return;
      }

      setKosData(data[0]);

      // Fetch penghuni data yang aktif saja
      const { data: penghuniData, error: penghuniError } = await supabase
        .from("penghuni")
        .select("*")
        .eq("kos_id", data[0].id)
        .eq("status", "aktif");

      if (penghuniError) {
        console.error("Error fetching penghuni:", penghuniError);
        return;
      }

      // Log untuk debugging
      console.log("Data penghuni:", penghuniData);

      // Map data dari database ke format yang digunakan di komponen
      const mappedPenghuni = penghuniData
        ? penghuniData.map((p) => ({
            id: p.id,
            nama: p.nama,
            nomor_kamar: p.nomor_kamar,
            nomor_hp: p.nomor_hp,
            tanggal_mulai: p.tanggal_mulai,
            tanggal_selesai: p.tanggal_selesai,
            biayaSewa: 0, // Sesuaikan jika ada data biaya
            status: p.status,
          }))
        : [];

      setDaftarPenghuni(mappedPenghuni);

      // Cek jika user memiliki paket Gratis dan penghuni lebih dari 5
      if (
        data[0].plan_type !== "pro" &&
        penghuniData &&
        penghuniData.length > 5
      ) {
        setShowLimitWarning(true);
      }

      setLoading(false);
    }

    getKosData();
  }, [router, supabase]);

  const handlePenghuniClick = () => {
    router.push("/dashboard/penghuni");
  };

  const handleKeuanganClick = () => {
    router.push("/dashboard/keuangan");
  };

  const handleTambahPenghuniClick = () => {
    router.push("/dashboard/penghuni");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handlePengaturanClick = () => {
    router.push("/dashboard/pengaturan");
  };

  // Fungsi untuk menghitung kamar yang jatuh tempo
  const hitungKamarJatuhTempo = (penghuniList: PenghuniData[]): number => {
    // Log untuk debugging
    console.log("Menghitung kamar jatuh tempo dari:", penghuniList);

    return penghuniList.filter((penghuni) => {
      // Pastikan tanggal_selesai ada
      if (!penghuni.tanggal_selesai) {
        console.log("Penghuni tanpa tanggal selesai:", penghuni);
        return false;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset waktu ke awal hari

      const selesaiDate = new Date(penghuni.tanggal_selesai);
      selesaiDate.setHours(0, 0, 0, 0); // Reset waktu ke awal hari

      const diffTime = selesaiDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      console.log(
        `Penghuni ${penghuni.nama}, Kamar ${penghuni.nomor_kamar}: ${diffDays} hari tersisa`
      );

      // Kamar jatuh tempo jika kurang dari atau sama dengan 7 hari
      return diffDays >= 0 && diffDays <= 7;
    }).length;
  };

  // Menghitung jumlah kamar terisi dari penghuni yang aktif
  const kamarTerisi = daftarPenghuni.length;
  // Mengambil total kamar dari data kos
  const totalKamar = kosData?.jumlah_kamar || 0;
  // Menghitung jumlah kamar kosong
  const kamarKosong = Math.max(0, totalKamar - kamarTerisi); // Pastikan tidak negatif
  // Menghitung kamar yang sebentar lagi jatuh tempo
  const kamarJatuhTempo = hitungKamarJatuhTempo(daftarPenghuni);

  // Teks tombol
  const buttonText =
    kamarJatuhTempo > 0 ? "Cek Data Penghuni" : "Tambah Penghuni";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      {/* Warning Overlay */}
      {showLimitWarning && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Peringatan!</h2>
              <p className="text-gray-600">
                Anda memiliki lebih dari 5 penghuni aktif dengan paket Gratis.
                Silakan hapus beberapa penghuni hingga tersisa maksimal 5
                penghuni, atau upgrade ke paket Pro untuk mengelola lebih banyak
                penghuni.
              </p>
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => router.push("/dashboard/penghuni")}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg w-full"
                >
                  Kelola Penghuni
                </button>
                <button
                  onClick={() => router.push("/dashboard/upgrade")}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg w-full"
                >
                  Upgrade ke Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-5">
        {/* Header dengan pengaturan */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <div className="flex flex-col">
            <h1 className="text-3xl text-center sm:text-left sm:text-4xl font-extrabold text-gray-900 mt-2 sm:mt-0 mb-2">
              {kosData?.nama_kos || "Kos Anda"}
            </h1>
            <p className="text-gray-600 sm:mt-1 text-center sm:text-left mb-2">
              Paket Lisensi : {kosData?.plan_type === "pro" ? "Pro" : "Gratis"}
            </p>
          </div>

          {/* Tombol Pengaturan - Desktop */}
          <button
            onClick={handlePengaturanClick}
            className="hidden sm:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            <FaCog className="text-xl text-gray-600" />
            <span className="text-gray-700 font-medium">Pengaturan</span>
          </button>
        </div>

        {/* Tombol Pengaturan - Mobile */}
        <button
          onClick={handlePengaturanClick}
          className="sm:hidden w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg transition-colors shadow-md"
        >
          <FaCog className="text-xl text-gray-600" />
          <span className="text-gray-700 font-medium">Pengaturan</span>
        </button>

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
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all mt-5 transform hover:scale-105"
        >
          <TbLogout2 className="text-xl" /> Keluar
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
