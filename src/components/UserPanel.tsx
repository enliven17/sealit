"use client";
import React from "react";
import styled from "styled-components";

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

export const UserPanel: React.FC = () => (
  <Box>
    <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" />
    <Info>
      <Name>Benjamin Thompson</Name>
      <Desc>Web3 builder. SocialFi & DeFi enthusiast.</Desc>
    </Info>
  </Box>
); 