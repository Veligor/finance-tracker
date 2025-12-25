import React, { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { RootState } from "../../app/store";
import {
  deleteTransaction,
  updateTransaction,
} from "../../features/transactions/transactionsSlice";
import EditTransactionModal from "../../components/UI/EditTransactionModal";
import styles from "./Transactions.module.scss";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // --- категории ---
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ["all", ...Array.from(set)];
  }, [transactions]);

  // --- фильтрация ---
  const filtered = useMemo(() => {
    return transactions.filter(
      (t) => t.type === "expense" || t.type === "income"
    );
  }, [transactions]);

  // --- открыть модалку для редактирования ---
  const handleEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  return (
    <div className={styles.wrapper}>
      <h2>Операции</h2>

      {/* Список операций */}
      <div className={styles.list}>
        {filtered.length === 0 && <div>Нет операций</div>}

        {filtered.map((t) => (
          <div key={t.id} className={styles.item}>
            <div className={styles.left}>
              <div className={styles.title}>{t.title}</div>
              <div className={styles.category}>{t.category}</div>
            </div>

            <div className={styles.right}>
              <div
                className={t.type === "income" ? styles.income : styles.expense}
              >
                {t.type === "income" ? "+" : "-"} {t.amount} ₽
              </div>

              <div className={styles.date}>
                {new Date(t.date).toLocaleDateString("ru-RU")}
              </div>

              <button className={styles.editBtn} onClick={() => handleEdit(t)}>
                ✏️ Редактировать
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => dispatch(deleteTransaction(t.id))}
              >
                ❌ Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно редактирования */}
      {showEditModal && selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          onSave={(updatedTransaction) => {
            dispatch(updateTransaction(updatedTransaction));
            setShowEditModal(false);
          }}
          onCancel={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
