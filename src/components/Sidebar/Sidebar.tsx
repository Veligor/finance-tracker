import React from "react";
import styles from "./Sidebar.module.scss";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>FINANCE</div>

      <nav className={styles.menu}>
        <Link to="/" className={styles.item}>
          <span className={styles.icon}>📊</span>
          <span className={styles.label}>Dashboard</span>
        </Link>
        <Link to="/stats" className={styles.item}>
          <span className={styles.icon}>📈</span>
          <span className={styles.label}>Статистика</span>
        </Link>
        <Link to="/transactions" className={styles.item}>
          <span className={styles.icon}>💸</span>
          <span className={styles.label}>Операции</span>
        </Link>
      </nav>
    </aside>
  );
}
