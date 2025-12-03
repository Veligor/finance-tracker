// import React, { useMemo } from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import { Transaction } from "../../features/transactions/types";

// type Props = {
//   transactions: Transaction[];
//   type: "income" | "expense";
// };

// const COLORS = ["#4D96FF", "#FF6B6B", "#6A4C93", "#1DD3B0", "#FFB020"];

// export default function CategoriesChart({ transactions, type }: Props) {
//   const data = useMemo(() => {
//     if (!transactions.length) return [];

//     const grouped: Record<string, number> = {};

//     transactions.forEach((t) => {
//       if (t.type !== type) return;
//       grouped[t.category] = (grouped[t.category] || 0) + t.amount;
//     });

//     return Object.entries(grouped).map(([cat, value]) => ({
//       name: cat,
//       value,
//     }));
//   }, [transactions, type]);

//   if (!data.length)
//     return <div className="card">Недостаточно данных для диаграммы</div>;

//   return (
//     <div className="card">
//       <h3>Категории — {type === "income" ? "Доходы" : "Расходы"}</h3>
//       <div style={{ width: "100%", height: 260 }}>
//         <ResponsiveContainer>
//           <PieChart>
//             <Pie
//               data={data}
//               dataKey="value"
//               nameKey="name"
//               outerRadius={100}
//               label
//             >
//               {data.map((_, index) => (
//                 <Cell key={index} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }































import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction } from "../../features/transactions/types";
import styles from "./CategoriesChart.module.scss";

interface Props {
  transactions: Transaction[];
  type: "income" | "expense";
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
  if (!transactions.length) {
    return <div className="card">Недостаточно данных для диаграммы</div>;
  }

  const categoryMap: Record<string, number> = {};

  transactions.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  const total = Object.values(categoryMap).reduce((a, b) => a + b, 0);

  const data = Object.entries(categoryMap).map(([category, amount]) => ({
    name: category,
    amount,
    percent: total ? Math.round((amount / total) * 100) : 0,
  }));

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Категории</h3>

      <div className={styles.chartBlock}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="name"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(v) => `${v} ₽`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className={styles.list}>
        {data.map((item, i) => (
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
