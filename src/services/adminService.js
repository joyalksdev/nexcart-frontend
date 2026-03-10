import api from "./axios"

// Example adminService.js
export const getAnalytics = async () => {
  // Make sure this path matches the backend route exactly
  const res = await api.get("/analytics/stats"); 
  return res.data;
};