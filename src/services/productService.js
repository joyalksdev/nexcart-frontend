import api from "./axios"

// Get all products
export const getProducts = async (params = {}) => {
  const res = await api.get("/products", { params })
  return res.data
}

// Get single product
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`)
  return res.data
}

// Create product (Admin)
export const createProduct = async (productData) => {
  const res = await api.post("/products", productData)
  return res.data
}

// Update product (Admin)
export const updateProduct = async (id, productData) => {
  const res = await api.put(`/products/${id}`, productData)
  return res.data
}

// Delete product (Admin)
export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`)
  return res.data
}