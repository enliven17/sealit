import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  address: string | null;
  isConnected: boolean;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connect(state, action: PayloadAction<string>) {
      state.address = action.payload;
      state.isConnected = true;
    },
    disconnect(state) {
      state.address = null;
      state.isConnected = false;
    },
  },
});

export const { connect, disconnect } = walletSlice.actions;
export default walletSlice.reducer; 