import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "../../features/transactions/types";

type Props = {
  transactions: Transaction[];
  type: "income" | "expense";
};

export default function BarChartBlock({ transactions, type }: Props) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">Недостаточно данных для столбчатого графика</div>
    );
  }

  // ↓↓↓ ГРУППИРОВКА ПО ДНЯМ ↓↓↓
  const grouped: Record<string, number> = {};

  transactions.forEach((t) => {
    const day = t.date.slice(0, 10);
    const value = t.amount; // тут уже без знака, т.к. фильтр по type работает вне чарта

    grouped[day] = (grouped[day] || 0) + value;
  });

  const chartData = Object.entries(grouped)
    .map(([date, value]) => ({
      date,
      value: type === "expense" ? -Math.abs(value) : value,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!chartData.length) {
    return (
      <div className="card">Недостаточно данных для столбчатого графика</div>
    );
  }

  return (
    <div className="card">
      <h3>Отчёт по дням (столбцы)</h3>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill={type === "income" ? "#4CAF50" : "#FF5252"}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
