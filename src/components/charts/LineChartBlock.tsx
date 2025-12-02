// import React from "react";
// // type Props = { transactions?: Transaction[] };

// // function CategoriesChart({ transactions }: Props) {
// //   const storeData = useAppSelector((s) => s.transactions.items);
// //   const data = transactions || storeData;
// type Props = {
//   transactions?: Transaction[];
// };
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import { useAppSelector } from "../../hooks";
// import { RootState } from "../../app/store";

// export default function LineChartBlock({ transactions }: Props) {
//   const storeData = useAppSelector((s) => s.transactions.items);
//   const data = transactions || storeData;
//   // группируем по дате
//   const grouped: Record<string, number> = {};

//   transactions.forEach((t) => {
//     const day = t.date.slice(0, 10);
//     const value = t.type === "income" ? t.amount : -t.amount;
//     grouped[day] = (grouped[day] || 0) + value;
//   });

//   // const data = Object.entries(grouped)
//   //   .map(([date, value]) => ({ date, value }))
//   //   .sort((a, b) => a.date.localeCompare(b.date));

//   if (!data.length)
//     return <div className="card">Недостаточно данных для графика</div>;

//   return (
//     <div className="card">
//       <h3>Движение денег по дням</h3>
//       <div style={{ width: "100%", height: 280 }}>
//         <ResponsiveContainer>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke="#4D96FF"
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
import { useAppSelector } from "../../hooks";
import { Transaction } from "../../features/transactions/types";

type Props = {
  transactions?: Transaction[];
};

export default function LineChartBlock({ transactions }: Props) {
  // если нет пропса → берём из Redux
  const storeData = useAppSelector((s) => s.transactions.items);
  const source = transactions || storeData;

  // группировка по датам
  const grouped: Record<string, number> = {};

  source.forEach((t) => {
    const day = t.date.slice(0, 10);
    const value = t.type === "income" ? t.amount : -t.amount;
    grouped[day] = (grouped[day] || 0) + value;
  });

  const chartData = Object.entries(grouped)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!chartData.length)
    return <div className="card">Недостаточно данных для графика</div>;

  return (
    <div className="card">
      <h3>Движение денег по дням</h3>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
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
