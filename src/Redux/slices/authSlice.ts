import { createSlice } from "@reduxjs/toolkit";
import type {
  PayloadAction,
} from "@reduxjs/toolkit";

import type {
  AuthState,
  AuthResponse,
} from "../../types/auth.types";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<AuthResponse>
    ) => {
      state.user = action.payload.user;

      state.accessToken =
        action.payload.accessToken;

      state.refreshToken =
        action.payload.refreshToken;

      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;

      state.accessToken = null;

      state.refreshToken = null;

      state.isAuthenticated = false;
    },
  },
});

export const {
  setCredentials,
  logout,
} = authSlice.actions;

export default authSlice.reducer;