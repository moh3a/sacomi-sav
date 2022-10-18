import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState = {
  selected_clients: [],
  selected_deliveries: [],
  selected_entries: [],
  selected_jobs: [],
  selected_orders: [],
  selected_products: [],
  selected_prestations: [],
  selected_transactions: [],
};

export const selectedAllSlice = createSlice({
  name: "selectedAll",
  initialState,
  reducers: {
    select_clients: (state, action) => {
      state.selected_clients = action.payload;
    },
    select_deliveries: (state, action) => {
      state.selected_deliveries = action.payload;
    },
    select_entries: (state, action) => {
      state.selected_entries = action.payload;
    },
    select_jobs: (state, action) => {
      state.selected_jobs = action.payload;
    },
    select_orders: (state, action) => {
      state.selected_orders = action.payload;
    },
    select_products: (state, action) => {
      state.selected_products = action.payload;
    },
    select_prestations: (state, action) => {
      state.selected_prestations = action.payload;
    },
    select_transactions: (state, action) => {
      state.selected_transactions = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const selectSelectedAll = (state: RootState) => state.selectedAll;
export const {
  select_clients,
  select_deliveries,
  select_entries,
  select_jobs,
  select_orders,
  select_prestations,
  select_products,
  select_transactions,
} = selectedAllSlice.actions;

export default selectedAllSlice.reducer;
