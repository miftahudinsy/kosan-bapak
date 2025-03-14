"use client";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

interface PieChartProps {
  data: {
    name: string;
    value: number;
  }[];
  formatCurrency: (value: number) => string;
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      fill: string;
    };
  }>;
  formatCurrency: (value: number) => string;
};

// Warna-warna untuk kategori berbeda
const COLORS = [
  "#10B981", // emerald-500
  "#3B82F6", // blue-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#6366F1", // indigo-500
  "#14B8A6", // teal-500
];

const CustomTooltip = ({
  active,
  payload,
  formatCurrency,
}: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0];
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-900">{data.name}</p>
        <p className="text-sm font-bold text-gray-700">
          {formatCurrency(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    payload: {
      name: string;
      value: number;
    };
  }>;
  formatCurrency: (value: number) => string;
}

const CustomLegend = ({ payload, formatCurrency }: CustomLegendProps) => {
  if (!payload) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mt-4 sm:mt-0">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <div>
            <p className="font-medium text-gray-900">{entry.payload.name}</p>
            <p className="text-gray-500 text-xs">
              {formatCurrency(entry.payload.value)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ExpensePieChart({
  data,
  formatCurrency,
}: PieChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Tidak ada data pengeluaran bulan ini</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-[300px] sm:min-h-[400px] w-full"
      style={{ height: "auto" }}
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip formatCurrency={formatCurrency} />}
          />
          <Legend
            content={<CustomLegend formatCurrency={formatCurrency} />}
            verticalAlign="bottom"
            height={120}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
