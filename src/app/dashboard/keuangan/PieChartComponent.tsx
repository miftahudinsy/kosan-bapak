"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartComponentProps {
  data: ChartData<"pie">;
  options: ChartOptions<"pie">;
}

export default function PieChartComponent({
  data,
  options,
}: PieChartComponentProps) {
  return <Pie options={options} data={data} />;
}
