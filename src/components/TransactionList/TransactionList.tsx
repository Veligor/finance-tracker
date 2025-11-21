// import TransactionItem from "../TransactionItem/TransactionItem";
// import { useAppSelector } from "../../hooks";
// import styles from "./TransactionList.module.scss";

// export default function TransactionList() {
//   const transactions = useAppSelector((state) => state.transactions.items);

//   return (
//     <div className={styles.list}>
//       {transactions.length === 0 ? (
//         <p className={styles.empty}>Нет операций</p>
//       ) : (
//         transactions.map((t) => <TransactionItem key={t.id} transaction={t} />)
//       )}
//     </div>
//   );
// }
import React from "react";
import TransactionItem from "../TransactionItem/TransactionItem";
import styles from "./TransactionList.module.scss";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../app/store";

export default function TransactionList() {
  const transactions = useAppSelector(
    (state: RootState) => state.transactions.items
  );

  if (!transactions || transactions.length === 0) {
    return (
      <div className={`${styles.list} card`}>
        <div className={styles.empty}>Нет операций</div>
      </div>
    );
  }

  return (
    <div className={`${styles.list} card`}>
      {transactions
        .slice()
        .reverse()
        .map(
          (
            t // показываем последние сверху
          ) => (
            <TransactionItem key={t.id} transaction={t} />
          )
        )}
    </div>
  );
}
