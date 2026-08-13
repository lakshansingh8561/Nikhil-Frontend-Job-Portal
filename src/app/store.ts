import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import { apiSlice } from "../Redux/api/apiSlice";

const authResetMiddleware = (storeApi: any) => (next: any) => (action: any) => {
  const result = next(action);
  if (action.type === "auth/setCredentials" || action.type === "auth/logout") {
    storeApi.dispatch(apiSlice.util.resetApiState());
  }
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,

    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      authResetMiddleware
    ),
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch =
  typeof store.dispatch;