import TransactionList from "../../components/TransactionList/TransactionList";
import AddTransactionForm from "../../components/AddTransactionForm/AddTransactionForm";
export default function Home() {
  return (
    <div className="dashboard">
      <AddTransactionForm />
      <TransactionList />
    </div>
  );
}
