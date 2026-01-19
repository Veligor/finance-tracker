import styles from "./TransactionsList.module.scss";
import { Transaction } from "../../features/transactions/types";

interface Props {
  items: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  removingId: string | null;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

export function TransactionsList({
  items,
  onEdit,
  onDelete,
  removingId,
  selectedIds, 
  onToggleSelect,
}: Props) {
  return (
    <div className={styles.transactions}>
      {/* TABLE */}
      <div className={styles.tableView}>
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Сумма</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(t.id)}
                    onChange={() => onToggleSelect(t.id)}
                  />
                </td>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.title}</td>
                <td>{t.category}</td>
                <td
                  className={
                    t.type === "income" ? styles.income : styles.expense
                  }
                >
                  {t.amount} ₽
                </td>
                <td>
                  <button onClick={() => onEdit(t)}>✏️</button>
                  <button onClick={() => onDelete(t.id)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDS */}
      <div className={styles.cardView}>
        {items.map((t) => (
          <div
            key={t.id}
            className={`${styles.card} ${
              removingId === t.id ? styles.removing : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(t.id)}
              onChange={() => onToggleSelect(t.id)}
              className={styles.checkbox}
            />
            <div className={styles.title}>{t.title}</div>
            <div className={styles.meta}>
              {t.category} · {new Date(t.date).toLocaleDateString()}
            </div>
            <div className={styles.amount}>{t.amount} ₽</div>
            <div className={styles.actions}>
              <button onClick={() => onEdit(t)}>✏️</button>
              <button onClick={() => onDelete(t.id)}>❌</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
