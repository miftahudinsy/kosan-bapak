"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export default function UpgradePage() {
  const router = useRouter();
  const supabase = createClient();
  const [licenseCode, setLicenseCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load saved license code
  useEffect(() => {
    async function loadLicenseCode() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: kosData, error: kosError } = await supabase
          .from("kos")
          .select("license_code")
          .eq("user_id", user.id)
          .single();

        if (kosError) throw kosError;

        if (kosData?.license_code) {
          setLicenseCode(kosData.license_code);
          setShowSuccess(true);
        }
      } catch (error) {
        console.error("Error loading license code:", error);
      }
    }

    loadLicenseCode();
  }, [supabase]);

  const handleBack = () => {
    router.back();
  };

  const handleUpgradeClick = () => {
    window.open("https://kosanbapak.myr.id/m/kosan-bapak-pro", "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Dapatkan user saat ini
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User tidak ditemukan");
      }

      // Ambil data kos user
      const { data: kosData, error: kosError } = await supabase
        .from("kos")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (kosError || !kosData) {
        throw new Error("Data kos tidak ditemukan");
      }

      // Simpan kode lisensi ke database
      const { error: updateError } = await supabase
        .from("kos")
        .update({
          license_code: licenseCode,
        })
        .eq("id", kosData.id);

      if (updateError) {
        throw new Error("Gagal menyimpan kode lisensi");
      }

      setShowSuccess(true);
      setLicenseCode("");
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan kode lisensi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md"
        >
          <FaArrowLeft /> Kembali
        </button>

        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Cara Upgrade ke Kosan Bapak Pro
          </h1>

          <div className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-lg">
              <ol className="list-decimal list-inside space-y-4">
                <li className="text-gray-700">
                  <span className="font-medium">
                    Klik tombol Upgrade Sekarang
                  </span>
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">
                    Pilih paket 1 bulan atau 12 bulan
                  </span>
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Lakukan pembayaran</span>
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">
                    Copy kode lisensi yang didapat dan paste di sini
                  </span>
                </li>
              </ol>
            </div>

            {/* Tombol Upgrade Sekarang */}
            <button
              onClick={handleUpgradeClick}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-lg transition-colors shadow-md"
            >
              Upgrade Sekarang
            </button>

            {/* Form Kode Lisensi */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              <div className="space-y-2">
                <label
                  htmlFor="licenseCode"
                  className="block text-gray-700 font-medium"
                >
                  Kode Lisensi
                </label>
                <input
                  type="text"
                  id="licenseCode"
                  value={licenseCode}
                  onChange={(e) => setLicenseCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan kode lisensi Anda"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors
                  ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
              >
                {loading ? "Menyimpan..." : "Simpan Kode Lisensi"}
              </button>
            </form>

            {/* Pesan Sukses */}
            {showSuccess && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mt-4">
                <p>
                  Kode lisensi{" "}
                  <span className="font-semibold">{licenseCode}</span> telah
                  tersimpan.
                </p>
                <p>Mohon tunggu proses verifikasi.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
