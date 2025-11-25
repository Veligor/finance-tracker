import React from "react";
import "./Sidebar.module.scss";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">FINANCE</div>

      <nav className="menu">
        <button className="item active">📊 Dashboard</button>
        <button className="item">💸 Операции</button>
        <button className="item">📈 Графики</button>
        <button className="item">⚙ Настройки</button>
      </nav>
    </aside>
  );
}
