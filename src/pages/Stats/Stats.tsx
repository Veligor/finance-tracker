import React, { useMemo, useState } from "react";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../app/store";
import CategoriesChart from "../../components/Charts/CategoriesChart";
import LineChartBlock from "../../components/Charts/LineChartBlock";
import BarChartBlock from "../../components/Charts/BarChartBlock";
import styles from "./Stats.module.scss";

export default function Stats() {
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("all");
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

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

        <div className={styles.chartItem}>
          <LineChartBlock transactions={filtered} type={type} />
        </div>
      </div>
    </div>
  );
}




















