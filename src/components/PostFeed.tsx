"use client";

import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { LockedParticles } from "@/components/LockedParticles";
import { Confetti } from "@/components/Confetti";
import { StellarWalletsKit, WalletNetwork, allowAllModules } from '@creit.tech/stellar-wallets-kit';
import { 
  Server, 
  Asset, 
  TransactionBuilder, 
  Networks, 
  Operation, 
  BASE_FEE 
} from 'stellar-sdk';
import { BLND, BLEND_POOL_ADDRESS, PLATFORM_ADDRESS, calculateUnlockFee } from '@/constants/assets';
import demoPostImg from '@/assets/posts/demopost.png';

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
  likes?: number;
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

const heartPop = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.4); }
  60% { transform: scale(0.92); }
  100% { transform: scale(1); }
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
  padding: 32px 32px 90px 32px;
  color: #fff;
  position: relative;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  border: 1.5px solid #23272f;
  overflow: hidden;
  min-height: 240px;
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
const UnlockButton = styled.button<{ $locked?: boolean }>`
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
  ${({ $locked }) => $locked && `
    filter: none !important;
    z-index: 3;
  `}
`;
const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
`;
const PostMeta = styled.div`
  margin-bottom: 22px;
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
  display: block;
  margin: 28px auto 0 auto;
  width: 100%;
  max-width: 720px;
  max-height: 540px;
  border-radius: 22px;
  border: 2px solid #23272f;
  object-fit: contain;
  background: #181c24;
  box-shadow: 0 4px 24px rgba(0,0,0,0.16);
`;
const LikeRow = styled.div`
  position: absolute;
  right: 18px;
  bottom: 18px;
  background: #23272f;
  border-radius: 16px;
  padding: 6px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
`;
const LikeButton = styled.button<{ animate?: boolean }>`
  background: none;
  border: none;
  color: #ff5252;
  font-size: 1.18rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.18s;
  &:hover { color: #e53935; }
  span.heart {
    display: inline-block;
    ${({ animate }) => animate && css`
      animation: ${heartPop} 0.5s cubic-bezier(.36,1.01,.32,1) both;
    `}
  }
`;

const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  modules: allowAllModules(),
});

export const PostFeed: React.FC<Props> = ({ posts, onUnlock }) => {
  const [loadingId, setLoadingId] = React.useState<number | null>(null);
  const [errorId, setErrorId] = React.useState<number | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [likes, setLikes] = useState<{[id:number]:number}>({});
  const [liked, setLiked] = useState<{[id:number]:boolean}>({});
  const [heartAnim, setHeartAnim] = useState<{[id:number]:boolean}>({});
  const showPosts = posts;
  const handleUnlockClick = async (post: Post) => {
    setErrorId(null);
    setErrorMsg(null);
    setLoadingId(post.id);
    try {
      // Wallets Kit ile unlock işlemi
      const server = new Server('https://horizon-testnet.stellar.org');
      const result = await kit.getAddress();
      const pubkey = result.address;
      const account = await server.loadAccount(pubkey);
      
      // Unlock ücretini hesapla
      const unlockFee = calculateUnlockFee(post.amount);
      
      // Önce kullanıcının BLND token'ına sahip olup olmadığını kontrol et
      const blndAsset = new Asset(BLND.code, BLND.issuer);
      const hasBlnd = account.balances.some(balance => 
        balance.asset_type === 'credit_alphanum4' && 
        balance.asset_code === BLND.code && 
        balance.asset_issuer === BLND.issuer &&
        parseFloat(balance.balance) >= unlockFee
      );
      
      if (!hasBlnd) {
        setErrorId(post.id);
        setErrorMsg(`You need at least ${unlockFee} BLND to unlock this post (${post.amount} XLM × 0.3 + 20% security fee)`);
        setLoadingId(null);
        return;
      }
      
      // BLND token'ını platform hesabına gönder
      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(Operation.payment({
          destination: PLATFORM_ADDRESS,
          asset: blndAsset,
          amount: unlockFee.toString(),
        }))
        .setTimeout(30)
        .build();
      
      const signed = await kit.signTransaction(tx.toXDR(), { networkPassphrase: Networks.TESTNET });
      if (typeof signed === 'string') {
        try {
          await server.submitTransaction(TransactionBuilder.fromXDR(signed, Networks.TESTNET));
          onUnlock(post.id);
          setShowConfetti(true);
        } catch (err) {
          setErrorId(post.id);
          setErrorMsg('Transaction failed');
        }
      } else {
        try {
          await server.submitTransaction(TransactionBuilder.fromXDR(signed.signedTxXdr, Networks.TESTNET));
          onUnlock(post.id);
          setShowConfetti(true);
        } catch (err) {
          setErrorId(post.id);
          setErrorMsg('Transaction failed');
        }
      }
    } catch (e: any) {
      setErrorId(post.id);
      setErrorMsg('Unlock failed: ' + (e?.message || 'Unknown error'));
    } finally {
      setLoadingId(null);
    }
  };
  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <Feed>
        {showPosts.map(post => {
          const likeCount = likes[post.id] ?? (typeof post.likes === 'number' ? post.likes : 0);
          return (
            <PostCard key={post.id} $locked={!!post.locked}>
              {post.locked && <LockedParticles />}
              <UserRow>
                <Avatar src={post.user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt="avatar" />
                <div>
                  <Username>{post.user?.name || "Atlas Doruk Aykar"}</Username>
                  <Time>{post.user?.time || "now"}</Time>
                </div>
              </UserRow>
              <PostMeta>
                <div style={{fontWeight:'bold'}}>
                  Locked: {post.amount} XLM
                </div>
              </PostMeta>
              <div>{post.content === 'Launching my new NFT collection on Stellar! 🚀' ? 'Check my XLM/USDT analysis! 🚀' : post.content}</div>
              {((post.content === 'Launching my new NFT collection on Stellar! 🚀') || (post.content === 'Check my XLM/USDT analysis! 🚀')) ? (
                <Img src={require('@/assets/posts/demopost.png').default?.src || require('@/assets/posts/demopost.png').src || require('@/assets/posts/demopost.png')} alt="post image" />
              ) : post.imageUrl && <Img src={post.imageUrl} alt="post image" />}
              <LikeRow>
                <LikeButton onClick={() => {
                  if (!liked[post.id]) {
                    setLikes(l => ({...l, [post.id]: likeCount+1}));
                    setLiked(l => ({...l, [post.id]: true}));
                  }
                }} aria-label="Like post">
                  <span role="img" aria-label="like">❤️</span>
                  <span style={{fontWeight:600,fontSize:'1.01rem',color:'#fff'}}>{likeCount}</span>
                </LikeButton>
              </LikeRow>
              {post.locked && (
                <>
                  <UnlockButton $locked={!!post.locked} onClick={() => handleUnlockClick(post)} disabled={loadingId === post.id}>
                    {loadingId === post.id ? 'Unlocking...' : `Unlock for ${calculateUnlockFee(post.amount)} BLND`}
                  </UnlockButton>
                  {errorId === post.id && errorMsg && (
                    <div style={{color:'#ff5252',marginTop:8}}>{errorMsg}</div>
                  )}
                </>
              )}
            </PostCard>
          );
        })}
      </Feed>
    </>
  );
}; 