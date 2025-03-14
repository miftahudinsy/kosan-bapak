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
    ChartJS.register(ArcElement, Tooltip, Legend);
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <Pie options={options} data={data} />;
}
