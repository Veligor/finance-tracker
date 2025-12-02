// import React, { useMemo, useState } from "react";
// import { useAppSelector } from "../../hooks";
// import { RootState } from "../../app/store";
// import CategoriesChart from "../../components/charts/CategoriesChart";
// import LineChartBlock from "../../components/charts/LineChartBlock";

// export default function Stats() {
//   const transactions = useAppSelector((s: RootState) => s.transactions.items);

//   // Фильтр: месяц, неделя, год
//   const [period, setPeriod] = useState<"week" | "month" | "year">("month");

//   // Получаем текущую дату
//   const now = new Date();

//   const filtered = useMemo(() => {
//     return transactions.filter((t) => {
//       const d = new Date(t.date);

//       if (period === "week") {
//         const weekAgo = new Date();
//         weekAgo.setDate(now.getDate() - 7);
//         return d >= weekAgo;
//       }

//       if (period === "month") {
//         return (
//           d.getMonth() === now.getMonth() &&
//           d.getFullYear() === now.getFullYear()
//         );
//       }

//       if (period === "year") {
//         return d.getFullYear() === now.getFullYear();
//       }

//       return true;
//     });
//   }, [transactions, period]);

//   return (
//     <div className="appContainer">
//       <h2>Статистика</h2>
//       <div className="muted" style={{ marginBottom: 20 }}>
//         Аналитика доходов и расходов
//       </div>

//       {/* Фильтры */}
//       <div style={{ marginBottom: 20, display: "flex", gap: 12 }}>
//         <button
//           className={period === "week" ? "btn--primary" : "btn"}
//           onClick={() => setPeriod("week")}
//         >
//           Неделя
//         </button>

//         <button
//           className={period === "month" ? "btn--primary" : "btn"}
//           onClick={() => setPeriod("month")}
//         >
//           Месяц
//         </button>

//         <button
//           className={period === "year" ? "btn--primary" : "btn"}
//           onClick={() => setPeriod("year")}
//         >
//           Год
//         </button>
//       </div>

//       {/* Графики */}
//       <div className="dashboard-charts">
//         <CategoriesChart transactions={filtered} />
//         <LineChartBlock transactions={filtered} />
//       </div>
//     </div>
//   );
// }













// import React, { useMemo, useState } from "react";
// import { useAppSelector } from "../../hooks";
// import { RootState } from "../../app/store";
// import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
// import CategoriesChart from "../../components/Charts/CategoriesChart";
// import LineChartBlock from "../../components/Charts/LineChartBlock";
// import styles from "./Stats.module.scss";

// export default function Stats() {
//   const transactions = useAppSelector((s: RootState) => s.transactions.items);

//   const [period, setPeriod] = useState<"week" | "month" | "year">("month");
//   const [category, setCategory] = useState("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   // список категорий
//   const categories = useMemo(() => {
//     const set = new Set(transactions.map((t) => t.category));
//     return Array.from(set);
//   }, [transactions]);

//   // фильтр по периоду
//   const filteredByPeriod = useMemo(() => {
//     const now = new Date();
//     return transactions.filter((t) => {
//       const d = new Date(t.date);

//       if (period === "week") {
//         const diff = now.getTime() - d.getTime();
//         return diff <= 7 * 24 * 60 * 60 * 1000;
//       }

//       if (period === "month") {
//         return (
//           d.getMonth() === now.getMonth() &&
//           d.getFullYear() === now.getFullYear()
//         );
//       }

//       if (period === "year") {
//         return d.getFullYear() === now.getFullYear();
//       }

//       return true;
//     });
//   }, [transactions, period]);

//   // фильтр по категории
// //   const filtered = useMemo(() => {
// //     if (category === "all") return filteredByPeriod;
// //     return filteredByPeriod.filter((t) => t.category === category);
// //   }, [filteredByPeriod, category]);
// const filtered = useMemo(() => {
//   let data = [...transactions];

//   // Фильтр категории
//   if (category !== "all") {
//     data = data.filter((t) => t.category === category);
//   }

//   // Фильтр по дате "от"
//   if (dateFrom) {
//     const from = new Date(dateFrom).getTime();
//     data = data.filter((t) => new Date(t.date).getTime() >= from);
//   }

//   // Фильтр по дате "до"
//   if (dateTo) {
//     const to = new Date(dateTo).getTime();
//     data = data.filter((t) => new Date(t.date).getTime() <= to);
//   }

//   return data;
// }, [transactions, category, dateFrom, dateTo]);


//   return (
//     <div>
//       <h2>Статистика</h2>
//       <div className={styles.filters}>
//         <div className={styles.datefilter}>
//           <label>От:</label>
//           <input
//             className={styles.input}
//             type="date"
//             value={dateFrom}
//             onChange={(e) => setDateFrom(e.target.value)}
//           />
//         </div>

//         <div className={styles.datefilter}>
//           <label>До:</label>
//           <input
//             className={styles.input}
//             type="date"
//             value={dateTo}
//             onChange={(e) => setDateTo(e.target.value)}
//           />
//         </div>
//       </div>
//       <div style={{ marginBottom: 20 }}>Аналитика доходов и расходов</div>
//       {/* Кнопки периода */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
//         <button onClick={() => setPeriod("week")}>Неделя</button>
//         <button onClick={() => setPeriod("month")}>Месяц</button>
//         <button onClick={() => setPeriod("year")}>Год</button>
//       </div>
//       {/* Фильтр по категориям */}
//       <CategoryFilter
//         categories={categories}
//         value={category}
//         onChange={setCategory}
//       />
//       {/* Графики */}
//       <div style={{ display: "flex", gap: 20 }}>
//         <div style={{ flex: 1 }}>
//           <CategoriesChart transactions={filtered} />
//         </div>

//         <div style={{ flex: 1 }}>
//           <LineChartBlock transactions={filtered} />
//         </div>
//       </div>
//     </div>
//   );
// }
























import React, { useMemo, useState } from "react";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../app/store";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import CategoriesChart from "../../components/Charts/CategoriesChart";
import LineChartBlock from "../../components/Charts/LineChartBlock";
import styles from "./Stats.module.scss";

export default function Stats() {
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  // фильтры
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // список категорий
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return Array.from(set);
  }, [transactions]);

  // фильтр по периоду (неделя / месяц / год)
  const filteredByPeriod = useMemo(() => {
    const now = new Date();

    return transactions.filter((t) => {
      const d = new Date(t.date);

      if (period === "week") {
        const diff = now.getTime() - d.getTime();
        return diff <= 7 * 24 * 60 * 60 * 1000;
      }

      if (period === "month") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }

      if (period === "year") {
        return d.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [transactions, period]);

  // итоговый фильтр (всё вместе)
  const filtered = useMemo(() => {
    let data = [...filteredByPeriod];

    // по категории
    if (category !== "all") {
      data = data.filter((t) => t.category === category);
    }

    // по типу операции (добавляем!)
    if (type !== "all") {
      data = data.filter((t) => t.type === type);
    }

    // по дате "от"
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      data = data.filter((t) => new Date(t.date).getTime() >= from);
    }

    // по дате "до"
    if (dateTo) {
      const to = new Date(dateTo).getTime();
      data = data.filter((t) => new Date(t.date).getTime() <= to);
    }

    return data;
  }, [filteredByPeriod, category, type, dateFrom, dateTo]);

  return (
    <div>
      <h2>Статистика</h2>

      {/* Фильтры по датам */}
      <div className={styles.filters}>
        <div className={styles.datefilter}>
          <label>От:</label>
          <input
            className={styles.input}
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className={styles.datefilter}>
          <label>До:</label>
          <input
            className={styles.input}
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      {/* Быстрые кнопки периода */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setPeriod("week")}>Неделя</button>
        <button onClick={() => setPeriod("month")}>Месяц</button>
        <button onClick={() => setPeriod("year")}>Год</button>
      </div>

      {/* Фильтр категории */}
      <CategoryFilter
        categories={categories}
        value={category}
        onChange={setCategory}
      />

      {/* Фильтр по типу операции */}
      <div style={{ margin: "15px 0", display: "flex", gap: 10 }}>
        <select value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="all">Доходы + Расходы</option>
          <option value="income">Только доходы</option>
          <option value="expense">Только расходы</option>
        </select>
      </div>

      {/* Графики */}
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <CategoriesChart transactions={filtered} />
        </div>

        <div style={{ flex: 1 }}>
          <LineChartBlock transactions={filtered} />
        </div>
      </div>
    </div>
  );
}
