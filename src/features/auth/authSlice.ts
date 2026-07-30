import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Role = "JOB_SEEKER" | "RECRUITER" | "ADMIN";

type User = {
  id: string;
  email: string;
  role: Role;
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const getInitialAuthState = (): AuthState => {
  try {
    const savedUser = localStorage.getItem("jobbox_user");
    const savedAccessToken = localStorage.getItem("jobbox_accessToken");
    const savedRefreshToken = localStorage.getItem("jobbox_refreshToken");

    if (savedUser && savedAccessToken) {
      return {
        user: JSON.parse(savedUser),
        accessToken: savedAccessToken,
        refreshToken: savedRefreshToken || null,
        isAuthenticated: true,
      };
    }
  } catch (_e) {
    // Ignore JSON parse errors
  }

  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      try {
        localStorage.setItem("jobbox_user", JSON.stringify(action.payload.user));
        localStorage.setItem("jobbox_accessToken", action.payload.accessToken);
        localStorage.setItem("jobbox_refreshToken", action.payload.refreshToken);
      } catch (_e) {
        // Storage quota or error fallback
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      try {
        localStorage.removeItem("jobbox_user");
        localStorage.removeItem("jobbox_accessToken");
        localStorage.removeItem("jobbox_refreshToken");
      } catch (_e) {
        // Ignore storage errors
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;