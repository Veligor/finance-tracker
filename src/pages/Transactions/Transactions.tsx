// import React, { useMemo, useState } from "react";
// import { useAppSelector } from "../../hooks";
// import { RootState } from "../../app/store";
// import styles from "./Transactions.module.scss";

// export default function TransactionsPage() {
//   const transactions = useAppSelector((s: RootState) => s.transactions.items);

//   const [type, setType] = useState<"all" | "income" | "expense">("all");
//   const [category, setCategory] = useState("all");

//   // категории только из транзакций
//   const categories = useMemo(() => {
//     const set = new Set(transactions.map((t) => t.category));
//     return ["all", ...Array.from(set)];
//   }, [transactions]);

//   // обработка фильтров
//   const filtered = useMemo(() => {
//     let list = [...transactions];

//     if (type !== "all") {
//       list = list.filter((t) => t.type === type);
//     }

//     if (category !== "all") {
//       list = list.filter((t) => t.category === category);
//     }

//     // сортировка новые → старые
//     return list.sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     );
//   }, [transactions, type, category]);

//   return (
//     <div className={styles.wrapper}>
//       <h2>Операции</h2>

//       {/* Панель фильтров */}
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

//       {/* Список транзакций */}
//       <div className={styles.list}>
//         {filtered.length === 0 && <div>Нет операций</div>}

//         {filtered.map((t) => (
//           <div key={t.id} className={styles.item}>
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
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }












import React, { useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { RootState } from "../../app/store";
import { deleteTransaction } from "../../features/transactions/transactionsSlice";
import styles from "./Transactions.module.scss";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [category, setCategory] = useState("all");

  // категории только из транзакций
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ["all", ...Array.from(set)];
  }, [transactions]);

  // обработка фильтров
  const filtered = useMemo(() => {
    let list = [...transactions];

    if (type !== "all") {
      list = list.filter((t) => t.type === type);
    }

    if (category !== "all") {
      list = list.filter((t) => t.category === category);
    }

    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, type, category]);

  return (
    <div className={styles.wrapper}>
      <h2>Операции</h2>

      {/* Панель фильтров */}
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

      {/* Список транзакций */}
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
                {t.type === "income" ? "+" : "-"}
                {t.amount} ₽
              </div>

              <div className={styles.date}>
                {new Date(t.date).toLocaleDateString("ru-RU")}
              </div>

              {/* ❌ Кнопка удаления */}
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  if (confirm("Удалить операцию?")) {
                    dispatch(deleteTransaction(t.id));
                  }
                }}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
