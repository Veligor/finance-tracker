// Было — неправильно
import { Transaction } from "../../features/transactions/types";
import styles from "./TransactionItem.module.scss";

type Props = {
  transaction: Transaction;
};

export default function TransactionItem({ transaction }: Props) {
  return (
    <div className={styles.item}>
      <span className={styles.title}>{transaction.title}</span>

      <span
        className={`${styles.amount} ${
          transaction.type === "income" ? styles.income : styles.expense
        }`}
      >
        {transaction.type === "income" ? "+" : "-"}
        {transaction.amount} ₽
      </span>
    </div>
  );
}
