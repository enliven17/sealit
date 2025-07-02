"use client";

import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { LockedParticles } from "@/components/LockedParticles";
import { StellarWalletsKit, WalletNetwork, allowAllModules } from '@creit.tech/stellar-wallets-kit';
import Server, { Asset, TransactionBuilder, Networks, Operation, BASE_FEE } from 'stellar-sdk';
import { AQUA, YUSDC, BLEND_POOL_ADDRESS } from '@/constants/assets';

type Post = {
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
};

type Props = {
  posts: Post[];
  onUnlock: (id: number) => void;
};

const glow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(54,176,74,0.18); border-color: #23272f; }
  50% { box-shadow: 0 0 16px 2px rgba(54,176,74,0.32); border-color: #36B04A; }
  100% { box-shadow: 0 0 0 0 rgba(54,176,74,0.18); border-color: #23272f; }
`;

const Feed = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 32px;
`;
const PostCard = styled.div<{ $locked: boolean }>`
  background: #181c24;
  border-radius: 18px;
  padding: 32px 32px 28px 32px;
  color: #fff;
  position: relative;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  border: 1.5px solid #23272f;
  overflow: hidden;
  min-height: 180px;
  transition: border-color 0.2s, box-shadow 0.2s;
  ${({ $locked }) => $locked && css`
    filter: grayscale(0.7) blur(2px);
    opacity: 0.7;
  `}
  &:hover {
    animation: ${glow} 1.2s linear;
    border-color: #36B04A;
    box-shadow: 0 0 16px 2px rgba(54,176,74,0.32);
  }
`;
const UnlockButton = styled.button`
  display: block;
  width: 100%;
  margin: 24px auto 0 auto;
  background: #ffb300;
  color: #222;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-weight: bold;
  font-size: 1.08rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover { background: #36B04A; color: #fff; }
`;
const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;
const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;
const Username = styled.div`
  font-weight: bold;
  color: #fff;
  font-size: 1.05rem;
`;
const Time = styled.div`
  color: #b3b8c5;
  font-size: 0.92rem;
`;
const Img = styled.img`
  max-width: 320px;
  max-height: 220px;
  border-radius: 12px;
  margin-top: 14px;
  border: 1px solid #23272f;
`;

const DEMO_POSTS: Post[] = [
  {
    id: 1,
    content: "Launching my new NFT collection on Stellar! 🚀",
    token: "AQUA",
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
    content: "Just added liquidity to the AQUA/yUSDC Blend pool. Loving the rewards!",
    token: "yUSDC",
    amount: 15,
    locked: false,
    user: {
      name: "Lucas Reed",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
      time: "1 hour ago"
    }
  },
  {
    id: 3,
    content: "SocialFi is the future. Token-gated posts are a game changer!",
    token: "AQUA",
    amount: 10,
    locked: true,
    user: {
      name: "Sophia Lee",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      time: "just now"
    }
  }
];

const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  modules: allowAllModules(),
});

export const PostFeed: React.FC<Props> = ({ posts, onUnlock }) => {
  const [loadingId, setLoadingId] = React.useState<number | null>(null);
  const [errorId, setErrorId] = React.useState<number | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const showPosts = posts.length > 0 ? posts : DEMO_POSTS;
  const handleUnlockClick = async (post: Post) => {
    setErrorId(null);
    setErrorMsg(null);
    setLoadingId(post.id);
    try {
      // Wallets Kit ile transfer
      const server = new Server('https://horizon-testnet.stellar.org');
      const result = await kit.getAddress();
      const pubkey = result.address;
      const account = await server.loadAccount(pubkey);
      const asset = post.token === 'AQUA' ? new Asset(AQUA.code, AQUA.issuer) : new Asset(YUSDC.code, YUSDC.issuer);
      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(Operation.payment({
          destination: BLEND_POOL_ADDRESS,
          asset,
          amount: post.amount.toString(),
        }))
        .setTimeout(60)
        .build();
      let signed;
      try {
        signed = await kit.signTransaction(tx.toXDR(), {
          address: pubkey,
          networkPassphrase: Networks.TESTNET,
        });
      } catch (e) {
        setErrorId(post.id);
        setErrorMsg('Transaction signing failed: ' + ((e as any)?.message || 'Unknown error'));
        setLoadingId(null);
        return;
      }
      const signedXDR = typeof signed === 'string' ? signed : signed.signedTxXdr;
      const res = await server.submitTransaction(TransactionBuilder.fromXDR(signedXDR, 'Test SDF Network ; September 2015'));
      if (res.successful) {
        onUnlock(post.id);
      } else {
        setErrorId(post.id);
        setErrorMsg('Token transfer failed.');
      }
    } catch (e: any) {
      setErrorId(post.id);
      setErrorMsg('Token transfer failed: ' + (e?.message || 'Unknown error'));
    } finally {
      setLoadingId(null);
    }
  };
  return (
    <Feed>
      {showPosts.map(post => (
        <PostCard key={post.id} $locked={!!post.locked}>
          {post.locked && <LockedParticles />}
          <UserRow>
            <Avatar src={post.user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt="avatar" />
            <div>
              <Username>{post.user?.name || "Demo User"}</Username>
              <Time>{post.user?.time || "now"}</Time>
            </div>
          </UserRow>
          <div style={{fontWeight:'bold', marginBottom:8}}>
            Locked: {post.amount} {post.token}
          </div>
          <div>{post.content}</div>
          {post.imageUrl && <Img src={post.imageUrl} alt="post image" />}
          {post.locked && (
            <>
              <UnlockButton onClick={() => handleUnlockClick(post)} disabled={loadingId === post.id}>
                {loadingId === post.id ? 'Unlocking...' : `Unlock for ${post.amount} ${post.token}`}
              </UnlockButton>
              {errorId === post.id && errorMsg && (
                <div style={{color:'#ff5252',marginTop:8}}>{errorMsg}</div>
              )}
            </>
          )}
        </PostCard>
      ))}
    </Feed>
  );
}; 