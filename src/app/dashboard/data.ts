// c:\Users\mifta\next-js\bapak-kosan\src\app\dashboard\data.ts

// Enum untuk tipe kontak darurat
export enum KontakDaruratType {
  ORANG_TUA = "orang_tua",
  WALI = "wali",
}

//Definisikan Interface PenghuniData dengan field tambahan
export interface PenghuniData {
  id: string;
  kos_id: string;
  nama: string;
  nomor_kamar: string;
  nomor_hp: string;
  nomor_ktp: string;
  kontak_darurat: string;
  deposit: number | string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  created_at?: string;
  updated_at?: string;
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
    // Hapus semua karakter non-numerik
    amount = parseInt(amount.replace(/\D/g, ""), 10);
  }

  if (isNaN(amount)) {
    return "Rp0";
  }

  // Format angka dengan pemisah ribuan
  return `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

// Parse mata uang Indonesia menjadi angka
export const parseCurrency = (formattedAmount: string): number => {
  // Hapus "Rp", pemisah ribuan, dan "-" dari string
  const numericString = formattedAmount.replace(/[^\d]/g, "");
  return parseInt(numericString, 10) || 0;
};

// Menambah penghuni baru (sekarang dengan tipe data kembalian dan parameter yang benar)
export const tambahPenghuni = (dataPenghuni: Omit<PenghuniData, "id">) => {
  const currentData = getDaftarPenghuni();
  const lastId =
    currentData.length > 0
      ? Math.max(...currentData.map((item) => parseInt(item.id, 10)))
      : 0;
  const newId = (lastId + 1).toString();

  // Format deposit jika ada
  const formattedData = { ...dataPenghuni };
  if (
    formattedData.deposit &&
    typeof formattedData.deposit === "string" &&
    !formattedData.deposit.toString().startsWith("Rp")
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
  id: string,
  data: Partial<Omit<PenghuniData, "id">>
) => {
  const currentData = getDaftarPenghuni();

  // Format deposit jika ada
  const formattedData = { ...data };
  if (
    formattedData.deposit &&
    typeof formattedData.deposit === "string" &&
    !formattedData.deposit.toString().startsWith("Rp")
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
export const perpanjangKos = (id: string, tanggalSelesaiBaru: string) => {
  const currentData = getDaftarPenghuni();
  const updatedData = currentData.map((item) =>
    item.id === id ? { ...item, tanggal_selesai: tanggalSelesaiBaru } : item
  );
  saveDataToLocalStorage(updatedData);
  return updatedData;
};

// Hapus data penghuni
export const hapusPenghuni = (id: string) => {
  const currentData = getDaftarPenghuni();
  const updatedData = currentData.filter((item) => item.id !== id);
  saveDataToLocalStorage(updatedData);
  return updatedData;
};

// Mendapatkan detail penghuni berdasarkan ID
export const getPenghuniById = (id: string): PenghuniData | undefined => {
  const currentData = getDaftarPenghuni();
  return currentData.find((item) => item.id === id);
};

export interface RiwayatPembayaran {
  id: string;
  penghuni_id: string;
  kos_id?: string;
  tanggal: string;
  nominal: string;
  jumlah?: number;
  jenis: "pemasukan";
  kategori: "pembayaran_awal" | "perpanjangan";
  deskripsi?: string;
  keterangan?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Fungsi untuk mendapatkan riwayat pembayaran
export const getRiwayatPembayaran = (): RiwayatPembayaran[] => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem("riwayatPembayaran");
  return data ? JSON.parse(data) : [];
};

// Fungsi untuk menambah riwayat pembayaran
export const tambahRiwayatPembayaran = (
  data: Omit<RiwayatPembayaran, "id">
) => {
  const riwayatPembayaran = getRiwayatPembayaran();
  const id =
    riwayatPembayaran.length > 0
      ? Math.max(...riwayatPembayaran.map((item) => parseInt(item.id, 10))) + 1
      : 1;

  const newData = { ...data, id: id.toString() };
  riwayatPembayaran.push(newData);
  localStorage.setItem("riwayatPembayaran", JSON.stringify(riwayatPembayaran));
  return riwayatPembayaran;
};

// Fungsi untuk menghapus riwayat pembayaran
export const hapusRiwayatPembayaran = (id: string) => {
  const riwayatPembayaran = getRiwayatPembayaran();
  const updatedData = riwayatPembayaran.filter((item) => item.id !== id);
  localStorage.setItem("riwayatPembayaran", JSON.stringify(updatedData));
  return updatedData;
};

export interface RiwayatPengeluaran {
  id: string;
  kos_id?: string;
  deskripsi: string;
  jenis: "pengeluaran";
  kategori: string;
  tanggal: string;
  nominal: string;
  jumlah?: number;
  keterangan?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Fungsi untuk mendapatkan riwayat pengeluaran
export const getRiwayatPengeluaran = (): RiwayatPengeluaran[] => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem("riwayatPengeluaran");
  return data ? JSON.parse(data) : [];
};

// Fungsi untuk menambah riwayat pengeluaran
export const tambahRiwayatPengeluaran = (
  data: Omit<RiwayatPengeluaran, "id">
) => {
  const riwayatPengeluaran = getRiwayatPengeluaran();
  const id =
    riwayatPengeluaran.length > 0
      ? Math.max(...riwayatPengeluaran.map((item) => parseInt(item.id, 10))) + 1
      : 1;

  const newData = { ...data, id: id.toString() };
  riwayatPengeluaran.push(newData);
  localStorage.setItem(
    "riwayatPengeluaran",
    JSON.stringify(riwayatPengeluaran)
  );
  return riwayatPengeluaran;
};

// Fungsi untuk menghapus riwayat pengeluaran
export const hapusRiwayatPengeluaran = (id: string) => {
  const riwayatPengeluaran = getRiwayatPengeluaran();
  const updatedData = riwayatPengeluaran.filter((item) => item.id !== id);
  localStorage.setItem("riwayatPengeluaran", JSON.stringify(updatedData));
  return updatedData;
};

// Fungsi untuk menyimpan data penghuni lama ke localStorage
const savePenghuniLamaToLocalStorage = (data: PenghuniData[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("daftarPenghuniLama", JSON.stringify(data));
  }
};

// Fungsi untuk mengakhiri sewa kos
export const akhiriSewaKos = (idPenghuni: string) => {
  if (typeof window === "undefined") {
    return;
  }
  const daftarPenghuni = getDaftarPenghuni();
  const penghuni = daftarPenghuni.find((p) => p.id === idPenghuni);

  if (penghuni) {
    const penghuniLama = {
      ...penghuni,
      tanggal_selesai: new Date().toISOString().split("T")[0],
    };

    const daftarPenghuniLama = getPenghuniLamaFromLocalStorage();
    daftarPenghuniLama.push(penghuniLama);
    savePenghuniLamaToLocalStorage(daftarPenghuniLama);

    const updatedDaftarPenghuni = daftarPenghuni.filter(
      (p) => p.id !== idPenghuni
    );
    localStorage.setItem(
      "daftarPenghuni",
      JSON.stringify(updatedDaftarPenghuni)
    );
  }
};

// Fungsi untuk mendapatkan data penghuni lama dari localStorage
const getPenghuniLamaFromLocalStorage = (): PenghuniData[] => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem("daftarPenghuniLama");
    return storedData ? JSON.parse(storedData) : [];
  }
  return [];
};

// Fungsi untuk mendapatkan daftar penghuni lama
export const getDaftarPenghuniLama = (): PenghuniData[] => {
  return getPenghuniLamaFromLocalStorage();
};

// Fungsi untuk menghapus data penghuni lama
export const hapusPenghuniLama = (id: string): PenghuniData[] => {
  const penghuniLama = getPenghuniLamaFromLocalStorage();
  const updatedData = penghuniLama.filter((item) => item.id !== id);
  savePenghuniLamaToLocalStorage(updatedData);
  return updatedData;
};
