import React, { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { RootState } from "../../app/store";
import {
  deleteTransaction,
  updateTransaction,
  addTransaction,
} from "../../features/transactions/transactionsSlice";
// TransactionsPage
//  ├─ TransactionsFilters
//  ├─ TransactionsActions (CSV)
//  ├─ TransactionsList
//  │    ├─ TransactionsTable   (md+)
//  │    └─ TransactionsCards   (mobile)
//  └─ Modals / Toasts

import { TransactionsList } from "./TransactionsList";
import EditTransactionModal from "../../components/UI/EditTransactionModal";
import ConfirmModal from "../../components/UI/ConfirmModal";
import ToastUndo from "../../components/UI/ToastUndo";
import styles from "./Transactions.module.scss";
import { nanoid } from "nanoid";
import { Transaction } from "../../features/transactions/types";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s: RootState) => s.transactions.items);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [category, setCategory] = useState("all");
  const [modalId, setModalId] = useState<string | null>(null);
  const [deletedItem, setDeletedItem] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  // -----------------------------
  // ФИЛЬТРАЦИЯ ТРАНЗАКЦИЙ И КАТЕГОРИЙ
  // -----------------------------
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ["all", ...Array.from(set)];
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (type !== "all") list = list.filter((t) => t.type === type);
    if (category !== "all") list = list.filter((t) => t.category === category);

    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, type, category]);

  // -----------------------------
  // МОДАЛКА РЕДАКТИРОВАНИЯ
  // -----------------------------
  const handleEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\n").map((l) => l.trim());
    const [, ...rows] = lines;

    rows.forEach((row) => {
      if (!row) return;

      const [date, title, type, category, amount] = row.split(";");
      if (row.split(";").length !== 5) {
        console.error("Некорректный формат строки", row);
        return;
      }

      const transaction: Transaction = {
        id: nanoid(),
        title: title.trim() || "Без названия",
        amount: isNaN(Number(amount)) ? 0 : Number(amount),
        type: type === "Доход" ? "income" : "expense",
        category: category || "Прочее",
        date: parseDate(date),
      };
      dispatch(addTransaction(transaction));
    });
  };

  const parseDate = (value: string) => {
    const [day, month, year] = value.split(".");
    return new Date(`${year}-${month}-${day}`).toISOString();
  };

  // -----------------------------
  // ЭКСПОРТ CSV
  // -----------------------------
  const exportCSV = () => {
    const header = ["Дата", "Название", "Тип", "Категория", "Сумма"];
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString("ru-RU"),
      t.title,
      t.type === "income" ? "Доход" : "Расход",
      t.category,
      t.amount,
    ]);

    const csv = [header, ...rows].map((r) => r.join(";")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  // -----------------------------
  // УДАЛЕНИЕ С АНИМАЦИЕЙ И UNDO
  // -----------------------------
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
    }, 300);
  };

  const undo = () => {
    if (deletedItem) {
      dispatch(addTransaction(deletedItem));
      setShowToast(false);
    }
  };
  // Транзакция удалена — отменить?

  //helpers
  const isSelected = (id: string) => selectedIds.includes(id);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  //Select all / Deselect all
  const allSelected =
    selectedIds.length === filtered.length && filtered.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((t) => t.id));
    }
  };
const bulkActive = selectedIds.length > 0;

  return (
    <div className={styles.wrapper}>
      <h2>Операции</h2>
      {/* ФИЛЬТРАЦИЯ */}
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
      {/* КНОПКИ CSV */}
      <div className={styles.csvBar}>
        <button onClick={exportCSV}>📤 Экспорт CSV</button>
        <label className={styles.importBtn}>
          📥 Импорт CSV
          <input type="file" accept=".csv" hidden onChange={handleImportCSV} />
        </label>
      </div>
     
      {/*  Модальное окно подтверждения */}
      {bulkConfirmOpen && (
        <ConfirmModal
          title="Удалить выбранные операции?"
          text={`Будет удалено операций: ${selectedIds.length}. Это действие нельзя отменить.`}
          onConfirm={() => {
            selectedIds.forEach((id) => dispatch(deleteTransaction(id)));
            setSelectedIds([]);
            setBulkConfirmOpen(false);
          }}
          onCancel={() => setBulkConfirmOpen(false)}
        />
      )}

      {/* Панель массовых действий */}
      {bulkActive && (
        <div className={styles.bulkBar}>
          <span>Выбрано: {selectedIds.length}</span>

    
          <button
            className={styles.selectAllBtn}
            onClick={toggleSelectAll}
            title={allSelected ? "Снять выделение" : "Выбрать все"}
          >
           
            {allSelected ? "☑" : "☐"}
          </button>

          <button onClick={() => setBulkConfirmOpen(true)}>🗑 Удалить</button>
          <button onClick={() => setSelectedIds([])} title="Закрыть">
            ✖
          </button>
        </div>
      )}

      <TransactionsList
        items={filtered}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        removingId={removing}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        allSelected={allSelected}
      />
      {/* МОДАЛКА РЕДАКТИРОВАНИЯ */}
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
      {/* МОДАЛКА ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ */}
      {modalId && (
        <ConfirmModal
          title="Удалить операцию?"
          text="Это действие невозможно отменить."
          onConfirm={handleDelete}
          onCancel={() => setModalId(null)}
        />
      )}
      {/* УВЕДОМЛЕНИЕ UNDO */}
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