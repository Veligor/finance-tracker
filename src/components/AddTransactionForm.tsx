import React, { useState } from "react";
import { useAppDispatch } from "../hooks";
import { addTransaction } from "../features/transactions/transactionsSlice";
import { Transaction } from "../features/transactions/types";
import { nanoid } from "nanoid";
import "./AddTransactionForm.scss";

export const AddTransactionForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || amount <= 0) return;

    const transaction: Transaction = {
      id: nanoid(),
      type,
      amount,
      category,
      date: new Date().toISOString(),
      note,
    };

    dispatch(addTransaction(transaction));

    // очистка формы
    setAmount(0);
    setCategory("");
    setNote("");
    setType("expense");
  };

  return (
    <form className="add-transaction-form" onSubmit={handleSubmit}>
      <div>
        <label>Тип:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
        >
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>
      </div>

      <div>
        <label>Сумма:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Категория:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div>
        <label>Заметка:</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button type="submit">Добавить</button>
    </form>
  );
};
