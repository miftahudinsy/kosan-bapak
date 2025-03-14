"use client";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

interface PieChartComponentProps {
  data: ChartData<"pie">;
  options: ChartOptions<"pie">;
}

export default function PieChartComponent({
  data,
  options,
}: PieChartComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const registerChart = async () => {
      if (typeof window !== "undefined") {
        try {
          ChartJS.register(ArcElement, Tooltip, Legend);
          setIsClient(true);
        } catch (error) {
          console.error("Error registering Chart.js:", error);
        }
      }
    };

    registerChart();
  }, []);

  // Validasi data sebelum render
  if (!data || !data.datasets || data.datasets.length === 0) {
    return (
      <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <Pie options={options} data={data} />;
}
