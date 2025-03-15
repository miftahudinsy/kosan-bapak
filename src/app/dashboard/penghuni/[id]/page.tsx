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
  FaWhatsapp,
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
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface KontakDaruratData {
  nama: string;
  tipe: string;
  nomor_hp: string;
}

interface DatabasePenghuni {
  id: number;
  kos_id: number;
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
  kontak_darurat: KontakDaruratData;
  status: string;
  created_at: string;
  updated_at: string;
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    nomor_kamar: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    nomor_hp: "",
    nomor_ktp: "",
    deposit: "",
    kontak_darurat_nama: "",
    kontak_darurat_tipe: "",
    kontak_darurat_nomor_hp: "",
    nominal_pembayaran: "",
  });
  const [templatePesan, setTemplatePesan] = useState("");

  useEffect(() => {
    const fetchPenghuni = async () => {
      try {
        const { data: penghuniData, error } = await supabase
          .from("penghuni")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (error) throw error;

        // Pastikan data yang diterima sesuai dengan interface PenghuniData
        const dbPenghuni = penghuniData as DatabasePenghuni;
        const formattedPenghuni: PenghuniData = {
          ...dbPenghuni,
          id: dbPenghuni.id.toString(),
          kos_id: dbPenghuni.kos_id.toString(),
        };

        setPenghuni(formattedPenghuni);

        if (formattedPenghuni) {
          setFormData({
            nama: formattedPenghuni.nama || "",
            nomor_kamar: formattedPenghuni.nomor_kamar || "",
            tanggal_mulai: formattedPenghuni.tanggal_mulai || "",
            tanggal_selesai: formattedPenghuni.tanggal_selesai || "",
            nomor_hp: formattedPenghuni.nomor_hp || "",
            nomor_ktp: formattedPenghuni.nomor_ktp || "",
            deposit: formattedPenghuni.deposit || "",
            kontak_darurat_nama: formattedPenghuni.kontak_darurat?.nama || "",
            kontak_darurat_tipe: formattedPenghuni.kontak_darurat?.tipe || "",
            kontak_darurat_nomor_hp:
              formattedPenghuni.kontak_darurat?.nomor_hp || "",
            nominal_pembayaran: "",
          });
        }
      } catch (error) {
        console.error("Error fetching penghuni:", error);
      }
    };

    fetchPenghuni();
  }, [resolvedParams.id]);

  useEffect(() => {
    const savedKosData = localStorage.getItem("kosData");
    if (savedKosData) {
      const data = JSON.parse(savedKosData);
      setTemplatePesan(
        data.templatePesan ||
          "Pangapunten, kos sampai tanggal [tanggalselesaikos], mohon konfirmasi kalau sudah bayar"
      );
    }
  }, []);

  const handleBack = () => {
    router.push("/dashboard/penghuni");
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

  const handleEditSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (penghuni) {
      try {
        // Persiapkan data kontak darurat
        const kontakDaruratData: KontakDaruratData = {
          nama: formData.kontak_darurat_nama,
          tipe: formData.kontak_darurat_tipe,
          nomor_hp: formData.kontak_darurat_nomor_hp,
        };

        // Edit data penghuni
        const { data: updatedPenghuni, error } = await supabase
          .from("penghuni")
          .update({
            nama: formData.nama,
            nomor_kamar: formData.nomor_kamar,
            tanggal_mulai: formData.tanggal_mulai,
            tanggal_selesai: formData.tanggal_selesai,
            nomor_hp: formData.nomor_hp,
            nomor_ktp: formData.nomor_ktp,
            deposit: formData.deposit,
            kontak_darurat: kontakDaruratData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", penghuni.id)
          .select()
          .single();

        if (error) throw error;

        if (updatedPenghuni) {
          const formattedUpdatedPenghuni: PenghuniData = {
            ...updatedPenghuni,
            id: updatedPenghuni.id.toString(),
            kos_id: updatedPenghuni.kos_id.toString(),
          };
          setPenghuni(formattedUpdatedPenghuni);
        }

        // Tampilkan notifikasi
        setToastMessage("Berhasil menyimpan data");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        console.error("Error:", error);
        setToastMessage("Gagal menyimpan data");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      setIsEditModalOpen(false);
    }
  };

  const handlePerpanjangSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (penghuni) {
      try {
        // Update tanggal selesai penghuni
        const { data: updatedPenghuni, error: updateError } = await supabase
          .from("penghuni")
          .update({
            tanggal_selesai: formData.tanggal_selesai,
            updated_at: new Date().toISOString(),
          })
          .eq("id", penghuni.id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Tambah riwayat pembayaran
        if (formData.nominal_pembayaran) {
          const jumlahPembayaran = parseInt(
            formData.nominal_pembayaran.replace(/[^0-9]/g, ""),
            10
          );

          const pembayaranData = {
            kos_id: parseInt(penghuni.kos_id),
            penghuni_id: parseInt(penghuni.id),
            jenis: "pemasukan" as const,
            kategori: "perpanjangan" as const,
            deskripsi: `Perpanjangan sewa dari ${penghuni.nama}`,
            jumlah: jumlahPembayaran,
            tanggal: new Date().toISOString().split("T")[0],
            keterangan: `Perpanjangan sewa kamar ${penghuni.nomor_kamar}`,
            status: "aktif" as const,
          };

          const { error: pembayaranError } = await supabase
            .from("keuangan")
            .insert(pembayaranData);

          if (pembayaranError) throw pembayaranError;
        }

        // Update state dengan memastikan tipe data yang benar
        if (updatedPenghuni) {
          const dbPenghuni = updatedPenghuni as DatabasePenghuni;
          const formattedUpdatedPenghuni: PenghuniData = {
            ...dbPenghuni,
            id: dbPenghuni.id.toString(),
            kos_id: dbPenghuni.kos_id.toString(),
          };
          setPenghuni(formattedUpdatedPenghuni);
        }

        // Tampilkan notifikasi
        setToastMessage("Berhasil memperpanjang sewa kos");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        setIsPerpanjangModalOpen(false);
      } catch (error) {
        console.error("Error:", error);
        setToastMessage("Gagal memperpanjang sewa kos");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  const handleDelete = async () => {
    if (penghuni) {
      try {
        // Log ID yang akan dihapus
        console.log("ID penghuni yang akan dihapus:", penghuni.id);
        console.log("Tipe data ID:", typeof penghuni.id);

        // Konversi ID ke numerik
        const numericId = parseInt(penghuni.id);
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

        // Periksa apakah ada data keuangan terkait
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

        // Lakukan penghapusan penghuni
        const { error } = await supabase
          .from("penghuni")
          .delete()
          .eq("id", numericId);

        if (error) {
          console.error("Error detail saat menghapus penghuni:", error);
          throw error;
        }

        // Jika berhasil, update UI
        console.log("Berhasil menghapus penghuni dengan ID:", numericId);
        setToastMessage("Berhasil menghapus data penghuni");
        setShowToast(true);
        setTimeout(() => {
          setIsDeleteModalOpen(false);
          router.push("/dashboard/penghuni");
        }, 1000);
      } catch (error) {
        console.error("Error lengkap:", error);
        setToastMessage(
          error instanceof Error
            ? `Gagal menghapus data penghuni: ${error.message}`
            : "Gagal menghapus data penghuni"
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  const handleAkhiriSewa = () => {
    setIsAkhiriSewaModalOpen(true);
  };

  const handleAkhiriSewaConfirm = async () => {
    if (!penghuni) return;

    try {
      const { error } = await supabase
        .from("penghuni")
        .update({ status: "tidak aktif", updated_at: new Date().toISOString() })
        .eq("id", parseInt(penghuni.id));

      if (error) {
        console.error("Error mengakhiri sewa:", error);
        setToastMessage("Gagal mengakhiri sewa: " + error.message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      setToastMessage("Berhasil mengakhiri sewa kos");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Kemudian redirect ke halaman utama
      setTimeout(() => {
        router.push("/dashboard/penghuni");
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setToastMessage("Terjadi kesalahan saat mengakhiri sewa");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }

    setIsAkhiriSewaModalOpen(false);
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

  // Tambahkan fungsi format nomor HP
  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone) return "";

    // Hapus semua karakter non-digit
    let numbers = phone.replace(/\D/g, "");

    // Hapus angka 0 di depan jika ada
    if (numbers.startsWith("0")) {
      numbers = numbers.substring(1);
    }

    // Tambahkan kode negara 62
    return `62${numbers}`;
  };

  // Fungsi untuk menampilkan nomor HP dengan format 0xxx
  const formatPhoneNumberForDisplay = (phone: string | undefined) => {
    if (!phone) return "";

    // Hapus semua karakter non-digit
    let numbers = phone.replace(/\D/g, "");

    // Jika nomor dimulai dengan 62, ubah menjadi 0
    if (numbers.startsWith("62")) {
      numbers = "0" + numbers.substring(2);
    } else if (!numbers.startsWith("0")) {
      // Jika tidak dimulai dengan 0, tambahkan 0 di depan
      numbers = "0" + numbers;
    }

    return numbers;
  };

  // Fungsi untuk mengubah snake_case menjadi Title Case
  const formatContactType = (type: string): string => {
    if (!type) return "";
    // Ubah dari snake_case menjadi Title Case
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fungsi untuk menampilkan kontak darurat
  const renderKontakDarurat = () => {
    if (!penghuni?.kontak_darurat) return null;

    const kontakDarurat = penghuni.kontak_darurat;
    return (
      <div className="space-y-1">
        <h2 className="text-gray-600">Kontak Darurat</h2>
        <div className="space-y-2">
          {kontakDarurat.nama && (
            <p className="text-lg font-semibold text-gray-900">
              {kontakDarurat.nama}
              {kontakDarurat.tipe && (
                <span className="ml-2 text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  {formatContactType(kontakDarurat.tipe)}
                </span>
              )}
            </p>
          )}
          {kontakDarurat.nomor_hp && (
            <p className="text-lg font-semibold text-gray-900">
              {formatPhoneNumberForDisplay(kontakDarurat.nomor_hp)}
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
                {penghuni.nomor_kamar}
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
                {penghuni.nomor_kamar}
              </p>
            </div>

            {/* Nomor HP */}
            {penghuni.nomor_hp && (
              <div className="space-y-1">
                <h2 className="text-gray-600">Nomor HP</h2>
                <p className="text-lg font-semibold text-gray-900">
                  {formatPhoneNumberForDisplay(penghuni.nomor_hp)}
                </p>
              </div>
            )}

            {/* Nomor KTP */}
            {penghuni.nomor_ktp && (
              <div className="space-y-1">
                <h2 className="text-gray-600">Nomor KTP</h2>
                <p className="text-lg font-semibold text-gray-900">
                  {penghuni.nomor_ktp}
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
                  {formatDate(penghuni.tanggal_mulai)}
                </p>
              </div>

              <div className="space-y-1">
                <h2 className="text-gray-600">Tanggal Selesai Kos</h2>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(penghuni.tanggal_selesai)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-gray-600">Status</h2>
              {(() => {
                const today = new Date();
                const selesaiDate = new Date(penghuni.tanggal_selesai);
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

            {/* Tambahkan tombol WhatsApp di sini */}
            <div className="mb-6">
              <a
                href={`https://api.whatsapp.com/send?phone=${formatPhoneNumber(
                  penghuni.nomor_hp
                )}&text=${encodeURIComponent(
                  templatePesan.replace(
                    "[tanggalselesaikos]",
                    formatDate(penghuni.tanggal_selesai)
                  )
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaWhatsapp className="text-xl" />
                Ingatkan Via WA
              </a>
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
              onClick={handleAkhiriSewa}
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
                  name="nomor_kamar"
                  value={formData.nomor_kamar}
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
                  name="nomor_hp"
                  value={formData.nomor_hp}
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
                  name="nomor_ktp"
                  value={formData.nomor_ktp}
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
                      name="kontak_darurat_nama"
                      value={formData.kontak_darurat_nama}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">
                      Hubungan
                    </label>
                    <select
                      name="kontak_darurat_tipe"
                      value={formData.kontak_darurat_tipe}
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
                      name="kontak_darurat_nomor_hp"
                      value={formData.kontak_darurat_nomor_hp}
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
                  name="tanggal_mulai"
                  value={formData.tanggal_mulai}
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
                  name="tanggal_selesai"
                  value={formData.tanggal_selesai}
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
                  name="tanggal_selesai"
                  value={formData.tanggal_selesai}
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
                  name="nominal_pembayaran"
                  value={formData.nominal_pembayaran}
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
                onClick={handleAkhiriSewaConfirm}
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
