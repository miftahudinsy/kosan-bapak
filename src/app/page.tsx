"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowDown, FaInstagram } from "react-icons/fa";
import Link from "next/link";

const Home = () => {
  const router = useRouter();

  const scrollToFAQ = () => {
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-image.png"
            alt="Hero Image"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        <div className="z-10 text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-bold text-blue-700 mb-3">
            Kosan Bapak
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10">
            Kelola kos-kosan jadi gampang.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 text-white text-lg px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              Masuk
            </button>
            <button
              onClick={() => router.push("/login?demo=true")}
              className="bg-white text-blue-600 text-lg px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:bg-gray-50"
            >
              Coba Akun Demo
            </button>
          </div>
        </div>

        <div
          onClick={scrollToFAQ}
          className="absolute bottom-10 cursor-pointer animate-bounce flex flex-col items-center text-gray-600 hover:text-gray-800"
        >
          <p className="mb-2">Pelajari lebih lanjut</p>
          <FaArrowDown size={24} />
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Apa itu KosanBapak?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    KosanBapak adalah aplikasi pengelolaan kos-kosan yang mudah
                    digunakan.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Apakah bisa digunakan di HP dan laptop?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Ya, KosanBapak dapat diakses melalui browser di HP maupun
                    laptop Anda.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Apakah aplikasi ini gratis?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Gratis untuk 5 kamar pertama. Untuk lebih dari 5 kamar, Anda
                    perlu berlangganan paket Lisensi Pro.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Bagaimana cara upgrade ke premium?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Masuk ke halaman Pengaturan lalu klik Upgrade ke Pro.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Apa kelebihan aplikasi KosanBapak?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Dengan tombol besar dan menu yang jelas, navigasi jadi lebih
                    nyaman dan mudah dipahami oleh semua pengguna.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pilihan Paket
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Paket Gratis - Akan mengambil lebar penuh di tablet */}
            <div className="bg-white  p-8 rounded-2xl shadow-lg sm:col-span-2 lg:col-span-1">
              <h3 className="text-2xl font-bold mb-4">Gratis</h3>
              <p className="text-4xl font-bold mb-6">
                Rp0
                <span className="text-lg font-normal text-gray-600">
                  /selamanya
                </span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Maksimal 5 kamar
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Fitur dasar
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-full font-semibold">
                Daftar Gratis
              </button>
            </div>

            {/* Paket Pro Bulanan - Akan berada di bawah sebelah kiri di tablet */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-500 transform hover:scale-105 transition-all duration-300 relative sm:col-span-1 lg:col-span-1">
              {/* Badge Popular Choice */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Pilihan Terpopuler
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-blue-600">
                Pro Bulanan
              </h3>
              <p className="text-4xl font-bold mb-6">
                Rp49.000
                <span className="text-lg font-normal text-gray-600">
                  /bulan
                </span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">✓</span>
                  Kamar tidak terbatas
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">✓</span>
                  Statistik Keuangan Kos
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">✓</span>
                  Pengingat pembayaran via WhatsApp
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                Pilih Paket
              </button>
            </div>

            {/* Paket Pro Tahunan - Akan berada di bawah sebelah kanan di tablet */}
            <div className="bg-white p-8 rounded-2xl shadow-lg sm:col-span-1 lg:col-span-1">
              <h3 className="text-2xl font-bold mb-4">Pro Tahunan</h3>
              <p className="text-4xl font-bold mb-6">
                Rp390.000
                <span className="text-lg font-normal text-gray-600">
                  /tahun
                </span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Kamar tidak terbatas
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Statistik Keuangan Kos
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Pengingat pembayaran via WhatsApp
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Hemat 35%
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700">
                Pilih Paket
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 text-center sm:text-left mb-4 sm:mb-0">
            © KosanBapak 2025 - Syarif Miftahudin
          </p>
          <Link
            href="https://www.instagram.com/miftahudinsy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <FaInstagram size={20} />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
