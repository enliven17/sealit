"use client";
import React from "react";
import styled from "styled-components";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';

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
  return (
    <Box>
      <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" />
      <Info>
        <Name>Benjamin Thompson</Name>
        <Desc>Web3 builder. SocialFi & DeFi enthusiast.</Desc>
        {address && (
          <div style={{
            background: '#23272f',
            color: '#36B04A',
            borderRadius: 8,
            padding: '8px 12px',
            margin: '16px 0',
            wordBreak: 'break-all',
            fontSize: '0.97rem',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}>
            <span style={{color:'#b3b8c5', fontSize:'0.93rem'}}>Wallet:</span><br/>{address}
          </div>
        )}
      </Info>
    </Box>
  );
}; 