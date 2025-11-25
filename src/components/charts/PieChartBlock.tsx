import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../app/store";

const COLORS = ["#FF6B6B", "#FFA06B", "#FFD93D", "#6BCB77", "#4D96FF", "#843BFF"];

export default function PieChartBlock() {
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  const expenses = transactions.filter((t) => t.type === "expense");

  const grouped = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  if (!data.length) return <div className="card">Нет данных для графика расходов</div>;

  return (
    <div className="card">
      <h3>Структура расходов</h3>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <PieChart key={JSON.stringify(data)}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
