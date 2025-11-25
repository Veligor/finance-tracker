import React from "react";
import { useAppSelector } from "../hooks";
import "../styles/global.scss";
import { RootState } from "../app/store";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  const total = transactions.reduce(
    (acc, cur) => acc + (cur.type === "income" ? cur.amount : -cur.amount),
    0
  );

  return (
    <div className="appContainer">
      <header className="header">
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
