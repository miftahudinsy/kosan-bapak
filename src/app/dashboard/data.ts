// c:\Users\mifta\next-js\bapak-kosan\src\app\dashboard\data.ts

//Definisikan Interface PenghuniData
export interface PenghuniData {
  id: number;
  noKamar: string;
  nama: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

// Inisialisasi data awal di sini (sekarang di-export agar bisa digunakan di luar file ini)
export const initialData: PenghuniData[] = [
  {
    id: 1,
    noKamar: "A1",
    nama: "Budi Dabudi Agung",
    tanggalMulai: "2025-02-14",
    tanggalSelesai: "2025-05-14",
  },
  {
    id: 2,
    noKamar: "A2",
    nama: "Sadana Kocak",
    tanggalMulai: "2025-02-25",
    tanggalSelesai: "2025-03-25",
  },
];

// Menyimpan data ke localStorage (sekarang dengan tipe data yang benar)
const saveDataToLocalStorage = (data: PenghuniData[]) => {
  if (typeof window !== "undefined") {
    // Memastikan kode hanya berjalan di sisi klien
    localStorage.setItem("daftarPenghuni", JSON.stringify(data));
  }
};

// Mendapatkan data dari localStorage atau menggunakan initialData (sekarang dengan tipe data kembalian)
export const getDaftarPenghuni = (): PenghuniData[] => {
  if (typeof window !== "undefined") {
    // Memastikan kode hanya berjalan di sisi klien
    const storedData = localStorage.getItem("daftarPenghuni");
    return storedData ? JSON.parse(storedData) : initialData;
  }
  return initialData;
};

// Menambah penghuni baru (sekarang dengan tipe data kembalian dan parameter yang benar)
export const tambahPenghuni = (dataPenghuni: Omit<PenghuniData, "id">) => {
  const currentData = getDaftarPenghuni();
  const lastId =
    currentData.length > 0
      ? Math.max(...currentData.map((item) => item.id))
      : 0;
  const newId = lastId + 1;

  const newData: PenghuniData[] = [
    ...currentData,
    { id: newId, ...dataPenghuni },
  ];
  saveDataToLocalStorage(newData); // Menyimpan data setiap kali ada perubahan
};
