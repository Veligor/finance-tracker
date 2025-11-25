// import React from "react";
// import AddTransactionForm from "../../components/AddTransactionForm/AddTransactionForm";
// import TransactionList from "../../components/TransactionList/TransactionList";
// import BalanceCard from "../../components/BalanceCard/BalanceCard";
// import StatsSummary from "../../components/StatsSummary/StatsSummary";
// import { useAppSelector } from "../../hooks";
// import { RootState } from "../../app/store";

// export default function Home() {
//   const transactions = useAppSelector((s: RootState) => s.transactions.items);

//   const income = transactions
//     .filter((t) => t.type === "income")
//     .reduce((a, b) => a + b.amount, 0);

//   const expenses = transactions
//     .filter((t) => t.type === "expense")
//     .reduce((a, b) => a + b.amount, 0);

//   return (
//     <div className="homePage">
//       <div className="card mb-12">
//         <AddTransactionForm />
//       </div>

//       <BalanceCard balance={income - expenses} />
//       <StatsSummary income={income} expenses={expenses} />
//       <TransactionList />
//     </div>
//   );
// }















// import React from "react";
// import AddTransactionForm from "../../components/AddTransactionForm/AddTransactionForm";
// import TransactionList from "../../components/TransactionList/TransactionList";
// import BalanceCard from "../../components/BalanceCard/BalanceCard";
// import StatsSummary from "../../components/StatsSummary/StatsSummary";
// import PieChartBlock from "../../components/charts/PieChartBlock";
// import LineChartBlock from "../../components/charts/LineChartBlock";
// import { useAppSelector } from "../../hooks";
// import { RootState } from "../../app/store";

// export default function Home() {
//   const transactions = useAppSelector((s: RootState) => s.transactions.items);

//   const income = transactions
//     .filter((t) => t.type === "income")
//     .reduce((a, b) => a + b.amount, 0);

//   const expenses = transactions
//     .filter((t) => t.type === "expense")
//     .reduce((a, b) => a + b.amount, 0);

//   return (
//     <div className="homePage">
//       <BalanceCard balance={income - expenses} />

//       <StatsSummary income={income} expenses={expenses} />

//       {/* Графики */}
//       <div className="dashboard-charts">
//         <PieChartBlock />
//         <LineChartBlock />
//       </div>

//       {/* Форма */}
//       <div className="card mb-12">
//         <AddTransactionForm />
//       </div>

//       {/* Операции */}
//       <TransactionList />
//     </div>
//   );
// }

























import React from "react";
import AddTransactionForm from "../../components/AddTransactionForm/AddTransactionForm";
import TransactionList from "../../components/TransactionList/TransactionList";
import BalanceCard from "../../components/BalanceCard/BalanceCard";
import StatsSummary from "../../components/StatsSummary/StatsSummary";
import PieChartBlock from "../../components/charts/PieChartBlock";
import LineChartBlock from "../../components/charts/LineChartBlock";
import CategoriesChart from "../../components/charts/CategoriesChart"; // <-- ДОБАВИЛ
import { useAppSelector } from "../../hooks";
import { RootState } from "../../app/store";

export default function Home() {
  const transactions = useAppSelector((s: RootState) => s.transactions.items);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="homePage">
      <BalanceCard balance={income - expenses} />

      <StatsSummary income={income} expenses={expenses} />

      {/* Графики */}
      <div className="dashboard-charts">
        <PieChartBlock />
        <LineChartBlock />
        <CategoriesChart transactions={transactions} /> {/* <-- ВСТАВЛЯЕМ */}
      </div>

      {/* Форма */}
      <div className="card mb-12">
        <AddTransactionForm />
      </div>

      {/* Операции */}
      <TransactionList />
    </div>
  );
}
