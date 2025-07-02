"use client";

import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const Modal = styled.div`
  background: #181c24;
  padding: 32px 24px;
  border-radius: 16px;
  min-width: 340px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 16px;
  border-radius: 6px;
  border: 1px solid #333;
  background: #222;
  color: #fff;
`;
const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 16px;
  border-radius: 6px;
  border: 1px solid #333;
  background: #222;
  color: #fff;
`;
const Button = styled.button`
  background: #1e88e5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
  &:hover { background: #1565c0; }
`;
const Close = styled.button`
  position: absolute;
  top: 12px; right: 16px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
`;

type Props = {
  onClose: () => void;
  onCreate: (post: { content: string; token: string; amount: number }) => void;
};

export const PostCreateModal: React.FC<Props> = ({ onClose, onCreate }) => {
  const [content, setContent] = useState('');
  const [token, setToken] = useState('AQUA');
  const [amount, setAmount] = useState(10);

  return (
    <Overlay>
      <Modal>
        <Close onClick={onClose}>×</Close>
        <h2 style={{color:'#fff', marginBottom:16}}>Gönderi Oluştur</h2>
        <Input
          placeholder="Gönderi metni..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <Select value={token} onChange={e => setToken(e.target.value)}>
          <option value="AQUA">AQUA</option>
          <option value="yUSDC">yUSDC</option>
        </Select>
        <Input
          type="number"
          min={5}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
        <Button
          onClick={() => {
            if(content && amount >= 5) {
              onCreate({ content, token, amount });
              onClose();
            }
          }}
        >
          Token ile Kilitle
        </Button>
      </Modal>
    </Overlay>
  );
}; 