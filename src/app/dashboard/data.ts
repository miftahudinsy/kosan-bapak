// c:\Users\mifta\next-js\bapak-kosan\src\app\dashboard\data.ts

// Enum untuk tipe kontak darurat
export enum KontakDaruratType {
  ORANG_TUA = "Orang Tua",
  WALI = "Wali",
}

//Definisikan Interface PenghuniData dengan field tambahan
export interface PenghuniData {
  id: number;
  nama: string;
  noKamar: string;
  noHP: string;
  noKTP?: string; // Opsional
  kontakDarurat: {
    nama: string;
    tipe: KontakDaruratType;
    noHP: string;
  };
  deposit?: string; // Opsional, disimpan dalam format mata uang Indonesia
  tanggalMulai: string;
  tanggalSelesai: string;
}

// Empty initial data array
export const initialData: PenghuniData[] = [];

// Menyimpan data ke localStorage (sekarang dengan tipe data yang benar)
const saveDataToLocalStorage = (data: PenghuniData[]) => {
  if (typeof window !== "undefined") {
    // Memastikan kode hanya berjalan di sisi klien
    localStorage.setItem("daftarPenghuni", JSON.stringify(data));
  }
};

// Mendapatkan data dari localStorage atau menggunakan empty array
export const getDaftarPenghuni = (): PenghuniData[] => {
  if (typeof window !== "undefined") {
    // Memastikan kode hanya berjalan di sisi klien
    const storedData = localStorage.getItem("daftarPenghuni");
    return storedData ? JSON.parse(storedData) : [];
  }
  return [];
};

// Format angka menjadi mata uang Indonesia
export const formatCurrency = (amount: number | string): string => {
  if (typeof amount === "string") {
    amount = parseInt(amount.replace(/\D/g, ""), 10);
  }

  if (isNaN(amount)) {
    return "Rp0,-";
  }

  return `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`;
};

// Parse mata uang Indonesia menjadi angka
export const parseCurrency = (formattedAmount: string): number => {
  const numericString = formattedAmount.replace(/[^\d]/g, "");
  return parseInt(numericString, 10) || 0;
};

// Menambah penghuni baru (sekarang dengan tipe data kembalian dan parameter yang benar)
export const tambahPenghuni = (dataPenghuni: Omit<PenghuniData, "id">) => {
  const currentData = getDaftarPenghuni();
  const lastId =
    currentData.length > 0
      ? Math.max(...currentData.map((item) => item.id))
      : 0;
  const newId = lastId + 1;

  // Format deposit jika ada
  let formattedData = { ...dataPenghuni };
  if (
    formattedData.deposit &&
    typeof formattedData.deposit === "string" &&
    !formattedData.deposit.startsWith("Rp")
  ) {
    formattedData.deposit = formatCurrency(formattedData.deposit);
  }

  const newData: PenghuniData[] = [
    ...currentData,
    { id: newId, ...formattedData },
  ];
  saveDataToLocalStorage(newData);
  return newData;
};

// Edit data penghuni
export const editPenghuni = (
  id: number,
  data: Partial<Omit<PenghuniData, "id">>
) => {
  const currentData = getDaftarPenghuni();

  // Format deposit jika ada
  let formattedData = { ...data };
  if (
    formattedData.deposit &&
    typeof formattedData.deposit === "string" &&
    !formattedData.deposit.startsWith("Rp")
  ) {
    formattedData.deposit = formatCurrency(formattedData.deposit);
  }

  const updatedData = currentData.map((item) =>
    item.id === id ? { ...item, ...formattedData } : item
  );
  saveDataToLocalStorage(updatedData);
  return updatedData;
};

// Perpanjang masa kos
export const perpanjangKos = (id: number, tanggalSelesaiBaru: string) => {
  const currentData = getDaftarPenghuni();
  const updatedData = currentData.map((item) =>
    item.id === id ? { ...item, tanggalSelesai: tanggalSelesaiBaru } : item
  );
  saveDataToLocalStorage(updatedData);
  return updatedData;
};

// Hapus data penghuni
export const hapusPenghuni = (id: number) => {
  const currentData = getDaftarPenghuni();
  const updatedData = currentData.filter((item) => item.id !== id);
  saveDataToLocalStorage(updatedData);
  return updatedData;
};

// Mendapatkan detail penghuni berdasarkan ID
export const getPenghuniById = (id: number): PenghuniData | undefined => {
  const currentData = getDaftarPenghuni();
  return currentData.find((item) => item.id === id);
};
