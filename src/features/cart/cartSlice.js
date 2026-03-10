import { createSlice } from "@reduxjs/toolkit";

// get saved cart from browser storage
const loadCart = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // add item or bump quantity
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((p) => p._id === item._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: 1,
        });
      }
    },

    // remove item entirely
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },

    // increase item count
    increaseQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    // decrease count or remove if it hits zero
    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (!item) return;

      if (item.quantity === 1) {
        state.items = state.items.filter((i) => i._id !== action.payload);
      } else {
        item.quantity -= 1;
      }
    },

    // empty the whole cart
    clearCart: (state) => {
      state.items = [];
    },

    // manually set cart items
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
});



export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  setCart
} = cartSlice.actions;

export default cartSlice.reducer;