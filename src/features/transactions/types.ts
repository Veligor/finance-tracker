export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  title: string; // НАЗВАНИЕ ТРАНЗАКЦИИ
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  note?: string;
}
