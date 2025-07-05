import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import avatarImg from '@/assets/profile/profile.jpeg';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  username: string;
  avatar: string;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  username: 'enliven',
  avatar: typeof avatarImg === 'string' ? avatarImg : avatarImg.src,
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
    setProfile(state, action: PayloadAction<{ username: string; avatar: string }>) {
      state.username = action.payload.username;
      state.avatar = action.payload.avatar;
    },
  },
});

export const { connect, disconnect, setProfile } = walletSlice.actions;
export default walletSlice.reducer; 