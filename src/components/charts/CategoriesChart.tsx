import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction } from "../../features/transactions/types";
import styles from "./CategoriesChart.module.scss";

interface Props {
  transactions: Transaction[];
}

const COLORS = [
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#14b8a6",
];

export default function CategoriesChart({ transactions }: Props) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const categoryMap: Record<string, number> = {};

  for (const t of expenses) {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  }

  const data = Object.entries(categoryMap).map(([category, amount]) => ({
    name: category,
    amount,
    percent: 0, // позже пересчитаем
  }));

  const total = data.reduce((acc, cur) => acc + cur.amount, 0);

  const dataWithPercent = data.map((d) => ({
    ...d,
    percent: total ? Math.round((d.amount / total) * 100) : 0,
  }));

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Категории расходов</h3>

      <div className={styles.chartBlock}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={dataWithPercent}
              dataKey="amount"
              nameKey="name"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
            >
              {dataWithPercent.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(v) => `${v} ₽`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className={styles.list}>
        {dataWithPercent.map((item, i) => (
          <li key={item.name} className={styles.item}>
            <span
              className={styles.color}
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className={styles.catName}>{item.name}</span>
            <span className={styles.percent}>{item.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
