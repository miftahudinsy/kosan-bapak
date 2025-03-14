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
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

interface ChartComponentProps {
  data: ChartData<"line">;
  options: ChartOptions<"line">;
}

export default function ChartComponent({ data, options }: ChartComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <Line options={options} data={data} />;
}
