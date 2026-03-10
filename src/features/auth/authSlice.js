import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  isRestoring: true, // check if session is active on refresh
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // start login process
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // login successful
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },

    // login failed
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // update user data
    setUser: (state, action) => {
      state.user = action.payload;
      state.isRestoring = false;
    },

    // clear user on logout
    logout: (state) => {
      state.user = null;
      state.isRestoring = false;
    },

    // stop loading state for session check
    finishRestoring: (state) => {
      state.isRestoring = false;
    },
  },
});



export const { 
  loginStart, 
  loginSuccess, 
  loginFail, 
  setUser, 
  logout, 
  finishRestoring 
} = authSlice.actions;

export default authSlice.reducer;