import React from "react";
import styles from "./StatsSummary.module.scss";

interface StatsSummaryProps {
  income: number;
  expenses: number;
}

export default function StatsSummary({ income, expenses }: StatsSummaryProps) {
  const savings = income - expenses;
  return (
    <div className={styles.summary}>
      <div className={styles.card}>
        <div className={styles.title}>Доходы</div>
        <div className={styles.amount}>{income.toFixed(2)} ₽</div>
      </div>

      <div className={styles.card}>
        <div className={styles.title}>Расходы</div>
        <div className={styles.amount}>{expenses.toFixed(2)} ₽</div>
      </div>

      <div className={styles.card}>
        <div className={styles.title}>Сэкономлено</div>
        <div className={styles.amount}>{savings.toFixed(2)} ₽</div>
      </div>
    </div>
  );
}
