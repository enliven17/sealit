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

const trends = [
  { name: '#SocialFi', xlm: 1200 },
  { name: '#Blend', xlm: 950 },
  { name: '#Stellar', xlm: 800 },
  { name: '#AQUA', xlm: 620 },
  { name: '#yUSDC', xlm: 410 },
  { name: '#Web3', xlm: 320 },
  { name: '#TokenGated', xlm: 210 },
];

export const SidebarTrends: React.FC = () => (
  <Box>
    <Title>Trending</Title>
    {trends.map(trend => (
      <div key={trend.name} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <Trend>{trend.name}</Trend>
        <span style={{color:'#b3b8c5',fontSize:'0.98rem',fontWeight:500,minWidth:56,textAlign:'right'}}>{trend.xlm} XLM</span>
      </div>
    ))}
  </Box>
); 