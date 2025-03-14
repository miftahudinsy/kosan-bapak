"use client";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface TrendChartProps {
  data: {
    name: string;
    pemasukan: number;
    pengeluaran: number;
  }[];
  formatCurrency: (value: number) => string;
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
  formatCurrency: (value: number) => string;
};

const CustomTooltip = ({
  active,
  payload,
  label,
  formatCurrency,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm text-gray-600 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            className={`text-sm font-medium ${
              entry.dataKey === "pemasukan"
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {entry.dataKey === "pemasukan" ? "Pemasukan: " : "Pengeluaran: "}
            {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrendChart({ data, formatCurrency }: TrendChartProps) {
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

  return (
    <div className="h-[300px] sm:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip formatCurrency={formatCurrency} />}
          />
          <Legend
            verticalAlign="top"
            height={60}
            iconType="circle"
            formatter={(value) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
          <Line
            type="monotone"
            dataKey="pemasukan"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="pengeluaran"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
