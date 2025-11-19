import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./features/transactions/transactionsSlice";

export const store = configureStore({
  reducer: { transactions: transactionsReducer },
});

// Типы стора
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
