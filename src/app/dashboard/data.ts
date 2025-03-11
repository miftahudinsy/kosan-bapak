// c:\Users\mifta\next-js\bapak-kosan\src\app\dashboard\data.ts

// Inisialisasi data awal di sini
const initialData = [
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

// Menyimpan data ke localStorage
const saveDataToLocalStorage = (data: any) => {
  if (typeof window !== "undefined") {
    // Memastikan kode hanya berjalan di sisi klien
    localStorage.setItem("daftarPenghuni", JSON.stringify(data));
  }
};

export const getDaftarPenghuni = () => {
  if (typeof window !== "undefined") {
    // Memastikan kode hanya berjalan di sisi klien
    const storedData = localStorage.getItem("daftarPenghuni");
    return storedData ? JSON.parse(storedData) : initialData;
  }
  return initialData;
};

export const tambahPenghuni = (dataPenghuni: {
  nama: string;
  noKamar: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}) => {
  const currentData = getDaftarPenghuni();
  const idBaru =
    currentData.length > 0 ? currentData[currentData.length - 1].id + 1 : 1;
  const newData = [...currentData, { id: idBaru, ...dataPenghuni }];
  saveDataToLocalStorage(newData); // Menyimpan data setiap kali ada perubahan
};
