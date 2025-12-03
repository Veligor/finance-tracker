import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction } from "../../features/transactions/types";

type Props = {
  transactions: Transaction[];
  type: "income" | "expense";
};

const COLORS = ["#4D96FF", "#FF6B6B", "#6A4C93", "#1DD3B0", "#FFB020"];

export default function CategoriesChart({ transactions, type }: Props) {
  const data = useMemo(() => {
    if (!transactions.length) return [];

    const grouped: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type !== type) return;
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

    return Object.entries(grouped).map(([cat, value]) => ({
      name: cat,
      value,
    }));
  }, [transactions, type]);

  if (!data.length)
    return <div className="card">Недостаточно данных для диаграммы</div>;

  return (
    <div className="card">
      <h3>Категории — {type === "income" ? "Доходы" : "Расходы"}</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
