// import Home from "./pages/Home/Home";


// function App() {
//   return (
//     <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
//       <Home />
//     </div>
//   );
// }

// export default App;
import React from "react";
import AddTransactionForm from "./components/AddTransactionForm/AddTransactionForm";
import TransactionList from "./components/TransactionList/TransactionList";
import "./styles/global.scss";
import { useAppSelector } from "./hooks";
import { RootState } from "./app/store";

function Header() {
  const transactions = useAppSelector((s: RootState) => s.transactions.items);
  const total = transactions.reduce(
    (acc, cur) => acc + (cur.type === "income" ? cur.amount : -cur.amount),
    0
  );

  return (
    <div className="header">
      <div>
        <div className="app-title">Personal Finance</div>
        <div className="muted">Учёт доходов и расходов</div>
      </div>

      <div className="balance-card">
        <div>
          <div className="balance-sub">Баланс</div>
          <div className="balance-value">{total} ₽</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="container">
      <Header />
      <div className="layout">
        <div>
          <div className="card mb-12">
            <AddTransactionForm />
          </div>

          <TransactionList />
        </div>

        <aside>
          <div className="card">
            <h3>Краткая статистика</h3>
            <p className="muted">
              Здесь позже будут графики и ключевые показатели
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
