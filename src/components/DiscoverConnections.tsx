"use client";
import React from "react";
import styled from "styled-components";

const Box = styled.div`
  background: #181c24;
  border-radius: 16px;
  padding: 24px 20px;
  margin-top: 32px;
`;
const Title = styled.h3`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 18px;
`;
const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;
const Name = styled.span`
  color: #b3b8c5;
  font-size: 1.05rem;
`;
const Follow = styled.button`
  background: #36B04A;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 0.95rem;
  cursor: pointer;
  &:hover { background: #258034; }
`;

export const DiscoverConnections: React.FC = () => (
  <Box>
    <Title>Discover New Connections</Title>
    <User><Name>Elon Musk</Name><Follow>Follow</Follow></User>
    <User><Name>Candace Kelly</Name><Follow>Follow</Follow></User>
    <User><Name>David Mazières</Name><Follow>Follow</Follow></User>
    <User><Name>BuildOnStellar</Name><Follow>Follow</Follow></User>
    <User><Name>odtublockchain</Name><Follow>Follow</Follow></User>
  </Box>
); 