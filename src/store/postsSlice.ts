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
  posts: [
    {
      id: 1,
      content: "Launching my new NFT collection on Stellar! 🚀",
      token: "XLM",
      amount: 20,
      locked: true,
      user: {
        name: "Emma Hamilton",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        time: "2 hours ago"
      },
      imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      content: "Just added liquidity to the TestnetV2 Pool. Loving the rewards!",
      token: "XLM",
      amount: 15,
      locked: false,
      user: {
        name: "Atlas Doruk Aykar",
        avatar: "https://randomuser.me/api/portraits/men/65.jpg",
        time: "1 hour ago"
      }
    },
    {
      id: 3,
      content: "SocialFi is the future. Token-gated posts are a game changer!",
      token: "XLM",
      amount: 10,
      locked: true,
      user: {
        name: "Sophia Lee",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        time: "just now"
      }
    }
  ],
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