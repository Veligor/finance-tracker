import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "./types";

interface TransactionsState {
  list: Transaction[];
}

const initialState: TransactionsState = {
  list: [],
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.list.push(action.payload);
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTransaction, removeTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
