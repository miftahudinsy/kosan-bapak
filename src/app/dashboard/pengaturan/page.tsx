"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa";

export default function Pengaturan() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [showUpgradeMessage, setShowUpgradeMessage] = useState(false);
  const [formData, setFormData] = useState({
    namaKos: "",
    jumlahKamar: "1",
    templatePesan: "",
  });

  useEffect(() => {
    // Ambil data dari localStorage
    const savedKosData = localStorage.getItem("kosData");
    if (savedKosData) {
      const data = JSON.parse(savedKosData);
      setFormData({
        namaKos: data.namaKos,
        jumlahKamar: data.jumlahKamar.toString(),
        templatePesan:
          data.templatePesan ||
          "Pangapunten, kos sampai tanggal [tanggalselesaikos], mohon konfirmasi kalau sudah bayar",
      });
    }
  }, []);

  const handleIncrement = () => {
    const currentValue = parseInt(formData.jumlahKamar);
    if (currentValue < 5) {
      setFormData({ ...formData, jumlahKamar: String(currentValue + 1) });
      setShowUpgradeMessage(false);
    } else {
      setShowUpgradeMessage(true);
    }
  };

  const handleDecrement = () => {
    const currentValue = parseInt(formData.jumlahKamar);
    if (currentValue > 1) {
      setFormData({ ...formData, jumlahKamar: String(currentValue - 1) });
      setShowUpgradeMessage(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!formData.namaKos || !formData.jumlahKamar) {
      alert("Mohon isi semua data");
      return;
    }

    // Simpan ke localStorage dengan template pesan
    localStorage.setItem(
      "kosData",
      JSON.stringify({
        namaKos: formData.namaKos,
        jumlahKamar: parseInt(formData.jumlahKamar),
        templatePesan: formData.templatePesan,
      })
    );

    // Tampilkan toast
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push("/dashboard"); // Kembali ke dashboard setelah simpan
    }, 2000);
  };

  const handleBack = () => {
    router.back();
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
            <span className="text-lg font-medium">
              Berhasil menyimpan data kos
            </span>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md"
        >
          <FaArrowLeft /> Kembali
        </button>

        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nama Kos
              </label>
              <input
                type="text"
                value={formData.namaKos}
                onChange={(e) =>
                  setFormData({ ...formData, namaKos: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Jumlah Kamar
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                >
                  <FaMinus />
                </button>
                <div className="flex-1 text-center text-2xl font-bold text-gray-900">
                  {formData.jumlahKamar}
                </div>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Pesan Upgrade */}
              {showUpgradeMessage && (
                <div className="mt-4 space-y-3">
                  <p className="text-yellow-600 text-sm sm:text-base text-center">
                    Oops! Anda hanya bisa menambahkan 5 kamar.<br></br>Upgrade
                    ke Pro untuk kelola kos Anda tanpa batas!
                  </p>
                </div>
              )}
            </div>

            {/* Template Pesan WhatsApp */}

            <div className="space-y-3 border border-gray-200 rounded-lg p-4">
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">
                  Format Pesan Pengingat via WA
                </label>
              </div>
              <textarea
                value={formData.templatePesan}
                onChange={(e) =>
                  setFormData({ ...formData, templatePesan: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Contoh: Halo %nama%, ini pengingat untuk pembayaran kos bulan ini."
              />
            </div>

            <div className="space-y-2">
              <p className="text-gray-600">Paket lisensi:</p>
              <p className="font-medium text-gray-900">Gratis</p>
            </div>

            <button
              type="button"
              onClick={() => {}}
              className="w-full bg-yellow-500 text-white font-medium py-3 rounded-lg hover:bg-yellow-600 transition-colors mb-4"
            >
              Upgrade ke Pro
            </button>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Simpan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
