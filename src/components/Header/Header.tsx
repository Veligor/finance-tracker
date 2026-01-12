import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import "./Header.module.scss";
import styles from "./Header.module.scss";

export default function Header() {
  const transactions = useAppSelector((s) => s.transactions.items);
const [theme, setTheme] = useState("light");

useEffect(() => {
  const saved = localStorage.getItem("theme") || "light";
  setTheme(saved);
  document.documentElement.classList.toggle("dark", saved === "dark");
}, []);


const toggleTheme = () => {
  const next = theme === "light" ? "dark" : "light";
  setTheme(next);
  localStorage.setItem("theme", next);
  document.documentElement.classList.toggle("dark", next === "dark");
};

const balance = transactions.reduce(
  (acc, cur) => acc + (cur.type === "income" ? cur.amount : -cur.amount),
  0
);

return (
  <header className={styles.header}>
    <div className={styles.headerLeft}>
      <button
        onClick={toggleTheme}
        className={styles.themeToggle}
        title="Переключить тему"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </div>

    <div>
      <div className={styles.appTitle}>Personal Finance</div>
      <div className={styles.muted}>Учёт доходов и расходов</div>
    </div>

    <div className={styles.balanceCard}>
      <div className={styles.balanceSub}>Баланс</div>
      <div className={styles.balanceValue}>{balance} ₽</div>
    </div>
  </header>
);
}