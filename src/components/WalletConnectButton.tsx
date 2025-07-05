"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { connect, disconnect } from '@/store/walletSlice';
import { RootState } from '@/store/index';
import { StellarWalletsKit, WalletNetwork, allowAllModules } from '@creit.tech/stellar-wallets-kit';

const Button = styled.button`
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
`;

const WalletInfo = styled.div`
  margin-top: 12px;
  color: #fff;
  background: #222;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Disconnect = styled.button`
  background: none;
  color: #36B04A;
  border: none;
  font-size: 1.1rem;
  margin-left: 8px;
  cursor: pointer;
  &:hover { color: #258034; }
`;

const ModalBg = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #181c24;
  border-radius: 16px;
  padding: 32px 28px;
  min-width: 320px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const WalletOpt = styled.button`
  background: #23272f;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 16px 0;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 4px;
  transition: background 0.18s, color 0.18s;
  &:hover { background: #36B04A; color: #fff; }
`;

const WalletLabel = styled.span`
  font-size: 0.98rem;
  color: #b3b8c5;
  margin-left: 8px;
`;

const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  modules: allowAllModules(),
});

export const WalletConnectButton: React.FC = () => {
  const dispatch = useDispatch();
  const { address, isConnected } = useSelector((state: RootState) => state.wallet);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await kit.openModal({
        onWalletSelected: async (option) => {
          kit.setWallet(option.id);
          const { address } = await kit.getAddress();
          if (address) {
            dispatch(connect(address));
            setWalletName(option.name || option.id);
          } else {
            alert('Failed to retrieve wallet address.');
          }
        },
        onClosed: () => setLoading(false),
      });
    } catch (e) {
      alert('Wallet connection failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    dispatch(disconnect());
    setWalletName(null);
  };

  return (
    <div>
      {!isConnected ? (
        <Button onClick={handleConnect} disabled={loading}>
          Connect Wallet
        </Button>
      ) : (
        <WalletInfo>
          Connected: <strong>{walletName}</strong>
          <WalletLabel title={address || undefined}>{address ? `${address.slice(0,6)}...${address.slice(-4)}` : ''}</WalletLabel>
          <Disconnect onClick={handleDisconnect} title="Disconnect">⎋</Disconnect>
        </WalletInfo>
      )}
    </div>
  );
}; 