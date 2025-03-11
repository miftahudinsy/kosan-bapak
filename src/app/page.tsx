"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const keDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-3 text-center">
        Bapak Kosan
      </h1>
      <p className="text-xl text-gray-600 mb-10 text-center">
        Kelola kos-kosan jadi gampang.
      </p>
      <button
        onClick={keDashboard}
        className="bg-blue-600 text-white text-xl px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
      >
        Masuk
      </button>
    </div>
  );
};

export default Home;
