import React from "react";
import { useAppSelector } from "../hooks";
import "../styles/global.scss";
import { RootState } from "../app/store";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const transactions = useAppSelector((s: RootState) => s.transactions.items);
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
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
    <div className="appContainer">
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
          <div>
            <div className="balance-sub">Баланс</div>
            <div className="balance-value">{total} ₽</div>
          </div>
        </div>
      </header>

      <main className="layout">{children}</main>
    </div>
  );
}
