import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "../../features/transactions/types";

type Props = {
  transactions: Transaction[];
};

export default function IncomeExpenseBarChart({ transactions }: Props) {
  // Группировка по месяцам
  const grouped: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((t) => {
    const month = t.date.slice(0, 7); // YYYY-MM

    if (!grouped[month]) {
      grouped[month] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      grouped[month].income += t.amount;
    } else {
      grouped[month].expense += t.amount;
    }
  });

  const data = Object.entries(grouped)
    .map(([month, values]) => ({ month, ...values }))
    .sort((a, b) => a.month.localeCompare(b.month));

  if (!data.length) return <div className="card">Нет данных для графика</div>;

  return (
    <div className="card">
      <h3>Доходы vs Расходы по месяцам</h3>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="income" fill="#10b981" name="Доходы" />
            <Bar dataKey="expense" fill="#ef4444" name="Расходы" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
