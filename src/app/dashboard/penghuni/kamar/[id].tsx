// c:\Users\mifta\next-js\bapak-kosan\src\app\dashboard\penghuni\kamar\[id].tsx
"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; // Import useParams
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { getDaftarPenghuni } from "../../data";

interface PenghuniData {
  id: number;
  nama: string;
  noKamar: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

const DetailPenghuni = () => {
  const router = useRouter();
  const params = useParams();
  const [penghuni, setPenghuni] = useState<PenghuniData | null>(null);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const { id } = params;
    if (typeof id === "string") {
      const data = getDaftarPenghuni().find(
        (item: PenghuniData) => item.id === parseInt(id, 10)
      );
      setPenghuni(data || null);
    }
  }, [params]);

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
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-5 ">
        {/* Tombol Kembali */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md mb-8"
        >
          <FaArrowLeft /> Kembali
        </button>

        {penghuni ? (
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Penghuni
            </h1>
            <div className="space-y-2">
              <p>
                Nama : <span className="font-semibold">{penghuni.nama}</span>
              </p>
              <p>
                Nomor Kamar :{" "}
                <span className="font-semibold">{penghuni.noKamar}</span>
              </p>
              <p>
                Tanggal Mulai :{" "}
                <span className="font-semibold">
                  {formatDate(penghuni.tanggalMulai)}
                </span>
              </p>
              <p>
                Tanggal Selesai :{" "}
                <span className="font-semibold">
                  {formatDate(penghuni.tanggalSelesai)}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <p>Penghuni tidak ditemukan</p>
        )}
      </div>
    </div>
  );
};

export default DetailPenghuni;
