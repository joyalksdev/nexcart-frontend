import api from "./axios";

// get list of all users
export const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

// delete a user account
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

// change user permissions
export const updateRole = async (id, role) => {
  const res = await api.put(`/users/${id}/role`, { role });
  return res.data;
};