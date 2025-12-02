import React, { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/global.scss";

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
    <div className="app-layout">
      {/* Sidebar слева */}
      <Sidebar />

      {/* Основная часть */}
      <div className="content-area">
        <header className="header">
          <button
            onClick={toggleTheme}
            className="themeToggle"
            title="Переключить тему"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div>
            <div className="app-title">Personal Finance</div>
            <div className="muted">Учёт доходов и расходов</div>
          </div>

          <div className="balance-card">
            <div className="balance-sub">Баланс</div>
            <div className="balance-value">{total} ₽</div>
          </div>
        </header>

        {/* Router сюда кладёт Home / Stats */}
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
