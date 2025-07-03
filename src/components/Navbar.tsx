"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { WalletConnectButton } from "@/components/WalletConnectButton";

const Bar = styled.nav`
  width: 100%;
  height: 64px;
  background: #181c24;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 36px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  position: sticky;
  top: 0;
  z-index: 100;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;
const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #36B04A;
`;
const Project = styled.span`
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  letter-spacing: 1px;
`;
const Center = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Search = styled.input`
  width: 100%;
  max-width: 480px;
  padding: 12px 24px 12px 44px;
  border-radius: 24px;
  border: none;
  background: #262a32;
  color: #fff;
  font-size: 1.08rem;
  outline: none;
  transition: box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(30,136,229,0.04);
  &::placeholder { color: #b3b8c5; }
  position: relative;
`;
const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
`;
const SearchIconStyled = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
  
  & > button {
    background: #36B04A;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: #258034;
    }
  }
`;
const IconBar = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  margin-right: 18px;
`;
const IconBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.15s, color 0.15s;
  color: #b3b8c5;
  font-size: 1.7rem;
  &:hover {
    transform: scale(1.18);
    color: #36B04A;
  }
`;

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b3b8c5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

export const Navbar: React.FC = () => {
  const [typeText, setTypeText] = useState('');
  const TYPEWRITER_TEXT = 'Build on Stellar';
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let i = 0;
    const type = () => {
      if (i < TYPEWRITER_TEXT.length) {
        setTypeText(TYPEWRITER_TEXT.slice(0, i + 1));
        i++;
        timeout = setTimeout(type, 90);
      } else {
        setTimeout(() => {
          setTypeText('');
          i = 0;
          timeout = setTimeout(type, 90);
        }, 1200);
      }
    };
    type();
    return () => clearTimeout(timeout);
  }, []);
  return (
    <Bar>
      <Left>
        <Logo>🦭</Logo>
        <Project>sealit</Project>
      </Left>
      <Center>
        <SearchWrapper>
          <SearchIconStyled>
            <SearchIcon />
          </SearchIconStyled>
          <Search placeholder="Build on Stellar" />
        </SearchWrapper>
      </Center>
      <Right>
        <IconBar>
          <IconBtn aria-label="Bookmarks">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </IconBtn>
          <IconBtn aria-label="Notifications">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </IconBtn>
          <IconBtn aria-label="Messages">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </IconBtn>
        </IconBar>
        <WalletConnectButton />
      </Right>
    </Bar>
  );
} 