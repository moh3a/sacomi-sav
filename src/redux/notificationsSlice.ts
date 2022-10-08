import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState = {
  message: "",
  type: "",
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    create_notification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    reset_notification: (state) => {
      state.message = "";
      state.type = "";
    },
  },
  extraReducers: (builder) => {},
});

export const selectNotifications = (state: RootState) => state.notifications;
export const { create_notification, reset_notification } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
