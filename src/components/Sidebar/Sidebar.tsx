import React from "react";
import styles from "./Sidebar.module.scss";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const handleClick = () => {
      onClose(); // ← закрываем sidebar после перехода
    };
  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.logo}>FINANCE</div>
        <nav className={styles.menu}>
          <Link to="/" className={styles.item}>
            <span className={styles.icon} onClick={handleClick}>
              📊
            </span>
            <span className={styles.label}>Dashboard</span>
          </Link>
          <Link to="/stats" className={styles.item}>
            <span className={styles.icon} onClick={handleClick}>
              📈
            </span>
            <span className={styles.label}>Статистика</span>
          </Link>
          <Link to="/transactions" className={styles.item}>
            <span className={styles.icon} onClick={handleClick}>
              💸
            </span>
            <span className={styles.label}>Операции</span>
          </Link>
        </nav>
      </aside>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
    </>
  );
}
