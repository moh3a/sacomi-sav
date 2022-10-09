import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState = {
  current_deliveries_id: "",
  current_entries_id: "",
  current_jobs_id: 0,
  current_orders_id: "",
  current_prestations_id: "",
};

export const currentIdSlice = createSlice({
  name: "currentId",
  initialState,
  reducers: {
    getIds: (state, action) => {
      state.current_deliveries_id = action.payload.current_deliveries_id;
      state.current_entries_id = action.payload.current_entries_id;
      state.current_jobs_id = action.payload.current_jobs_id;
      state.current_orders_id = action.payload.current_orders_id;
      state.current_prestations_id = action.payload.current_prestations_id;
    },
  },
  extraReducers: (builder) => {},
});

export const selectCurrentId = (state: RootState) => state.currentId;
export const { getIds } = currentIdSlice.actions;

export default currentIdSlice.reducer;
