import React from "react";
import { useAppSelector } from "../../hooks";
import "./Header.module.scss";

export default function Header() {
  const transactions = useAppSelector((s) => s.transactions.items);

  const balance = transactions.reduce(
    (acc, t) => acc + (t.type === "income" ? t.amount : -t.amount),
    0
  );

  return (
    <header className="header">
      <div>
        <h1>Финансовый учёт</h1>
        <div className="muted">Контроль доходов и расходов</div>
      </div>

      <div className="balance-box">
        <div className="label">Баланс</div>
        <div className="value">{balance} ₽</div>
      </div>
    </header>
  );
}
