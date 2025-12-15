import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "./types";

interface TransactionsState {
  items: Transaction[];
}

const initialState: TransactionsState = {
  items: [],
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.items.push(action.payload);
    },
    deleteTransaction(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    updateTransaction: (state, action) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { addTransaction, deleteTransaction, updateTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
