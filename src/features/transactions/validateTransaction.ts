import { Transaction } from "./types";

export function validateTransaction(t: Transaction): string | null {
  if (!t.title || !t.title.trim()) {
    return "Название обязательно";
  }

  if (t.amount <= 0 || Number.isNaN(t.amount)) {
    return "Сумма должна быть больше нуля";
  }

  if (t.amount > 1_000_000_000) {
    return "Слишком большая сумма";
  }

  if (t.type !== "income" && t.type !== "expense") {
    return "Неверный тип операции";
  }

  if (!t.category || !t.category.trim()) {
    return "Категория обязательна";
  }

  if (!t.date || isNaN(Date.parse(t.date))) {
    return "Неверная дата";
  }

  return null;
}
