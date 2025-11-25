import React from "react";
import styles from "./BalanceCard.module.scss";

interface BalanceCardProps {
  balance: number;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>Баланс</div>
      <div className={styles.amount}>{balance.toFixed(2)} ₽</div>
    </div>
  );
}
