import React, { useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { RootState } from "../../app/store";
import {
  deleteTransaction,
  addTransaction,
} from "../../features/transactions/transactionsSlice";
import ConfirmModal from "../../components/UI/ConfirmModal";
import ToastUndo from "../../components/UI/ToastUndo";
import styles from "./Transactions.module.scss";
import EditTransactionModal from "../../components/UI/EditTransactionModal";
import { updateTransaction } from "../../features/transactions/transactionsSlice";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [category, setCategory] = useState("all");

  // режим массовых действий
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  // удаление + undo
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletedItems, setDeletedItems] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);

  // категории
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ["all", ...Array.from(set)];
  }, [transactions]);

  // фильтрация
  const filtered = useMemo(() => {
    let list = [...transactions];

    if (type !== "all") list = list.filter((t) => t.type === type);
    if (category !== "all") list = list.filter((t) => t.category === category);

    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, type, category]);

  // чекбоксы
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  // удаление
  const confirmDelete = () => {
    if (selectedIds.length === 0) return;
    setShowConfirm(true);
  };

  const handleDelete = () => {
    const items = transactions.filter((t) => selectedIds.includes(t.id));
    setDeletedItems(items);

    selectedIds.forEach((id) => dispatch(deleteTransaction(id)));

    setSelectedIds([]);
    setShowConfirm(false);
    setShowToast(true);
  };

  const undo = () => {
    deletedItems.forEach((item) => dispatch(addTransaction(item)));
    setDeletedItems([]);
    setShowToast(false);
  };

  // выход из режима выбора
  const toggleSelectMode = () => {
    setSelectMode((prev) => {
      if (prev) clearSelection();
      return !prev;
    });
  };

  return (
    <div className={styles.wrapper}>
      <h2>Операции</h2>

      {/* Фильтры */}
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

        <button onClick={toggleSelectMode} className={styles.selectModeBtn}>
          {selectMode ? "Отменить выбор" : "Выбрать несколько"}
        </button>
      </div>

      {/* Панель массовых действий */}
      {selectMode && selectedIds.length > 0 && (
        <div className={styles.bulkBar}>
          <span>Выбрано: {selectedIds.length}</span>
          <button onClick={confirmDelete}>Удалить</button>
          <button onClick={clearSelection}>Сбросить</button>
        </div>
      )}

      {/* Список */}
      <div className={styles.list}>
        {filtered.length === 0 && <div>Нет операций</div>}

        {filtered.map((t) => (
          <div key={t.id} className={styles.item}>
            {selectMode && (
              <input
                type="checkbox"
                checked={selectedIds.includes(t.id)}
                onChange={() => toggleSelect(t.id)}
              />
            )}
            {!selectMode && (
              <button className={styles.editBtn} onClick={() => setEditing(t)}>
                ✏️
              </button>
            )}

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
            </div>
          </div>
        ))}
      </div>

      {/* Confirm */}
      {showConfirm && (
        <ConfirmModal
          title="Удалить операции?"
          text={`Будет удалено: ${selectedIds.length}`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Undo */}
      {showToast && (
        <ToastUndo
          message="Операции удалены"
          onUndo={undo}
          onClose={() => setShowToast(false)}
        />
      )}
      {editing && (
        <EditTransactionModal
          transaction={editing}
          onSave={(updated) => {
            dispatch(updateTransaction(updated));
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
