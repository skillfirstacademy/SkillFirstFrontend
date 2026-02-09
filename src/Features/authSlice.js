import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: storedUser || null,
  accessToken: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isBlocked: storedUser?.isBlocked || false,
  isBlockedAll: storedUser?.isBlockedAll || false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const user = action.payload.user;

      state.user = user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      state.isBlocked = user?.isBlocked || false;
      state.isBlockedAll = user?.isBlockedAll || false;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", action.payload.accessToken);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isBlocked = false;
      state.isBlockedAll = false;

      localStorage.clear();
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
