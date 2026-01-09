import React, { useMemo, useState } from "react";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../app/store";
import CategoriesChart from "../../components/charts/CategoriesChart";
import LineChartBlock from "../../components/charts/LineChartBlock";
import BarChartBlock from "../../components/charts/BarChartBlock";
import styles from "./Stats.module.scss";
import IncomeExpenseBarChart from "../../components/charts/IncomeExpenseBarChart";

export default function Stats() {
  const transactions = useAppSelector((s: RootState) => s.transactions.items);
  type Period = "all" | "week" | "month" | "year";

  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("all");
  const [period, setPeriod] = useState<Period>("all");
  console.log("STORE transactions:", transactions);

  // Авто-сброс категории при смене типа
  React.useEffect(() => {
    setCategory("all");
  }, [type]);

  // Фильтруем ТОЛЬКО НУЖНЫЕ категории по типу
  const categories = useMemo(() => {
    const set = new Set(
      transactions.filter((t) => t.type === type).map((t) => t.category)
    );
    return ["all", ...Array.from(set)];
  }, [transactions, type]);

  // Фильтруем по периоду
  const periodFiltered = useMemo(() => {
    const now = new Date();

    return transactions.filter((t) => {
      if (t.type !== type) return false;
         
      const d = new Date(t.date);
      if (isNaN(d.getTime())) return false;

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
  }, [transactions, period, type]);

  // Фильтр по категории
  const filtered = useMemo(() => {
    if (category === "all") return periodFiltered;
    return periodFiltered.filter((t) => t.category === category);
  }, [periodFiltered, category]);

  return (
    <div>
      <h2>Статистика</h2>

      {/* --- ФИЛЬТРЫ --- */}
      <div className={styles.filters}>
        {/* Тип операции */}
        <div className={styles.filterBlock}>
          <label>Тип операции:</label>
          <div className={styles.segment}>
            <button
              className={type === "income" ? styles.active : ""}
              onClick={() => setType("income")}
            >
              Доходы
            </button>
            <button
              className={type === "expense" ? styles.active : ""}
              onClick={() => setType("expense")}
            >
              Расходы
            </button>
          </div>
        </div>

        {/* Категория */}
        <div className={styles.filterBlock}>
          <label>Категория:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.select}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "Все категории" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Период */}
        <div className={styles.filterBlock}>
          <label>Период:</label>
          <div className={styles.segment}>
            <button
              className={period === "week" ? styles.active : ""}
              onClick={() => setPeriod("week")}
            >
              Неделя
            </button>
            <button
              className={period === "month" ? styles.active : ""}
              onClick={() => setPeriod("month")}
            >
              Месяц
            </button>
            <button
              className={period === "year" ? styles.active : ""}
              onClick={() => setPeriod("year")}
            >
              Год
            </button>
          </div>
        </div>
      </div>

      {/* --- ГРАФИКИ --- */}
      <div className={styles.charts}>
        <div className={styles.chartItem}>
          <CategoriesChart transactions={filtered} type={type} />
        </div>

        <div className={styles.chartItem}>
          <BarChartBlock transactions={filtered} type={type} />
        </div>
        <IncomeExpenseBarChart transactions={filtered} />
        <div className={styles.chartItem}>
          <LineChartBlock transactions={filtered} type={type} />
        </div>
      </div>
    </div>
  );
}










// import React, { useMemo, useState } from "react";
// import { useAppSelector } from "../../hooks";
// import { RootState } from "../../app/store";
// import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
// import CategoriesChart from "../../components/Charts/CategoriesChart";
// import LineChartBlock from "../../components/Charts/LineChartBlock";
// import styles from "./Stats.module.scss";

// export default function Stats() {
//   const transactions = useAppSelector((s: RootState) => s.transactions.items);

//   // фильтры
//   const [period, setPeriod] = useState<"week" | "month" | "year">("month");
//   const [category, setCategory] = useState("all");
//   const [type, setType] = useState<"all" | "income" | "expense">("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   // список категорий
//   const categories = useMemo(() => {
//     const set = new Set(transactions.map((t) => t.category));
//     return Array.from(set);
//   }, [transactions]);

//   // фильтр по периоду (неделя / месяц / год)
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

//   // итоговый фильтр (всё вместе)
//   const filtered = useMemo(() => {
//     let data = [...filteredByPeriod];

//     // по категории
//     if (category !== "all") {
//       data = data.filter((t) => t.category === category);
//     }

//     // по типу операции (добавляем!)
//     if (type !== "all") {
//       data = data.filter((t) => t.type === type);
//     }

//     // по дате "от"
//     if (dateFrom) {
//       const from = new Date(dateFrom).getTime();
//       data = data.filter((t) => new Date(t.date).getTime() >= from);
//     }

//     // по дате "до"
//     if (dateTo) {
//       const to = new Date(dateTo).getTime();
//       data = data.filter((t) => new Date(t.date).getTime() <= to);
//     }

//     return data;
//   }, [filteredByPeriod, category, type, dateFrom, dateTo]);

//   return (
//     <div>
//       <h2>Статистика</h2>

//       {/* Фильтры по датам */}
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

//       {/* Быстрые кнопки периода */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
//         <button onClick={() => setPeriod("week")}>Неделя</button>
//         <button onClick={() => setPeriod("month")}>Месяц</button>
//         <button onClick={() => setPeriod("year")}>Год</button>
//       </div>

//       {/* Фильтр категории */}
//       <CategoryFilter
//         categories={categories}
//         value={category}
//         onChange={setCategory}
//       />

//       {/* Фильтр по типу операции */}
//       <div style={{ margin: "15px 0", display: "flex", gap: 10 }}>
//         <select value={type} onChange={(e) => setType(e.target.value as any)}>
//           <option value="all">Доходы + Расходы</option>
//           <option value="income">Только доходы</option>
//           <option value="expense">Только расходы</option>
//         </select>
//       </div>

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










