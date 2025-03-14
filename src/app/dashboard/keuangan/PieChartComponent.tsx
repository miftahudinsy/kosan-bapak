"use client";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

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
    if (typeof window !== "undefined") {
      ChartJS.register(ArcElement, Tooltip, Legend);
      setIsClient(true);
    }
  }, []);

  if (!isClient) {
    return (
      <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <Pie options={options} data={data} />;
}
