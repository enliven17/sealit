"use client";
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { 
  Server, 
  Asset, 
  TransactionBuilder, 
  Networks, 
  Operation, 
  BASE_FEE,
  Transaction,
  xdr
} from 'stellar-sdk';
import { StellarWalletsKit, WalletNetwork, allowAllModules } from '@creit.tech/stellar-wallets-kit';
import { BLEND_POOL_ADDRESS } from '@/constants/assets';
import * as soroban from 'soroban-client';

const Box = styled.div`
  background: #181c24;
  border-radius: 16px;
  padding: 24px 20px 20px 20px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
const Textarea = styled.textarea`
  flex: 1;
  background: #23272f;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1.08rem;
  min-height: 56px;
  resize: none;
  outline: none;
`;
const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;
const Attach = styled.label`
  background: #23272f;
  color: #36B04A;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s, color 0.2s;
  &:hover { background: #222; color: #258034; }
`;
const HiddenInput = styled.input`
  display: none;
`;
const PostBtn = styled.button`
  background: #36B04A;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  &:hover { background: #258034; }
`;
const ImgPreview = styled.img`
  max-width: 180px;
  max-height: 120px;
  border-radius: 10px;
  margin-top: 8px;
  border: 1px solid #23272f;
`;
const Select = styled.select`
  background: #23272f;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 1rem;
  margin-right: 10px;
`;
const Amount = styled.input`
  background: #23272f;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  height: 38px;
  font-size: 1rem;
  font-family: 'JetBrains Mono', monospace;
  width: 80px;
  text-align: right;
`;
const AttachButton = styled.button`
  background: #23272f;
  color: #36B04A;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  height: 38px;
  font-size: 1rem;
  font-family: 'JetBrains Mono', monospace;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover { background: #222; color: #258034; }
`;
const AttachIcon = styled.span`
  margin-right: 6px;
`;
const LockButton = styled.button`
  background: #36B04A;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  &:hover { background: #258034; }
`;
const AmountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const XlmLabel = styled.span`
  background: #23272f;
  color: #36B04A;
  border-radius: 8px;
  padding: 0 16px;
  height: 38px;
  font-size: 1rem;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  align-items: center;
`;

type Props = {
  onCreate: (post: { content: string; imageUrl?: string; token: string; amount: number }) => void;
};

const TYPEWRITER_TEXT = "What's happening?";
const TYPEWRITER_SPEED = 70;
const TYPEWRITER_PAUSE = 1200;
const XLM_RESERVE_CONTRACT = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

export const PostCreateBox: React.FC<Props> = ({ onCreate }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState(10);
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState('');
  const typeIndex = useRef(0);

  const kit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    modules: allowAllModules(),
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const type = () => {
      if (typeIndex.current < TYPEWRITER_TEXT.length) {
        setPlaceholder(TYPEWRITER_TEXT.slice(0, typeIndex.current + 1));
        typeIndex.current += 1;
        timeout = setTimeout(type, TYPEWRITER_SPEED);
      } else {
        setTimeout(() => {
          setPlaceholder('');
          typeIndex.current = 0;
          timeout = setTimeout(type, TYPEWRITER_SPEED);
        }, TYPEWRITER_PAUSE);
      }
    };
    type();
    return () => clearTimeout(timeout);
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setImageUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAttachClick = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handlePost = async () => {
    setError(null);
    if ((content.trim() || imageUrl) && amount > 0) {
      setLoading(true);
      try {
        // Soroban contract call ile Blend Pool'a XLM supply
        const server = new soroban.Server('https://soroban-testnet.stellar.org');
        const result = await kit.getAddress();
        const pubkey = result.address;
        const account = await server.getAccount(pubkey);
        const stroopAmount = BigInt(Math.floor(amount * 1e7));
        
        // Transaction oluştur
        let tx = new soroban.TransactionBuilder(account, {
          fee: '10000',
          networkPassphrase: soroban.Networks.TESTNET,
        })
          .addOperation(soroban.Operation.invokeContractFunction({
            contract: BLEND_POOL_ADDRESS,
            function: 'deposit',
            args: [
              'native' as any,
              stroopAmount.toString() as any
            ],
          }))
          .setTimeout(30)
          .build();
        
        // Kullanıcı cüzdanı ile sign et
        const signed = await kit.signTransaction(tx.toXDR(), {
          address: pubkey,
          networkPassphrase: soroban.Networks.TESTNET,
        });
        const signedXDR = typeof signed === 'string' ? signed : signed.signedTxXdr;
        const signedTx = soroban.TransactionBuilder.fromXDR(signedXDR, soroban.Networks.TESTNET);
        
        // Submit et
        const response = await server.sendTransaction(signedTx);
        console.log('Soroban sendTransaction response:', response);
        
        if (response.status === 'success') {
          onCreate({ content, imageUrl, token: 'XLM', amount });
          setContent("");
          setImageUrl("");
          setAmount(0);
          setLoading(false);
        } else {
          setError('Token supply failed: ' + (response.errorResult || response.status));
          setLoading(false);
        }
      } catch (e: any) {
        setError('Token supply failed: ' + (e?.message || 'Unknown error'));
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Row>
        <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" />
        <Textarea
          placeholder={placeholder}
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={280}
        />
      </Row>
      {imageUrl && <ImgPreview src={imageUrl} alt="preview" />}
      <Actions>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <AmountRow>
            <Amount
              type="number"
              min={1}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              placeholder="Amount (XLM)"
              style={{width:80}}
            />
            <XlmLabel>XLM</XlmLabel>
          </AmountRow>
          <AttachButton onClick={handleAttachClick}>
            <span role="img" aria-label="attach" style={{marginRight: 6}}>📎</span>Attach
          </AttachButton>
        </div>
        <LockButton onClick={handlePost} disabled={loading || !content || amount <= 0}>
          {loading ? 'Locking...' : `Lock with XLM`}
        </LockButton>
      </Actions>
      {error && <div style={{color:'#ff5252',marginTop:8}}>{error}</div>}
    </Box>
  );
}; 