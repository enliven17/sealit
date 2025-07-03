"use client";
import React from "react";
import styled from "styled-components";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import avatarImg from '@/assets/profile/profile.jpeg';

const Box = styled.div`
  background: #181c24;
  border-radius: 16px;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`;
const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #333;
`;
const Info = styled.div``;
const Name = styled.div`
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
`;
const Desc = styled.div`
  color: #b3b8c5;
  font-size: 0.98rem;
`;

export const UserPanel: React.FC = () => {
  const address = useSelector((state: RootState) => state.wallet.address);
  const isWalletConnected = useSelector((state: RootState) => state.wallet.isConnected);
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;
  return (
    <div style={{position:'relative'}}>
      <Box style={!isWalletConnected ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}}>
        <Avatar src={typeof avatarImg === 'string' ? avatarImg : avatarImg.src} alt="avatar" />
        <Info>
          <Name>enliven</Name>
          <Desc>Web3 builder. SocialFi & DeFi enthusiast.</Desc>
          {address && (
            <div style={{
              background: '#23272f',
              color: '#36B04A',
              borderRadius: 8,
              padding: '4px 8px',
              margin: '12px 0 0 0',
              wordBreak: 'break-all',
              fontSize: '0.89rem',
              fontFamily: 'JetBrains Mono, monospace',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              minWidth: 0,
              maxWidth: 180,
            }}>
              <span title={address} style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#36B04A',fontWeight:600}}>{shortAddress}</span>
              <button style={{background:'none',border:'none',color:'#36B04A',cursor:'pointer',fontSize:'1.1em',padding:0,marginLeft:2}} onClick={()=>navigator.clipboard.writeText(address)} title="Copy address">⧉</button>
            </div>
          )}
        </Info>
      </Box>
      {!isWalletConnected && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          background: 'linear-gradient(120deg, rgba(54,176,74,0.18) 0%, rgba(24,28,36,0.7) 60%, rgba(54,176,74,0.18) 100%)',
          pointerEvents: 'auto',
          animation: 'gradientMove 3s ease-in-out infinite',
          backgroundSize: '200% 200%',
          borderRadius: 16,
        }}>
          <style>{`
            @keyframes gradientMove {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
          <span style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            textShadow: '0 2px 8px #000',
            letterSpacing: 0.5,
            background: 'linear-gradient(90deg, #36B04A, #b3ffb3, #36B04A)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientMove 2.5s linear infinite',
            backgroundSize: '200% 200%',
          }}>
            Connect Wallet
          </span>
        </div>
      )}
    </div>
  );
}; 