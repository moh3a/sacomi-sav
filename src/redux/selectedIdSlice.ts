import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState = {
  selected_id: 0,
};

export const selectedIdSlice = createSlice({
  name: "selectedId",
  initialState,
  reducers: {
    select_id: (state, action) => {
      state.selected_id = action.payload.id;
    },
  },
  extraReducers: (builder) => {},
});

export const selectSelectedId = (state: RootState) => state.selectedId;
export const { select_id } = selectedIdSlice.actions;

export default selectedIdSlice.reducer;
