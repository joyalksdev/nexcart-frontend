import api from "./axios";

// update user info
export const updateUserProfile = async (data) => {
  const res = await api.put("/profile", data);
  if (!res.data.success) throw new Error(res.data.message || "Update failed");
  return res.data.data;
};

// change account password
export const updatePassword = async (data) => {
  const res = await api.put("/profile/password", data);
  return res.data;
};