import React, { useState } from 'react';
import styled, { css } from 'styled-components';

type Post = {
  id: number;
  content: string;
  token: string;
  amount: number;
  locked: boolean;
};

type Props = {
  posts: Post[];
  onUnlock: (id: number) => void;
};

const Feed = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const PostCard = styled.div<{ locked: boolean }>`
  background: #23272f;
  border-radius: 12px;
  padding: 20px 18px;
  color: #fff;
  position: relative;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  ${({ locked }) => locked && css`
    filter: grayscale(0.7) blur(2px);
    opacity: 0.7;
  `}
`;
const UnlockButton = styled.button`
  position: absolute;
  right: 18px;
  bottom: 18px;
  background: #ffb300;
  color: #222;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  &:hover { background: #ffa000; }
`;

export const PostFeed: React.FC<Props> = ({ posts, onUnlock }) => {
  return (
    <Feed>
      {posts.map(post => (
        <PostCard key={post.id} locked={post.locked}>
          <div style={{fontWeight:'bold', marginBottom:8}}>
            {post.token} ile {post.amount} token kilitli
          </div>
          <div>{post.content}</div>
          {post.locked && (
            <UnlockButton onClick={() => onUnlock(post.id)}>
              Kilidi Aç
            </UnlockButton>
          )}
        </PostCard>
      ))}
    </Feed>
  );
}; 