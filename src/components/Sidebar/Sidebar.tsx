import React from "react";
import styles from "./Sidebar.module.scss";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>FINANCE</div>

      <nav className={styles.menu}>
        <Link to="/" className={styles.item}>
          📊 Dashboard
        </Link>
        <Link to="/stats" className={styles.item}>
          📈 Статистика
        </Link>
        <Link to="/transactions" className={styles.item}>
          💸 Операции
        </Link>
      </nav>
    </aside>
  );
}
