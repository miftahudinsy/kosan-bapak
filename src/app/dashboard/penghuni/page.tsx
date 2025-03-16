"use client";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FaBed, FaArrowLeft, FaPlus, FaHistory } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import { KontakDaruratType } from "../data";

interface PenghuniData {
  id: string;
  kos_id: string;
  nama: string;
  nomor_kamar: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  nomor_hp: string;
  nomor_ktp: string | null;
  deposit: string | null;
  kontak_darurat: {
    nama: string;
    tipe: KontakDaruratType;
    nomor_hp: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  nama: string;
  nomor_kamar: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  nomor_hp: string;
  nomor_ktp: string;
  deposit: string;
  kontak_darurat_nama: string;
  kontak_darurat_tipe: KontakDaruratType;
  kontak_darurat_nomor_hp: string;
  nominal_pembayaran: string;
}

const Penghuni = () => {
  const router = useRouter();
  const supabase = createClient();
  const [penghuni, setPenghuni] = useState<PenghuniData[]>([]);
  const [kosData, setKosData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    nomor_kamar: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    nomor_hp: "",
    nomor_ktp: "",
    deposit: "",
    kontak_darurat_nama: "",
    kontak_darurat_tipe: "orang_tua" as KontakDaruratType,
    kontak_darurat_nomor_hp: "",
    nominal_pembayaran: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on component mount
  useEffect(() => {
    async function loadData() {
      // Get user and kos data
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: kosData, error: kosError } = await supabase
        .from("kos")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (kosError || !kosData) {
        console.error("Error fetching kos:", kosError);
        return;
      }

      setKosData(kosData);

      // Get penghuni data
      const { data: penghuniData, error: penghuniError } = await supabase
        .from("penghuni")
        .select("*")
        .eq("kos_id", kosData.id)
        .eq("status", "aktif");

      if (penghuniError) {
        console.error("Error fetching penghuni:", penghuniError);
        return;
      }

      setPenghuni(penghuniData || []);
    }

    loadData();
  }, [router, supabase]);

  useEffect(() => {
    // Tambahkan class overflow-hidden ke body saat modal terbuka
    if (isModalOpen || isLimitModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, isLimitModalOpen]);

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handleKamarClick = (id: string) => {
    router.push(`/dashboard/penghuni/${id}`);
  };

  const handleTambahPenghuniClick = () => {
    // Jika bukan pro dan jumlah penghuni >= 5, tampilkan modal limit
    if (kosData.plan_type !== "pro" && penghuni.length >= 5) {
      setIsLimitModalOpen(true);
      return;
    }
    // Jika pro atau jumlah penghuni < 5, tampilkan modal tambah penghuni
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      nama: "",
      nomor_kamar: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      nomor_hp: "",
      nomor_ktp: "",
      deposit: "",
      kontak_darurat_nama: "",
      kontak_darurat_tipe: "orang_tua" as KontakDaruratType,
      kontak_darurat_nomor_hp: "",
      nominal_pembayaran: "",
    });
  };

  const handleCloseLimitModal = () => {
    setIsLimitModalOpen(false);
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // Validasi input
      if (
        !formData.nama ||
        !formData.nomor_kamar ||
        !formData.tanggal_mulai ||
        !formData.tanggal_selesai ||
        !formData.nomor_hp ||
        !formData.kontak_darurat_nama ||
        !formData.kontak_darurat_nomor_hp ||
        !formData.nominal_pembayaran
      ) {
        throw new Error("Mohon lengkapi semua field yang wajib diisi");
      }

      // Cek jumlah penghuni aktif saat ini
      const { data: penghuniAktif, error: penghuniError } = await supabase
        .from("penghuni")
        .select("id")
        .eq("kos_id", kosData.id)
        .eq("status", "aktif");

      if (penghuniError) {
        throw new Error("Gagal mengecek jumlah penghuni aktif");
      }

      const jumlahPenghuniAktif = penghuniAktif?.length || 0;

      // Jika jumlah penghuni aktif sama dengan jumlah kamar, update jumlah kamar
      if (jumlahPenghuniAktif >= kosData.jumlah_kamar) {
        const { error: updateKamarError } = await supabase
          .from("kos")
          .update({ jumlah_kamar: kosData.jumlah_kamar + 1 })
          .eq("id", kosData.id);

        if (updateKamarError) {
          throw new Error("Gagal mengupdate jumlah kamar");
        }

        // Update state kosData
        setKosData({
          ...kosData,
          jumlah_kamar: kosData.jumlah_kamar + 1,
        });
      }

      // Format data penghuni
      const penghuniData = {
        kos_id: kosData.id,
        nama: formData.nama,
        nomor_kamar: formData.nomor_kamar,
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai,
        nomor_hp: formData.nomor_hp,
        nomor_ktp: formData.nomor_ktp || null,
        deposit: formData.deposit || null,
        kontak_darurat: {
          nama: formData.kontak_darurat_nama,
          tipe: formData.kontak_darurat_tipe,
          nomor_hp: formData.kontak_darurat_nomor_hp,
        },
        status: "aktif",
      };

      // Insert penghuni data
      const { data: newPenghuniData, error: penghuniInsertError } =
        await supabase.from("penghuni").insert(penghuniData).select().single();

      if (penghuniInsertError) {
        throw new Error(
          `Gagal menambahkan penghuni: ${penghuniInsertError.message}`
        );
      }

      // Insert pembayaran data
      const pembayaranData = {
        kos_id: kosData.id,
        penghuni_id: newPenghuniData.id,
        jenis: "pemasukan",
        kategori: "pembayaran_awal",
        deskripsi: `Pembayaran awal dari ${formData.nama}`,
        jumlah: parseInt(formData.nominal_pembayaran.replace(/[^0-9]/g, "")),
        tanggal: new Date().toISOString().split("T")[0],
        keterangan: `Pembayaran sewa kamar ${formData.nomor_kamar}`,
        status: "aktif",
      };

      const { error: pembayaranError } = await supabase
        .from("keuangan")
        .insert(pembayaranData);

      if (pembayaranError) {
        throw new Error(
          `Gagal menambahkan pembayaran: ${pembayaranError.message}`
        );
      }

      // Update UI
      setPenghuni((prev) => [...prev, newPenghuniData]);

      // Reset form
      setFormData({
        nama: "",
        nomor_kamar: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        nomor_hp: "",
        nomor_ktp: "",
        deposit: "",
        kontak_darurat_nama: "",
        kontak_darurat_tipe: "orang_tua" as KontakDaruratType,
        kontak_darurat_nomor_hp: "",
        nominal_pembayaran: "",
      });

      setIsModalOpen(false);

      // Show success notification
      setToastMessage("Berhasil menambahkan penghuni baru");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error lengkap:", error);
      setToastMessage(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan penghuni baru"
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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

  const handleTambahPenghuni = async (
    dataPenghuni: Omit<
      PenghuniData,
      "id" | "kos_id" | "created_at" | "updated_at"
    >
  ) => {
    // Cek dulu jumlah penghuni saat ini
    const { data: existingPenghuni, error: countError } = await supabase
      .from("penghuni")
      .select("id")
      .eq("kos_id", kosData.id);

    if (countError) {
      console.error("Error menghitung penghuni:", countError);
      return false;
    }

    const jumlahPenghuniSaatIni = existingPenghuni
      ? existingPenghuni.length
      : 0;

    // Jika bukan pro, cek batas maksimal
    if (kosData.plan_type !== "pro" && jumlahPenghuniSaatIni >= 5) {
      alert(
        "Oops! Anda hanya bisa menambahkan 5 penghuni. Upgrade ke Pro untuk kelola kos Anda tanpa batas!"
      );
      return false;
    }

    // Cek apakah perlu menambah jumlah kamar
    if (jumlahPenghuniSaatIni >= kosData.jumlah_kamar) {
      // Tambah jumlah kamar di database
      const { error: updateError } = await supabase
        .from("kos")
        .update({ jumlah_kamar: kosData.jumlah_kamar + 1 })
        .eq("id", kosData.id);

      if (updateError) {
        console.error("Error menambah jumlah kamar:", updateError);
        return false;
      }

      // Update state kosData
      setKosData({
        ...kosData,
        jumlah_kamar: kosData.jumlah_kamar + 1,
      });
    }

    // Proses penambahan penghuni
    const { error: insertError } = await supabase
      .from("penghuni")
      .insert({ ...dataPenghuni, kos_id: kosData.id });

    if (insertError) {
      console.error("Error menambah penghuni:", insertError);
      return false;
    }

    return true;
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
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-5 ">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md mb-8"
        >
          <FaArrowLeft /> Kembali
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
          <h1 className="text-2xl font-bold text-gray-900 ">
            Daftar Penghuni Kos
          </h1>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="relative w-full sm:w-80">
            {" "}
            {/* Wider search input */}
            <input
              type="text"
              placeholder="Cari penghuni atau nomor kamar..."
              className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="flex items-center justify-center w-full gap-2 bg-blue-100 hover:bg-blue-200 p-4 py-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 text-gray-500 font-bold"
        >
          {" "}
          <FaPlus className="text-blue-600" />
          Tambah Penghuni Baru
        </button>
        <section className="space-y-3">
          {penghuni.length === 0 ? (
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
              {penghuni
                .filter(
                  (penghuni) =>
                    penghuni.nama
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    penghuni.nomor_kamar
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .sort(
                  (a, b) =>
                    new Date(a.tanggal_selesai).getTime() -
                    new Date(b.tanggal_selesai).getTime()
                ) // Sort by tanggal_selesai
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
                            {formatDate(penghuni.tanggal_selesai)}
                          </span>
                        </p>
                        {(() => {
                          const today = new Date();
                          const selesaiDate = new Date(
                            penghuni.tanggal_selesai
                          );
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
                          {penghuni.nomor_kamar}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-hidden h-[100vh] w-[100vw]">
            <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
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
                    htmlFor="nomor_kamar"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nomor Kamar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nomor_kamar"
                    name="nomor_kamar"
                    value={formData.nomor_kamar}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nomor Kamar"
                    required
                  />
                </div>

                {/* Nomor HP */}
                <div className="mb-4">
                  <label
                    htmlFor="nomor_hp"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nomor HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nomor_hp"
                    name="nomor_hp"
                    value={formData.nomor_hp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nomor HP"
                    required
                  />
                </div>

                {/* Nomor KTP (Opsional) */}
                <div className="mb-4">
                  <label
                    htmlFor="nomor_ktp"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nomor KTP <span className="text-gray-400">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    id="nomor_ktp"
                    name="nomor_ktp"
                    value={formData.nomor_ktp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nomor KTP"
                  />
                </div>

                {/* Kontak Darurat - Nama */}
                <div className="mb-4">
                  <label
                    htmlFor="kontak_darurat_nama"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nama Kontak Darurat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="kontak_darurat_nama"
                    name="kontak_darurat_nama"
                    value={formData.kontak_darurat_nama}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nama Kontak Darurat"
                    required
                  />
                </div>

                {/* Kontak Darurat - Tipe */}
                <div className="mb-4">
                  <label
                    htmlFor="kontak_darurat_tipe"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Tipe Kontak Darurat <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="kontak_darurat_tipe"
                    name="kontak_darurat_tipe"
                    value={formData.kontak_darurat_tipe}
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
                    htmlFor="kontak_darurat_nomor_hp"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nomor HP Kontak Darurat{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="kontak_darurat_nomor_hp"
                    name="kontak_darurat_nomor_hp"
                    value={formData.kontak_darurat_nomor_hp}
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
                    htmlFor="tanggal_mulai"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Tanggal Mulai Kos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="tanggal_mulai"
                    name="tanggal_mulai"
                    value={formData.tanggal_mulai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Tanggal Selesai */}
                <div className="mb-4">
                  <label
                    htmlFor="tanggal_selesai"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Kos Sampai Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="tanggal_selesai"
                    name="tanggal_selesai"
                    value={formData.tanggal_selesai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Nominal Pembayaran */}
                <div className="mb-4">
                  <label
                    htmlFor="nominal_pembayaran"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nominal Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nominal_pembayaran"
                    name="nominal_pembayaran"
                    value={formData.nominal_pembayaran}
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

        {/* Modal Limit Penghuni */}
        {isLimitModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-hidden h-[100vh] w-[100vw]">
            <div className="bg-white p-8 rounded-xl shadow-lg relative max-w-md w-full mx-4">
              <button
                onClick={handleCloseLimitModal}
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
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-16 h-16 text-yellow-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>

                <p className="text-gray-600 mb-6">
                  Oops! Anda hanya bisa menambahkan 5 kamar. Upgrade ke Pro
                  untuk kelola kos Anda tanpa batas!
                </p>
                <button
                  onClick={handleCloseLimitModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg w-full"
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tombol Lihat Daftar Penghuni Lama */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push("/dashboard/penghuni-lama")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <FaHistory className="text-gray-600" />
            Lihat Daftar Penghuni Lama
          </button>
        </div>
      </div>
    </div>
  );
};

export default Penghuni;
