import Link from "next/link";
import React from "react";
import { FaBed, FaUsers, FaMoneyBillAlt } from "react-icons/fa"; // Import icons

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-5 ">
        <div className="flex flex-col">
          <h1 className="text-3xl text-center sm:text-left sm:text-4xl font-extrabold text-gray-900 mt-2 sm:mt-0">
            Kos Griya Hasana
          </h1>

          <p className=" text-gray-600 sm:mt-1 text-center sm:text-left">
            Anda sebagai: Pemilik kos
          </p>
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
              className="w-full sm:w-auto bg-blue-600 text-white text-center text-base px-6 py-5 sm:py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all  hover:bg-blue-700 transform hover:scale-105"
              href="/dashboard/add-tenant"
            >
              Tambah Penghuni
            </Link>
          </div>
        </div>

        {/* Dashboard Menu*/}

        <div className="grid grid-cols-2  gap-5">
          {/* Data Penghuni*/}
          <Link
            className="min-h-[150px] bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center space-y-2"
            href="dashboard/task"
          >
            <FaUsers className="text-4xl text-blue-600" /> {/* Add icon here */}
            <h3 className="text-xl text-center font-bold text-blue-800">
              Lihat Data Penghuni
            </h3>
          </Link>

          {/* Laporan Keuangan*/}
          <Link
            className="bg-blue-100 hover:bg-blue-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center space-y-2"
            href="dashboard/task"
          >
            <FaMoneyBillAlt className="text-4xl text-blue-600" />{" "}
            {/* Add icon here */}
            <h3 className="text-xl text-center font-bold text-blue-800">
              Lihat Laporan Keuangan
            </h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
