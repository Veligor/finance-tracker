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



  const textOnly = (value: string) => value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "");

  // ошибки под полями
  const [errors, setErrors] = useState({
    title: "",
    amount: "",
  });

  const clear = () => {
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("");
    setNote("");
    setErrors({ title: "", amount: "" });
  };

  const validate = () => {
    let valid = true;
    const nextErrors = { title: "", amount: "" };

    if (!title.trim()) {
      nextErrors.title = "Введите название операции";
      valid = false;
    }
  if (title.trim().length < 2) {
    nextErrors.title = "Минимум 2 буквы";
    valid = false;
  }

   if (!amount || Number(amount) <= 0) {
     nextErrors.amount = "Введите корректную сумму";
     valid = false;
   } else {
     const str = String(amount);
     if (str.length > 1 && str.startsWith("0")) {
       nextErrors.amount = "Сумма не может начинаться с нуля";
       valid = false;
     }
   }


    setErrors(nextErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const transaction: Transaction = {
      id: nanoid(),
      title: title.trim(),
      type,
      amount: Number(amount),
      category: category.trim() || "Прочее",
      date: new Date().toISOString(),
      note: note.trim() || undefined,
    };

    dispatch(addTransaction(transaction));
    clear();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.field}>
          {/* <input
            className={`${styles.input} ${
              errors.title ? styles.errorInput : ""
            }`}
            placeholder="Название (например: Продукты)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          /> */}
          <input
            className={`${styles.input} ${
              errors.title ? styles.errorInput : ""
            }`}
            placeholder="Название (например: Продукты)"
            value={title}
            onChange={(e) => {
              const cleaned = textOnly(e.target.value);
              setTitle(cleaned);
            }}
          />

          {errors.title && <div className={styles.error}>{errors.title}</div>}
        </div>

        <div className={styles.field}>
          <input
            className={`${styles.input} ${
              errors.amount ? styles.errorInput : ""
            }`}
            placeholder="Сумма"
            type="number"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;

              // Разрешаем пустую строку
              if (val === "") {
                setAmount("");
                return;
              }

              // Разрешаем только цифры
              if (!/^\d+$/.test(val)) return;

              // Запрещаем ведущий 0 при длине > 1
              if (val.length > 1 && val.startsWith("0")) {
                setErrors((prev) => ({
                  ...prev,
                  amount: "Сумма не может начинаться с нуля",
                }));
                return;
              } else {
                // очищаем ошибку, если пользователь исправил ввод
                setErrors((prev) => ({ ...prev, amount: "" }));
              }

              setAmount(Number(val));
            }}
          />
          {errors.amount && <div className={styles.error}>{errors.amount}</div>}
        </div>

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
        {/* <input
          className={styles.input}
          placeholder="Категория (необязательно)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        /> */}
        <input
          className={styles.input}
          placeholder="Категория (необязательно)"
          value={category}
          onChange={(e) => {
            const cleaned = textOnly(e.target.value);
            setCategory(cleaned);
          }}
        />

        <input
          className={styles.input}
          placeholder="Заметка (необязательно)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="addBtn" type="submit">
          Добавить
        </button>
      </div>
    </form>
  );
}
