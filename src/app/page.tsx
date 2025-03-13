"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaMobileAlt,
  FaUserPlus,
  FaChartLine,
  FaWhatsapp,
  FaArrowRight,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";

const Home = () => {
  const router = useRouter();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Bapak Kosan</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all"
          >
            Masuk
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-12"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-6">
              ✨ Solusi Terbaik untuk Pemilik Kos
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Kelola Kos Anda dengan{" "}
              <span className="text-blue-600">Lebih Mudah</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Lupakan cara lama. Kelola kos-kosan Anda dengan sistem modern yang
              simpel. Gratis untuk 5 kamar pertama!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-200 hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Mulai Gratis
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/demo")}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold shadow-lg transition-all hover:bg-blue-50 border border-blue-100 flex items-center justify-center gap-2"
              >
                Lihat Demo
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-600/5 rounded-2xl blur-2xl"></div>
              <img
                src="/hero-image.png"
                alt="Dashboard Bapak Kosan"
                className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Fitur yang Memudahkan Pengelolaan
            </h2>
            <p className="text-xl text-gray-600">
              Dirancang khusus untuk memenuhi kebutuhan pemilik kos modern
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaCheckCircle className="text-5xl text-blue-600" />,
                title: "Mudah Digunakan",
                description: "Interface sederhana yang cocok untuk semua usia",
              },
              {
                icon: <FaShieldAlt className="text-5xl text-blue-600" />,
                title: "Aman & Terpercaya",
                description: "Data Anda tersimpan dengan aman di server kami",
              },
              {
                icon: <FaClock className="text-5xl text-blue-600" />,
                title: "Hemat Waktu",
                description: "Otomatisasi pembukuan dan pengingat tagihan",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-24">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pilih Paket Sesuai Kebutuhan
          </h2>
          <p className="text-xl text-gray-600">
            Mulai gratis, upgrade kapan saja
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium inline-block mb-6">
              Gratis
            </div>
            <h3 className="text-3xl font-bold mb-2">Rp 0</h3>
            <p className="text-gray-500 mb-6">Selamanya</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-green-500" />
                <span>Kelola hingga 5 kamar</span>
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-green-500" />
                <span>Pencatatan pembayaran</span>
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-green-500" />
                <span>Laporan dasar</span>
              </li>
            </ul>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Mulai Gratis
            </button>
          </motion.div>

          {/* Monthly Premium Plan */}
          <motion.div
            className="bg-blue-600 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-4 right-4 bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
              Popular
            </div>
            <div className="text-white">
              <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium inline-block mb-6">
                Premium Bulanan
              </div>
              <h3 className="text-3xl font-bold mb-2">Rp 50.000</h3>
              <p className="text-blue-100 mb-6">per bulan</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <FaCheckCircle />
                  <span>Kamar tidak terbatas</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle />
                  <span>Laporan keuangan lengkap</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle />
                  <span>Pengingat otomatis via WhatsApp</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle />
                  <span>Dukungan prioritas</span>
                </li>
              </ul>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-white text-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Pilih Paket Bulanan
              </button>
            </div>
          </motion.div>

          {/* Yearly Premium Plan */}
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-blue-100 relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              Hemat 35%
            </div>
            <div>
              <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium inline-block mb-6">
                Premium Tahunan
              </div>
              <h3 className="text-3xl font-bold mb-2">Rp 390.000</h3>
              <p className="text-gray-500 mb-6">per tahun</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-500" />
                  <span>Semua fitur Premium Bulanan</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-500" />
                  <span>Hemat Rp 210.000 per tahun</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-500" />
                  <span>Harga terkunci 1 tahun</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-500" />
                  <span>Konsultasi setup gratis</span>
                </li>
              </ul>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Pilih Paket Tahunan
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-blue-600 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Siap Memulai Perjalanan Anda?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Bergabung dengan ribuan pemilik kos yang telah merasakan kemudahan
              mengelola properti mereka
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
            >
              Mulai Sekarang - Gratis!
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Bapak Kosan</h3>
              <p className="text-gray-400">
                Solusi modern untuk pengelolaan kos-kosan Anda
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fitur
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Harga
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kontak
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
              <p className="text-gray-400 mb-2">support@bapakkosan.com</p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaWhatsapp className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bapak Kosan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
