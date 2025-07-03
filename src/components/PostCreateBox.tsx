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
import { BLEND_POOL_ADDRESS, BLEND_POOL_CONTRACT_ID } from '@/constants/assets';
import * as soroban from 'soroban-client';
import Modal from './SupplyModal';

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
  const [showSupplyModal, setShowSupplyModal] = useState(false);

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

  const handleLockClick = () => {
    window.open('https://testnet.blend.capital/', '_blank');
    setShowSupplyModal(true);
  };

  const handleCheckSupply = async (txHash: string) => {
    setError(null);
    setLoading(true);
    try {
      const result = await kit.getAddress();
      const pubkey = result.address;
      const supplied = await verifySupplyTx(txHash, pubkey, amount, BLEND_POOL_ADDRESS);
      if (supplied) {
        onCreate({ content, imageUrl, token: 'XLM', amount });
        setContent("");
        setImageUrl("");
        setAmount(0);
        setShowSupplyModal(false);
      } else {
        setError('Supply işlemi doğrulanamadı. Lütfen transaction hash, miktar ve cüzdanı kontrol edin.');
      }
    } catch (e: any) {
      setError('Supply kontrolü başarısız: ' + (e?.message || 'Unknown error'));
    }
    setLoading(false);
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
        <LockButton onClick={handleLockClick} disabled={loading || !content || amount <= 0}>
          {loading ? 'Kontrol ediliyor...' : `Lock with XLM`}
        </LockButton>
      </Actions>
      {showSupplyModal && (
        <Modal onClose={() => setShowSupplyModal(false)} onContinue={handleCheckSupply} loading={loading} />
      )}
      {error && <div style={{color:'#ff5252',marginTop:8}}>{error}</div>}
    </Box>
  );
};

async function verifySupplyTx(txHash: string, userAddress: string, minAmount: number, poolAddress: string) {
  const server = new Server('https://horizon-testnet.stellar.org');
  try {
    const tx = await server.transactions().transaction(txHash).call();
    if (tx.successful !== true) return false;
    if (tx.source_account !== userAddress) return false;

    const ops = await tx.operations();
    return ops.records.some(op => {
      // Payment ise
      if (op.type === 'payment' && op.from === userAddress && op.to === poolAddress && Number(op.amount) >= minAmount) {
        return true;
      }
      // Contract call ise
      if (op.type === 'invoke_host_function') {
        const contractId = op.contract || op.contract_id;
        const functionName = op.function || op.function_name;
        const params = op.parameters || op.params || [];
        if (
          contractId === poolAddress &&
          functionName === 'submit' &&
          params.length > 0 &&
          Number(params[0].amount) >= minAmount * 1e7 &&
          Number(params[0].request_type) === 2
        ) {
          return true;
        }
      }
      return false;
    });
  } catch (e) {
    return false;
  }
} 