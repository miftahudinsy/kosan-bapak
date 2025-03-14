"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

interface ChartComponentProps {
  data: ChartData<"line">;
  options: ChartOptions<"line">;
}

export default function ChartComponent({ data, options }: ChartComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const registerChart = async () => {
      if (typeof window !== "undefined") {
        try {
          ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            Title,
            Tooltip,
            Legend,
            Filler
          );
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

  return <Line options={options} data={data} />;
}
