import React, { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { RootState } from "../../app/store";
import {
  deleteTransaction,
  updateTransaction,
  addTransaction,
} from "../../features/transactions/transactionsSlice";
import EditTransactionModal from "../../components/UI/EditTransactionModal";
import styles from "./Transactions.module.scss";
import { nanoid } from "nanoid";
import { Transaction } from "./../../features/transactions/types";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // -----------------------------
  // ОТКРЫТИЕ МОДАЛКИ РЕДАКТИРОВАНИЯ
  // -----------------------------
  const handleEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowEditModal(true);
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
  // ИМПОРТ CSV — обработчик input
  // -----------------------------
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

  // -----------------------------
  // ПАРСИНГ CSV
  // -----------------------------
  const parseCSV = (text: string) => {
    const lines = text.split("\n").map((l) => l.trim());

    // убираем заголовок
    const [, ...rows] = lines;

    rows.forEach((row) => {
      if (!row) return;

      const [date, title, type, category, amount] = row.split(";");
      if (row.split(";").length !== 5) {
        console.error("Некорректный формат строки", row);
        return;
      }

      // const transaction = {
      //   id: nanoid(),
      //   title,
      //   amount: Number(amount),
      //   type: type === "Доход" ? "income" : "expense",
      //   category: category || "Прочее",
      //   date: parseDate(date),
      // };
      // const transaction: Transaction = {
      //   id: nanoid(),
      //   title,
      //   amount: Number(amount),
      //   type: type === "Доход" ? "income" : "expense",
      //   category: category || "Прочее",
      //   date: parseDate(date),
      // };
      const transaction: Transaction = {
        
        id: nanoid(),
        title: title.trim() || "Без названия", // Проверка на пустое значение
        amount: isNaN(Number(amount)) ? 0 : Number(amount), // Проверка на корректность суммы
        type: type === "Доход" ? "income" : "expense",
        category: category || "Прочее",
        date: parseDate(date),
      };

      //габапентин успок собаке
     
      // addTransaction → validateTransaction
      // если данные плохие — Redux их НЕ добавит
      dispatch(addTransaction(transaction));
    });
  };

  // -----------------------------
  // ПАРСИНГ ДАТЫ ИЗ CSV
  // -----------------------------
  const parseDate = (value: string) => {
    const [day, month, year] = value.split(".");
    return new Date(`${year}-${month}-${day}`).toISOString();
  };

  // -----------------------------
  // ФИЛЬТРАЦИЯ (пока простая)
  // -----------------------------
  const filtered = useMemo(() => {
    return transactions;
  }, [transactions]);

  return (
    <div className={styles.wrapper}>
      <h2>Операции</h2>

      {/* -----------------------------
          КНОПКИ CSV
         ----------------------------- */}
      <div className={styles.csvBar}>
        <button onClick={exportCSV}>📤 Экспорт CSV</button>

        <label className={styles.importBtn}>
          📥 Импорт CSV
          <input type="file" accept=".csv" hidden onChange={handleImportCSV} />
        </label>
      </div>

      {/* -----------------------------
          СПИСОК ОПЕРАЦИЙ
         ----------------------------- */}
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

      {/* -----------------------------
          МОДАЛКА РЕДАКТИРОВАНИЯ
         ----------------------------- */}
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
