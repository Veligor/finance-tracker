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

      {/* СПИСОК ТРАНЗАКЦИЙ
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
                onClick={() => confirmDelete(t.id)}
              >
                ❌ Удалить
              </button>
            </div>
          </div>
        ))}
      </div> */}
      <TransactionsList
        items={filtered}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        removingId={removing}
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








































//ПЛАВНОЕ УДАЛЕНИЕ ИЗ СПИСКА ОПЕРАЦИЙ АНИМАЦИЯ


// import React, { useMemo, useState } from "react";
// import { useAppSelector, useAppDispatch } from "../../hooks";
// import { RootState } from "../../app/store";
// import {
//   deleteTransaction,
//   addTransaction,
// } from "../../features/transactions/transactionsSlice";
// import ConfirmModal from "../../components/UI/ConfirmModal";
// import ToastUndo from "../../components/UI/ToastUndo";
// import styles from "./Transactions.module.scss";

// export default function TransactionsPage() {
//   const dispatch = useAppDispatch();
//   const transactions = useAppSelector((s: RootState) => s.transactions.items);

//   const [type, setType] = useState<"all" | "income" | "expense">("all");
//   const [category, setCategory] = useState("all");

//   const [modalId, setModalId] = useState<string | null>(null);
//   const [deletedItem, setDeletedItem] = useState<any>(null);
//   const [showToast, setShowToast] = useState(false);
//   const [removing, setRemoving] = useState<string | null>(null);

//   // --- Фильтр категорий ---
//   const categories = useMemo(() => {
//     const set = new Set(transactions.map((t) => t.category));
//     return ["all", ...Array.from(set)];
//   }, [transactions]);

//   // --- Фильтр транзакций ---
//   const filtered = useMemo(() => {
//     let list = [...transactions];
//     if (type !== "all") list = list.filter((t) => t.type === type);
//     if (category !== "all") list = list.filter((t) => t.category === category);

//     // Сортировка новые → старые
//     return list.sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     );
//   }, [transactions, type, category]);

//   // --- Открыть модалку ---
//   const confirmDelete = (id: string) => setModalId(id);

//   // --- Удаление с анимацией ---
//   const handleDelete = () => {
//     if (!modalId) return;

//     const item = transactions.find((t) => t.id === modalId);
//     if (!item) return;

//     setDeletedItem(item);
//     setModalId(null);

//     // Запускаем анимацию удаления
//     setRemoving(item.id);
//     setTimeout(() => {
//       dispatch(deleteTransaction(item.id));
//       setShowToast(true);
//       setRemoving(null);
//     }, 300); // 300ms = CSS transition
//   };

//   // --- Undo ---
//   const undo = () => {
//     if (deletedItem) {
//       dispatch(addTransaction(deletedItem));
//       setShowToast(false);
//     }
//   };

//   return (
//     <div className={styles.wrapper}>
//       <h2>Операции</h2>

//       {/* --- Фильтры --- */}
//       <div className={styles.filters}>
//         <div>
//           <label>Тип:</label>
//           <select value={type} onChange={(e) => setType(e.target.value as any)}>
//             <option value="all">Все</option>
//             <option value="income">Доходы</option>
//             <option value="expense">Расходы</option>
//           </select>
//         </div>

//         <div>
//           <label>Категория:</label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             {categories.map((c) => (
//               <option key={c} value={c}>
//                 {c === "all" ? "Все категории" : c}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* --- Список транзакций --- */}
//       <div className={styles.list}>
//         {filtered.length === 0 && <div>Нет операций</div>}

//         {filtered.map((t) => (
//           <div
//             key={t.id}
//             className={`${styles.item} ${
//               removing === t.id ? styles.removing : ""
//             }`}
//           >
//             <div className={styles.left}>
//               <div className={styles.title}>{t.title}</div>
//               <div className={styles.category}>{t.category}</div>
//             </div>

//             <div className={styles.right}>
//               <div
//                 className={t.type === "income" ? styles.income : styles.expense}
//               >
//                 {t.type === "income" ? "+" : "-"}
//                 {t.amount} ₽
//               </div>

//               <div className={styles.date}>
//                 {new Date(t.date).toLocaleDateString("ru-RU")}
//               </div>

//               {/* Кнопка удаления */}
//               <button
//                 className={styles.deleteBtn}
//                 onClick={() => confirmDelete(t.id)}
//               >
//                 ❌
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* --- Модалка подтверждения удаления --- */}
//       {modalId && (
//         <ConfirmModal
//           title="Удалить операцию?"
//           text="Это действие невозможно отменить."
//           onConfirm={handleDelete}
//           onCancel={() => setModalId(null)}
//         />
//       )}

//       {/* --- Undo уведомление --- */}
//       {showToast && (
//         <ToastUndo
//           message="Операция удалена"
//           onUndo={undo}
//           onClose={() => setShowToast(false)}
//         />
//       )}
//     </div>
//   );
// }























//ЧЕКБОКСЫ ДЛЯ УДАЛЕНИЯ ВЫБРАТЬ НЕСКОЛЬКО И ОНИ ПОЯВЛЯ

// import React, { useMemo, useState } from "react";
// import { useAppSelector, useAppDispatch } from "../../hooks";
// import { RootState } from "../../app/store";
// import {
//   deleteTransaction,
//   addTransaction,
// } from "../../features/transactions/transactionsSlice";
// import ConfirmModal from "../../components/UI/ConfirmModal";
// import ToastUndo from "../../components/UI/ToastUndo";
// import styles from "./Transactions.module.scss";
// import EditTransactionModal from "../../components/UI/EditTransactionModal";
// import { updateTransaction } from "../../features/transactions/transactionsSlice";



// export default function TransactionsPage() {
//   const dispatch = useAppDispatch();
//   const transactions = useAppSelector((s: RootState) => s.transactions.items);
// const [editing, setEditing] = useState<any | null>(null);
//   const [type, setType] = useState<"all" | "income" | "expense">("all");
//   const [category, setCategory] = useState("all");

//   // режим массовых действий
//   const [selectMode, setSelectMode] = useState(false);
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);

//   // удаление + undo
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [deletedItems, setDeletedItems] = useState<any[]>([]);
//   const [showToast, setShowToast] = useState(false);

//   // категории
//   const categories = useMemo(() => {
//     const set = new Set(transactions.map((t) => t.category));
//     return ["all", ...Array.from(set)];
//   }, [transactions]);

//   // фильтрация
//   const filtered = useMemo(() => {
//     let list = [...transactions];

//     if (type !== "all") list = list.filter((t) => t.type === type);
//     if (category !== "all") list = list.filter((t) => t.category === category);

//     return list.sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     );
//   }, [transactions, type, category]);

//   // чекбоксы
//   const toggleSelect = (id: string) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const clearSelection = () => setSelectedIds([]);

//   // удаление
//   const confirmDelete = () => {
//     if (selectedIds.length === 0) return;
//     setShowConfirm(true);
//   };

//   const handleDelete = () => {
//     const items = transactions.filter((t) => selectedIds.includes(t.id));
//     setDeletedItems(items);

//     selectedIds.forEach((id) => dispatch(deleteTransaction(id)));

//     setSelectedIds([]);
//     setShowConfirm(false);
//     setShowToast(true);
//   };

//   const undo = () => {
//     deletedItems.forEach((item) => dispatch(addTransaction(item)));
//     setDeletedItems([]);
//     setShowToast(false);
//   };

//   // выход из режима выбора
//   const toggleSelectMode = () => {
//     setSelectMode((prev) => {
//       if (prev) clearSelection();
//       return !prev;
//     });
//   };

//   return (
//     <div className={styles.wrapper}>
//       <h2>Операции</h2>

//       {/* Фильтры */}
//       <div className={styles.filters}>
//         <div>
//           <label>Тип:</label>
//           <select value={type} onChange={(e) => setType(e.target.value as any)}>
//             <option value="all">Все</option>
//             <option value="income">Доходы</option>
//             <option value="expense">Расходы</option>
//           </select>
//         </div>

//         <div>
//           <label>Категория:</label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             {categories.map((c) => (
//               <option key={c} value={c}>
//                 {c === "all" ? "Все категории" : c}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button onClick={toggleSelectMode} className={styles.selectModeBtn}>
//           {selectMode ? "Отменить выбор" : "Выбрать несколько"}
//         </button>
//       </div>

//       {/* Панель массовых действий */}
//       {selectMode && selectedIds.length > 0 && (
//         <div className={styles.bulkBar}>
//           <span>Выбрано: {selectedIds.length}</span>
//           <button onClick={confirmDelete}>Удалить</button>
//           <button onClick={clearSelection}>Сбросить</button>
//         </div>
//       )}

//       {/* Список */}
//       <div className={styles.list}>
//         {filtered.length === 0 && <div>Нет операций</div>}

//         {filtered.map((t) => (
//           <div key={t.id} className={styles.item}>
//             {selectMode && (
//               <input
//                 type="checkbox"
//                 checked={selectedIds.includes(t.id)}
//                 onChange={() => toggleSelect(t.id)}
//               />
//             )}

//             <div className={styles.left}>
//               <div className={styles.title}>{t.title}</div>
//               <div className={styles.category}>{t.category}</div>
//             </div>

//             <div className={styles.right}>
//               {!selectMode && (
//                 <button
//                   className={styles.editBtn}
//                   onClick={() => setEditing(t)}
//                 >
//                   ✏️
//                 </button>
//               )}

//               <div
//                 className={t.type === "income" ? styles.income : styles.expense}
//               >
//                 {t.type === "income" ? "+" : "-"}
//                 {t.amount} ₽
//               </div>

//               <div className={styles.date}>
//                 {new Date(t.date).toLocaleDateString("ru-RU")}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Confirm */}
//       {showConfirm && (
//         <ConfirmModal
//           title="Удалить операции?"
//           text={`Будет удалено: ${selectedIds.length}`}
//           onConfirm={handleDelete}
//           onCancel={() => setShowConfirm(false)}
//         />
//       )}

//       {/* Undo */}
//       {showToast && (
//         <ToastUndo
//           message="Операции удалены"
//           onUndo={undo}
//           onClose={() => setShowToast(false)}
//         />
//       )}
//       {editing && (
//         <EditTransactionModal
//           transaction={editing}
//           onSave={(updated) => {
//             dispatch(updateTransaction(updated));
//             setEditing(null);
//           }}
//           onCancel={() => setEditing(null)}
//         />
//       )}
//     </div>
//   );
// }
