import React, { useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { RootState } from "../../app/store";
import {
  deleteTransaction,
  addTransaction,
  updateTransaction,
} from "../../features/transactions/transactionsSlice";
import ConfirmModal from "../../components/UI/ConfirmModal";
import ToastUndo from "../../components/UI/ToastUndo";
import EditTransactionModal from "../../components/UI/EditTransactionModal";
import styles from "./Transactions.module.scss";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [category, setCategory] = useState("all");

  const [modalId, setModalId] = useState<string | null>(null);
  const [deletedItem, setDeletedItem] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<any>(null);

  // категории
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ["all", ...Array.from(set)];
  }, [transactions]);

  // фильтр + сортировка
  const filtered = useMemo(() => {
    let list = [...transactions];

    if (type !== "all") list = list.filter((t) => t.type === type);
    if (category !== "all") list = list.filter((t) => t.category === category);

    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, type, category]);

  // --- УДАЛЕНИЕ ---
  const confirmDelete = (id: string) => setModalId(id);

  const handleDelete = () => {
    if (!modalId) return;

    const item = transactions.find((t) => t.id === modalId);
    if (!item) return;

    setDeletedItem(item);
    setModalId(null);
    setRemoving(item.id);

    setTimeout(() => {
      dispatch(deleteTransaction(item.id));
      setShowToast(true);
      setRemoving(null);
    }, 400);
  };

  const undo = () => {
    if (deletedItem) {
      dispatch(addTransaction(deletedItem));
      setShowToast(false);
    }
  };

  // --- РЕДАКТИРОВАНИЕ ---
  const handleSaveEdit = (updated: any) => {
    dispatch(updateTransaction(updated));
    setEditingItem(null);
  };

  return (
    <div className={styles.wrapper}>
      <h2>Операции</h2>

      {/* ФИЛЬТРЫ */}
      <div className={styles.filters}>
        <div>
          <label>Тип:</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div>
          <label>Категория:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "Все категории" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* СПИСОК */}
      <div className={styles.list}>
        {filtered.length === 0 && <div>Нет операций</div>}

        {filtered.map((t) => (
          <div
            key={t.id}
            className={`${styles.item} ${
              removing === t.id ? styles.removing : ""
            }`}
          >
            <div className={styles.left}>
              <div className={styles.title}>{t.title}</div>
              <div className={styles.category}>{t.category}</div>
            </div>

            <div className={styles.right}>
              <div
                className={t.type === "income" ? styles.income : styles.expense}
              >
                {t.type === "income" ? "+" : "-"}
                {t.amount} ₽
              </div>

              <div className={styles.date}>
                {new Date(t.date).toLocaleDateString("ru-RU")}
              </div>

              <button
                className={styles.editBtn}
                onClick={() => setEditingItem(t)}
              >
                ✏️
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() => confirmDelete(t.id)}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* МОДАЛКИ */}
      {modalId && (
        <ConfirmModal
          title="Удалить операцию?"
          text="Это действие можно отменить сразу после удаления."
          onConfirm={handleDelete}
          onCancel={() => setModalId(null)}
        />
      )}

      {editingItem && (
        <EditTransactionModal
          transaction={editingItem}
          onSave={handleSaveEdit}
          onCancel={() => setEditingItem(null)}
        />
      )}

      {showToast && (
        <ToastUndo
          message="Операция удалена"
          onUndo={undo}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

