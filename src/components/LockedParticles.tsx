"use client";
import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
`;

const LockWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
`;
const LockIcon = styled.div`
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(30,136,229,0.13);
  box-shadow: 0 0 24px 8px rgba(30,136,229,0.18);
  animation: ${spin} 2.5s linear infinite;
`;

export const LockedParticles: React.FC = () => (
  <LockWrapper>
    <LockIcon>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="11" width="16" height="9" rx="2"/>
        <path d="M8 11V7a4 4 0 1 1 8 0v4"/>
      </svg>
    </LockIcon>
  </LockWrapper>
); 