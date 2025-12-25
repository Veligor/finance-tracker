import React, { useState } from "react";
import { useAppDispatch } from "../../hooks";
import { updateTransaction } from "../../features/transactions/transactionsSlice";
import { Transaction } from "../../features/transactions/types";
import styles from "./EditTransactionModal.module.scss";

interface Props {
  transaction: Transaction;
  onSave: (updatedTransaction: Transaction) => void; 
  onCancel: () => void;
}

export default function EditTransactionModal({
  transaction,
  onSave,
  onCancel,
}: Props) {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount);
  const [type, setType] = useState<"income" | "expense">(transaction.type);
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(transaction.date.slice(0, 10));

  const handleSave = () => {
    const updatedTransaction: Transaction = {
      ...transaction,
      title,
      amount,
      type,
      category,
      date: new Date(date).toISOString(),
    };

    dispatch(updateTransaction(updatedTransaction));
    onSave(updatedTransaction); // вызываем onSave, передав обновленную транзакцию
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Редактировать операцию</h3>

        <label>Название:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Сумма:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

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
          <button className={styles.save} onClick={handleSave}>
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
