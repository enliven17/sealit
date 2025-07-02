"use client";
import React from "react";
import styled from "styled-components";

const Box = styled.div`
  background: #181c24;
  border-radius: 16px;
  padding: 24px 20px;
  margin-bottom: 48px;
`;
const Title = styled.h3`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 18px;
`;
const Trend = styled.div`
  color: #b3b8c5;
  font-size: 1.05rem;
  margin-bottom: 12px;
  cursor: pointer;
  &:hover { color: #36B04A; }
`;

export const SidebarTrends: React.FC = () => (
  <Box>
    <Title>Trending</Title>
    <Trend>#SocialFi</Trend>
    <Trend>#Blend</Trend>
    <Trend>#Stellar</Trend>
    <Trend>#AQUA</Trend>
    <Trend>#yUSDC</Trend>
    <Trend>#Web3</Trend>
    <Trend>#TokenGated</Trend>
  </Box>
); 