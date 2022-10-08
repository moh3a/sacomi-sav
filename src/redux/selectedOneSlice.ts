import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState = {
  selected_client: 0,
  selected_delivery: 0,
  selected_entry: 0,
  selected_job: 0,
  selected_order: 0,
  selected_product: 0,
  selected_prestation: 0,
};

export const selectedOneSlice = createSlice({
  name: "selectedOne",
  initialState,
  reducers: {
    select_client: (state, action) => {
      state.selected_client = action.payload;
    },
    select_delivery: (state, action) => {
      state.selected_delivery = action.payload;
    },
    select_entry: (state, action) => {
      state.selected_entry = action.payload;
    },
    select_job: (state, action) => {
      state.selected_job = action.payload;
    },
    select_order: (state, action) => {
      state.selected_order = action.payload;
    },
    select_product: (state, action) => {
      state.selected_product = action.payload;
    },
    select_prestation: (state, action) => {
      state.selected_prestation = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const selectSelectedOne = (state: RootState) => state.selectedOne;
export const {
  select_client,
  select_delivery,
  select_entry,
  select_job,
  select_order,
  select_prestation,
  select_product,
} = selectedOneSlice.actions;

export default selectedOneSlice.reducer;
