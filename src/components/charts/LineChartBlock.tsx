// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import { Transaction } from "../../features/transactions/types";

// type Props = {
//   transactions?: Transaction[];
//   type: "income" | "expense";
// };

// export default function LineChartBlock({ transactions, type }: Props) {
//   const source = transactions ?? []; 

//   if (!source.length) {
//     return <div className="card">Недостаточно данных для графика</div>;
//   }

//   // группировка по датам
//   const grouped: Record<string, number> = {};

//   source.forEach((t) => {
//     const day = t.date.slice(0, 10);
//     const value = type === "income" ? t.amount : -t.amount;

//     grouped[day] = (grouped[day] || 0) + value;
//   });

//   const chartData = Object.entries(grouped)
//     .map(([date, value]) => ({ date, value }))
//     .sort((a, b) => a.date.localeCompare(b.date));

//   return (
//     <div className="card">
//       <h3>Динамика по дням</h3>

//       <div style={{ width: "100%", height: 260 }}>
//         <ResponsiveContainer>
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke={type === "income" ? "#22c55e" : "#ef4444"}
//               strokeWidth={3}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }




























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
import { Transaction } from "../../features/transactions/types";

type Props = {
  transactions?: Transaction[];
  type: "income" | "expense";
};

export default function LineChartBlock({ transactions, type }: Props) {
  const source: Transaction[] = Array.isArray(transactions) ? transactions : [];

  if (source.length === 0) {
    return <div className="card">Недостаточно данных для графика</div>;
  }

  const grouped: Record<string, number> = {};

  source.forEach((t) => {
    const day = t.date.slice(0, 10);
    const value = type === "income" ? t.amount : -t.amount;
    grouped[day] = (grouped[day] || 0) + value;
  });

  const chartData = Object.entries(grouped)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="card">
      <h3>Динамика по дням</h3>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={type === "income" ? "#22c55e" : "#ef4444"}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
