import { createSlice } from "@reduxjs/toolkit"

// manage customer order history
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: []
  },
  reducers: {} // placeholder for future order actions
})

export default orderSlice.reducer