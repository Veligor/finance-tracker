import React from "react";
import AddTransactionForm from "../../components/AddTransactionForm/AddTransactionForm";
import TransactionList from "../../components/TransactionList/TransactionList";
import BalanceCard from "../../components/BalanceCard/BalanceCard";
import StatsSummary from "../../components/StatsSummary/StatsSummary";
import CategoriesChart from "../../components/charts/CategoriesChart";
import LineChartBlock from "../../components/charts/LineChartBlock";
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

      <div className="dashboard-charts">
        <CategoriesChart transactions={transactions} type="income" />{" "}
        
        <LineChartBlock type="expense" />
      </div>

      <div className="card mb-12">
        <AddTransactionForm />
      </div>

      <TransactionList />
    </div>
  );
}
