// import React, { useState } from "react";
// import { Transaction } from "../../features/transactions/types";
// import styles from "./EditTransactionModal.module.scss";

// interface Props {
//   transaction: Transaction;
//   onSave: (updated: Transaction) => void;
//   onCancel: () => void;
// }

// export default function EditTransactionModal({
//   transaction,
//   onSave,
//   onCancel,
// }: Props) {
//   const [title, setTitle] = useState(transaction.title);
//   const [amount, setAmount] = useState(transaction.amount);
//   const [type, setType] = useState<"income" | "expense">(transaction.type);
//   const [category, setCategory] = useState(transaction.category);
//   const [date, setDate] = useState(transaction.date.slice(0, 10));

//   const handleSave = () => {
//     onSave({
//       ...transaction,
//       title,
//       amount,
//       type,
//       category,
//       date: new Date(date).toISOString(),
//     });
//   };

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.modal}>
//         <h3>Редактировать операцию</h3>

//         <label>Название:</label>
//         <input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <label>Сумма:</label>
//         <input
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//         />

//         <label>Тип:</label>
//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value as "income" | "expense")}
//         >
//           <option value="income">Доход</option>
//           <option value="expense">Расход</option>
//         </select>

//         <label>Категория:</label>
//         <input value={category} onChange={(e) => setCategory(e.target.value)} />

//         <label>Дата:</label>
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />

//         <div className={styles.buttons}>
//           <button className={styles.save} onClick={handleSave}>
//             Сохранить
//           </button>
//           <button className={styles.cancel} onClick={onCancel}>
//             Отмена
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




















import React, { useState } from "react";
import { Transaction } from "../../features/transactions/types";
import styles from "./EditTransactionModal.module.scss";

interface Props {
  transaction: Transaction;
  onSave: (updated: Transaction) => void;
  onCancel: () => void;
}

const textOnly = (value: string) => value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "");

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

  const [error, setError] = useState("");

  const handleSave = () => {
    if (title.trim().length < 2) {
      setError("Название должно содержать минимум 2 буквы");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Введите корректную сумму");
      return;
    }

    setError("");

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
          onChange={(e) => setTitle(textOnly(e.target.value))}
        />

        <label>Сумма:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") return setAmount("");
            if (!/^\d+$/.test(v)) return;
            setAmount(Number(v));
          }}
        />

        <label>Тип:</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>

        <label>Категория:</label>
        <input
          value={category}
          onChange={(e) => setCategory(textOnly(e.target.value))}
        />

        <label>Дата:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {error && <div className={styles.error}>{error}</div>}

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

