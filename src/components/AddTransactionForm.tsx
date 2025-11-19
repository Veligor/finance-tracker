import { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useAppDispatch } from "../hooks";
import { addTransaction } from "../features/transactions/transactionsSlice";
import { Transaction } from "../features/transactions/types";

export default function AddTransactionForm() {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transaction: Transaction = {
      id: nanoid(),
      title,
      type,
      amount,
      category,
      date: new Date().toISOString(),
      note,
    };

    dispatch(addTransaction(transaction));

    setTitle("");
    setAmount(0);
    setCategory("");
    setNote("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название"
      />

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Сумма"
      />

      <select value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="income">Доход</option>
        <option value="expense">Расход</option>
      </select>

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Категория"
      />

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Заметка"
      />

      <button type="submit">Добавить</button>
    </form>
  );
}
