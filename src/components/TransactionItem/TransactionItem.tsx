import styles from "./TransactionItem.module.scss";
import { Transaction } from "../../features/transactions/types";

interface Props {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: Props) {
  return (
    <div className={styles.item}>
      <div className={styles.main}>
        <span className={styles.title}>{transaction.title}</span>
        <span
          className={
            transaction.type === "income" ? styles.income : styles.expense
          }
        >
          {transaction.type === "income" ? "+" : "-"}
          {transaction.amount} ₽
        </span>
      </div>

      <div className={styles.meta}>
        <span>{transaction.category}</span>
        <span>{new Date(transaction.date).toLocaleDateString()}</span>
        {transaction.note && (
          <span className={styles.note}>{transaction.note}</span>
        )}
      </div>
    </div>
  );
}
