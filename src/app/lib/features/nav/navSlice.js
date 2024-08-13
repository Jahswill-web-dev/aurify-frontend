import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

const NavSlice = createSlice({
  name: 'cart',
  initialState,
});

console.log(NavSlice);

export default NavSlice.reducer;