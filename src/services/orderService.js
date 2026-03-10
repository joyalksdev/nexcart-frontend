import api from "./axios"; 

// Create a new order
export const createOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

// Get logged-in user's orders
export const getMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};

// Get a single order by ID 
export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

// Get ALL orders (Admin)
export const getAllOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

// Update order status (Admin)
export const updateOrderStatus = async (id, status) => {
  const res = await api.put(`/orders/${id}`, { status });
  return res.data;
};

// Delete an order (Admin)
export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/${id}`);
  return res.data;
};