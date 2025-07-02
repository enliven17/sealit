import React, { useState } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background: #1e88e5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1565c0;
  }
`;

const WalletInfo = styled.div`
  margin-top: 12px;
  color: #fff;
  background: #222;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.95rem;
`;

export const WalletConnectButton: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  // LOBSTR Wallet bağlantısı simülasyonu
  const connectLobstr = async () => {
    // Gerçek entegrasyonda burada LOBSTR WalletConnect SDK çağrısı olacak
    // Şimdilik demo için sahte bir public key gösteriyoruz
    setTimeout(() => {
      setPublicKey('GABCD...LOBSTRDEMO');
      setConnected(true);
    }, 800);
  };

  return (
    <div>
      {!connected ? (
        <Button onClick={connectLobstr}>LOBSTR Cüzdan ile Bağlan</Button>
      ) : (
        <WalletInfo>
          Bağlandı!<br />
          <strong>Public Key:</strong> {publicKey}
        </WalletInfo>
      )}
    </div>
  );
}; 