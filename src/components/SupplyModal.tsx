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
  position: relative;
`;
const Button = styled.button`
  background: #36B04A;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  margin-top: 16px;
  &:hover { background: #258034; }
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
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 16px;
  border-radius: 6px;
  border: 1px solid #333;
  background: #222;
  color: #fff;
`;

type Props = {
  onClose: () => void;
  onContinue: (txHash: string) => void;
  loading?: boolean;
};

const SupplyModal: React.FC<Props> = ({ onClose, onContinue, loading }) => {
  const [txHash, setTxHash] = useState('');
  return (
    <Overlay>
      <Modal>
        <Close onClick={onClose}>&times;</Close>
        <h2 style={{color:'#fff',marginBottom:12}}>Supply Transaction Verification</h2>
        <div style={{color:'#b3b8c5',marginBottom:18,fontSize:'1.05rem'}}>
          Please complete your XLM supply on Blend. Then paste your transaction hash below to verify and continue.
        </div>
        <Input
          type="text"
          placeholder="Enter transaction hash..."
          value={txHash}
          onChange={e => setTxHash(e.target.value)}
        />
        <Button onClick={() => onContinue(txHash)} disabled={loading || !txHash}>
          {loading ? 'Checking...' : 'Continue'}
        </Button>
      </Modal>
    </Overlay>
  );
};

export default SupplyModal; 