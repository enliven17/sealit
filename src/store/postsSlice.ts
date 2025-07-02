import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Post {
  id: number;
  content: string;
  token: string;
  amount: number;
  locked: boolean;
  imageUrl?: string;
  user?: {
    name: string;
    avatar: string;
    time: string;
  };
}

interface PostsState {
  posts: Post[];
}

const initialState: PostsState = {
  posts: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost(state, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload);
    },
    unlockPost(state, action: PayloadAction<number>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) post.locked = false;
    },
  },
});

export const { addPost, unlockPost } = postsSlice.actions;
export default postsSlice.reducer; 