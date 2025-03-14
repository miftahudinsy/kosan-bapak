"use client";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartComponentProps {
  data: ChartData<"line">;
  options: ChartOptions<"line">;
}

export default function ChartComponent({ data, options }: ChartComponentProps) {
  return <Line options={options} data={data} />;
}
