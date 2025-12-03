// import React, { useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import { Transaction } from "../../features/transactions/types";

// type Props = {
//   transactions: Transaction[];
//   type: "income" | "expense";
// };

// export default function BarChartBlock({ transactions, type }: Props) {
//   const data = useMemo(() => {
//     if (!transactions.length) return [];

//     // группировка по датам
//     const grouped: Record<string, number> = {};

//     transactions.forEach((t) => {
//       if (t.type !== type) return;

//       const day = t.date.slice(0, 10);
//       grouped[day] = (grouped[day] || 0) + t.amount;
//     });

//     return Object.entries(grouped)
//       .map(([date, value]) => ({ date, value }))
//       .sort((a, b) => a.date.localeCompare(b.date));
//   }, [transactions, type]);

//   if (!data.length)
//     return (
//       <div className="card">Недостаточно данных для столбчатого графика</div>
//     );

//   return (
//     <div className="card">
//       <h3>Столбчатая диаграмма — {type === "income" ? "Доходы" : "Расходы"}</h3>
//       <div style={{ width: "100%", height: 260 }}>
//         <ResponsiveContainer>
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Bar
//               dataKey="value"
//               fill={type === "income" ? "#4D96FF" : "#FF6B6B"}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
























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
  if (!transactions.length)
    return (
      <div className="card">Недостаточно данных для столбчатого графика</div>
    );

  const grouped: Record<string, number> = {};

  transactions.forEach((t) => {
    const day = t.date.slice(0, 10);
    grouped[day] = (grouped[day] || 0) + t.amount;
  });

  const data = Object.entries(grouped)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="card">
      <h3>Столбчатая динамика</h3>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill={type === "income" ? "#22c55e" : "#ef4444"}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

