import api from "./axios"
import { setUser, logout, finishRestoring } from "../features/auth/authSlice"

// log into account
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data)
  return res.data
}

// sign up new user
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data)
  return res.data
}

// sign out
export const logoutUser = async () => {
  const res = await api.post("/auth/logout")
  return res.data
}

// get current user info
export const getProfile = async () => {
  const res = await api.get("/profile")
  return res.data
}

// check if user is still logged in on refresh
export const restoreUserSession = async (dispatch) => {
  try {
    const res = await api.get("/profile"); 
    dispatch(setUser(res.data.data)); 
  } catch (err) {
    dispatch(logout());
  } finally {
    dispatch(finishRestoring());
  }
};