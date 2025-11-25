import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../app/store";

export default function LineChartBlock() {
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  // группируем по дате
  const grouped: Record<string, number> = {};

  transactions.forEach((t) => {
    const day = t.date.slice(0, 10);
    const value = t.type === "income" ? t.amount : -t.amount;
    grouped[day] = (grouped[day] || 0) + value;
  });

  const data = Object.entries(grouped)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!data.length)
    return <div className="card">Недостаточно данных для графика</div>;

  return (
    <div className="card">
      <h3>Движение денег по дням</h3>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4D96FF"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
