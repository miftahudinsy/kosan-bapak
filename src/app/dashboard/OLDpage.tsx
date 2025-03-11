import Link from "next/link";
import React from "react";
import { FaBed } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-8 space-y-5 ">
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Kos Griya Hasana
          </h1>

          <p className=" text-gray-600 sm:mt-1">Anda sebagai: Pemilik kos</p>
        </div>

        {/* Menu Ringkas + tambah penghuni */}
        <div className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-gray-700 ">
                Kamar terisi: <span className="font-semibold"> 10 Kamar</span>
              </p>
              <p className="text-gray-700 ">
                Kamar Kosong: <span className="font-semibold"> 0 Kamar</span>
              </p>
            </div>
            <Link
              className="w-full sm:w-auto bg-blue-600 text-white text-center text-base px-6 py-5 sm:py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:bg-blue-700"
              href="/dashboard/add-tenant"
            >
              Tambah Penghuni
            </Link>
          </div>
        </div>

        {/* Dashboard Grid Lantai 1 */}
        <h1 className="text-xl font-extrabold text-gray-900 mb-3 mt-10">
          Penghuni Lantai 1 :
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Kamar A1 */}
          <Link
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            href="dashboard/task"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Budi Dabudi Agung
                </h3>
                <p className="text-gray-600">
                  Sewa sampai: <span className="font-medium">9 April 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">30 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">A1</span>
              </div>
            </div>
          </Link>

          {/* Kamar A2 */}
          <Link
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            href="dashboard/task"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Sadana Kocak
                </h3>
                <p className="text-gray-600">
                  Sewa sampai: <span className="font-medium">9 April 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">30 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">A2</span>
              </div>
            </div>
          </Link>

          {/* Kamar A3 */}
          <Link
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            href="dashboard/task"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Wahuy Basuki Coklat
                </h3>
                <p className="text-gray-600">
                  Sewa sampai: <span className="font-medium">9 April 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">30 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">A3</span>
              </div>
            </div>
          </Link>

          {/* Kamar A4 */}
          <Link
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            href="dashboard/task"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Miftoo Sableng
                </h3>
                <p className="text-gray-600">
                  Sewa sampai:{" "}
                  <span className="font-medium">15 April 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">36 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">A4</span>
              </div>
            </div>
          </Link>

          {/* Kamar A5 */}
          <Link
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            href="dashboard/task"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Bambang Pamungkas
                </h3>
                <p className="text-gray-600">
                  Sewa sampai: <span className="font-medium">20 Mei 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">70 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">A5</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Dashboard Grid Lantai 2 */}
        <h1 className="text-xl font-extrabold text-gray-900 mb-3 mt-10">
          Penghuni Lantai 2 :
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Kamar B1 */}
          <Link
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            href="dashboard/task"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Ahmad Maulana
                </h3>
                <p className="text-gray-600">
                  Sewa sampai: <span className="font-medium">10 Juni 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">80 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">B1</span>
              </div>
            </div>
          </Link>
          {/* Kamar B2 */}
          <Link
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            href="dashboard/task"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Joko Widodo
                </h3>
                <p className="text-gray-600">
                  Sewa sampai: <span className="font-medium">15 Juli 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">105 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">B2</span>
              </div>
            </div>
          </Link>
          {/* Kamar B3 */}
          <Link
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            href="dashboard/task"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Bambang Susanto
                </h3>
                <p className="text-gray-600">
                  Sewa sampai:{" "}
                  <span className="font-medium">20 Agustus 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">130 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">B3</span>
              </div>
            </div>
          </Link>
          {/* Kamar B4 */}
          <Link
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            href="dashboard/task"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Susi Susanti
                </h3>
                <p className="text-gray-600">
                  Sewa sampai:{" "}
                  <span className="font-medium">25 September 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">150 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">B4</span>
              </div>
            </div>
          </Link>
          {/* Kamar B5 */}
          <Link
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            href="dashboard/task"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  Budiman Sudrajat
                </h3>
                <p className="text-gray-600">
                  Sewa sampai:{" "}
                  <span className="font-medium">30 Oktober 2025</span>
                </p>
                <p className="text-gray-600">
                  Sisa hari: <span className="font-medium">180 hari</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaBed className="text-3xl text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-700">B5</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
