import api from "./axios";

// fetch product recommendations (RapidMiner Logic)
export const getRecommendations = async (category = "") => {
  const res = await api.get(`/analytics?category=${category}`);
  return res.data;
};