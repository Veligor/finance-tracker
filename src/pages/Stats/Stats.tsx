import React, { useMemo, useState } from "react";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../app/store";
import CategoriesChart from "../../components/charts/CategoriesChart";
import LineChartBlock from "../../components/charts/LineChartBlock";

export default function Stats() {
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  // Фильтр: месяц, неделя, год
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  // Получаем текущую дату
  const now = new Date();

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);

      if (period === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
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

  return (
    <div className="appContainer">
      <h2>Статистика</h2>
      <div className="muted" style={{ marginBottom: 20 }}>
        Аналитика доходов и расходов
      </div>

      {/* Фильтры */}
      <div style={{ marginBottom: 20, display: "flex", gap: 12 }}>
        <button
          className={period === "week" ? "btn--primary" : "btn"}
          onClick={() => setPeriod("week")}
        >
          Неделя
        </button>

        <button
          className={period === "month" ? "btn--primary" : "btn"}
          onClick={() => setPeriod("month")}
        >
          Месяц
        </button>

        <button
          className={period === "year" ? "btn--primary" : "btn"}
          onClick={() => setPeriod("year")}
        >
          Год
        </button>
      </div>

      {/* Графики */}
      <div className="dashboard-charts">
        <CategoriesChart transactions={filtered} />
        <LineChartBlock transactions={filtered} />
      </div>
    </div>
  );
}
