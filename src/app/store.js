import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/orders/orderSlice";

// main redux store config
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});

// save cart to local storage whenever it changes
store.subscribe(() => {
  const state = store.getState();

  localStorage.setItem(
    "cart", 
    JSON.stringify(state.cart.items)
  );
});