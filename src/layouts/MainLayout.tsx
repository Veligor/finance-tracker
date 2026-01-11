import React, { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/global.scss";
import styles from "./MainLayout.module.scss"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const total = transactions.reduce(
    (acc, cur) => acc + (cur.type === "income" ? cur.amount : -cur.amount),
    0
  );

  return (
    <div className={styles.appLayout}>
      {/* Sidebar слева */}
      <Sidebar />

      {/* Основная часть */}
      <div className={styles.contentArea}>
        <header className={styles.header}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            title="Переключить тему"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div>
            <div className={styles.appTitle}>Personal Finance</div>
            <div className={styles.muted}>Учёт доходов и расходов</div>
          </div>

          <div className={styles.balanceCard}>
            <div className={styles.balanceSub}>Баланс</div>
            <div className={styles.balanceValue}>{total} ₽</div>
          </div>
        </header>

        {/* Router сюда кладёт Home / Stats */}
        <main className={styles.mainContent}>
          <div className="appContainer">{children}</div>
        </main>
      </div>
    </div>
  );
}
