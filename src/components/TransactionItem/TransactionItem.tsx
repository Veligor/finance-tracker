import React from "react";
import styles from "./TransactionItem.module.scss";
import { Transaction } from "../../features/transactions/types";
import { useAppDispatch } from "../../hooks";
import { deleteTransaction } from "../../features/transactions/transactionsSlice";

type Props = { transaction: Transaction };

export default function TransactionItem({ transaction }: Props) {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <div className={styles.title}>{transaction.title}</div>
        <div className={styles.meta}>
          <span>{transaction.category}</span>
          <span>{new Date(transaction.date).toLocaleDateString()}</span>
          {transaction.note && <span>· {transaction.note}</span>}
        </div>
      </div>

      <div className={styles.right}>
        <div
          className={`${styles.amount} ${
            transaction.type === "income" ? styles.income : styles.expense
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}
          {transaction.amount} ₽
        </div>
        <div className={styles.meta}>
          <button
            className="btn"
            onClick={() => dispatch(deleteTransaction(transaction.id))}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
