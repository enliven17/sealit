"use client";

import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fall = keyframes`
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
`;

const ConfettiPiece = styled.div<{ $color: string; $left: number; $delay: number; $duration: number }>`
  position: fixed;
  top: -10px;
  left: ${props => props.$left}%;
  width: 10px;
  height: 10px;
  background: ${props => props.$color};
  border-radius: 2px;
  animation: ${fall} ${props => props.$duration}s linear ${props => props.$delay}s forwards;
  z-index: 9999;
  pointer-events: none;
`;

const colors = ['#36B04A', '#ffb300', '#ff5252', '#2196F3', '#9C27B0', '#FF9800', '#00BCD4'];

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ isActive, onComplete }) => {
  const [pieces, setPieces] = useState<Array<{ id: number; color: string; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
      }));
      
      setPieces(newPieces);
      
      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <>
      {pieces.map(piece => (
        <ConfettiPiece
          key={piece.id}
          $color={piece.color}
          $left={piece.left}
          $delay={piece.delay}
          $duration={piece.duration}
        />
      ))}
    </>
  );
}; 