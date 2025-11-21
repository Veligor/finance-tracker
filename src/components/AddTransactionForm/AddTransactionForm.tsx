import React, { useState } from "react";
import styles from "./AddTransactionForm.module.scss";
import { useAppDispatch } from "../../hooks";
import { addTransaction } from "../../features/transactions/transactionsSlice";
import { Transaction } from "../../features/transactions/types";
import { nanoid } from "nanoid";

export default function AddTransactionForm() {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const clear = () => {
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("");
    setNote("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Введите название операции");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Введите корректную сумму");
      return;
    }
    if (!category.trim()) {
      setError("Введите категорию");
      return;
    }

    setError(""); // очищаем ошибку

    const transaction: Transaction = {
      id: nanoid(),
      title: title.trim(),
      type,
      amount: Number(amount),
      category: category.trim(),
      date: new Date().toISOString(),
      note: note.trim() || undefined,
    };

    dispatch(addTransaction(transaction));
    clear();
  };

  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <input
          className={styles.input}
          placeholder="Название (напр. Продукты)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Сумма"
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
        />
        <select
          className={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value as any)}
        >
          <option value="expense">Расход</option>
          <option value="income">Доход</option>
        </select>
      </div>

      <div className={styles.row}>
        <input
          className={styles.input}
          placeholder="Категория (напр. Еда)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Заметка (необязательно)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className={styles.actions}>
          <button className="addBtn" type="submit">
            Добавить
          </button>
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </form>
  );
}
