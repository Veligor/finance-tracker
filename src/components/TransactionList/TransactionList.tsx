import TransactionItem from "../TransactionItem/TransactionItem";
import { useAppSelector } from "../../hooks";
import styles from "./TransactionList.module.scss";

export default function TransactionList() {
  const transactions = useAppSelector((state) => state.transactions.items);

  return (
    <div className={styles.list}>
      {transactions.length === 0 ? (
        <p className={styles.empty}>Нет операций</p>
      ) : (
        transactions.map((t) => <TransactionItem key={t.id} transaction={t} />)
      )}
    </div>
  );
}
