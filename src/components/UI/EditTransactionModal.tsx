import React, { useState, useEffect } from "react";
import { Transaction } from "../../features/transactions/types";
import styles from "./EditTransactionModal.module.scss";

interface Props {
  transaction: Transaction;
  onSave: (updated: Transaction) => void;
  onCancel: () => void;
}

export default function EditTransactionModal({
  transaction,
  onSave,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState<number | "">(transaction.amount);
  const [type, setType] = useState<"income" | "expense">(transaction.type);
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(transaction.date.slice(0, 10));

  const [errors, setErrors] = useState({
    title: "",
    amount: "",
  });

  // --- валидация ---
  useEffect(() => {
    const nextErrors = { title: "", amount: "" };

    if (!title.trim()) {
      nextErrors.title = "Название обязательно";
    } else if (title.trim().length < 2) {
      nextErrors.title = "Минимум 2 символа";
    }

    if (amount === "" || Number(amount) <= 0) {
      nextErrors.amount = "Введите корректную сумму";
    }

    setErrors(nextErrors);
  }, [title, amount]);

  const isValid = !errors.title && !errors.amount;

  const handleSave = () => {
    if (!isValid) return;

    onSave({
      ...transaction,
      title: title.trim(),
      amount: Number(amount),
      type,
      category: category.trim() || "Прочее",
      date: new Date(date).toISOString(),
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Редактировать операцию</h3>

        <label>Название:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? styles.errorInput : ""}
        />
        {errors.title && <div className={styles.error}>{errors.title}</div>}

        <label>Сумма:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          className={errors.amount ? styles.errorInput : ""}
        />
        {errors.amount && <div className={styles.error}>{errors.amount}</div>}

        <label>Тип:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
        >
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>

        <label>Категория:</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} />

        <label>Дата:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className={styles.buttons}>
          <button
            className={styles.save}
            onClick={handleSave}
            disabled={!isValid}
          >
            Сохранить
          </button>
          <button className={styles.cancel} onClick={onCancel}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
