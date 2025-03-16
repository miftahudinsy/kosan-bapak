"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function Welcome() {
  const router = useRouter();
  const [namaKos, setNamaKos] = useState("");
  const [jumlahKamar, setJumlahKamar] = useState(1);
  const [showUpgradeMessage, setShowUpgradeMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleIncrement = () => {
    if (jumlahKamar < 5) {
      setJumlahKamar((prev) => prev + 1);
      setShowUpgradeMessage(false);
    } else {
      setShowUpgradeMessage(true);
    }
  };

  const handleDecrement = () => {
    if (jumlahKamar > 1) {
      setJumlahKamar((prev) => prev - 1);
      setShowUpgradeMessage(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Silakan login terlebih dahulu");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("kos").insert({
      user_id: user.id,
      nama_kos: namaKos,
      jumlah_kamar: jumlahKamar,
      template_pesan:
        "Pangapunten, kos sampai tanggal [tanggalselesaikos], mohon konfirmasi kalau sudah bayar",
      plan_type: "free",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Selamat Datang!</h1>
          <p className="text-gray-600">
            Silakan isi data awal untuk melanjutkan
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nama Kos
            </label>
            <input
              type="text"
              value={namaKos}
              onChange={(e) => setNamaKos(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Kos Bahagia"
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
                {jumlahKamar}
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
                  Oops! Anda hanya bisa menambahkan 5 kamar.<br></br>
                  Upgrade ke Pro untuk kelola kos Anda tanpa batas!
                </p>
                <button
                  type="button"
                  onClick={() => {}}
                  className="w-full bg-yellow-500 text-white font-medium py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Upgrade ke Pro
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {loading ? "Loading..." : "Mulai"}
          </button>
        </form>
      </div>
    </div>
  );
}
