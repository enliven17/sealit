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
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import avatarImg from '@/assets/profile/profile.jpeg';

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
  onCreate: (post: { content: string; imageUrl?: string; token: string; amount: number; user: { name: string; avatar: string; time: string } }) => void;
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
  const isWalletConnected = useSelector((state: RootState) => state.wallet.isConnected);
  const [avatarUrl, setAvatarUrl] = useState<string>(typeof avatarImg === 'string' ? avatarImg : avatarImg.src);
  const { username, avatar } = useSelector((state: RootState) => state.wallet);

  const kit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    modules: allowAllModules(),
  });

  // Kullanılmış hash'leri localStorage'da tut
  const USED_HASHES_KEY = 'usedTxHashes';
  const getUsedHashes = () => {
    try {
      return JSON.parse(localStorage.getItem(USED_HASHES_KEY) || '[]');
    } catch {
      return [];
    }
  };
  const addUsedHash = (hash: string) => {
    const hashes = getUsedHashes();
    hashes.push(hash);
    localStorage.setItem(USED_HASHES_KEY, JSON.stringify(hashes));
  };
  const isHashUsed = (hash: string) => {
    const hashes = getUsedHashes();
    return hashes.includes(hash);
  };

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
    if (isHashUsed(txHash)) {
      setError('This transaction hash has already been used. Please use a new supply transaction.');
      setLoading(false);
      return;
    }
    try {
      const result = await kit.getAddress();
      const pubkey = result.address;
      const supplied = await verifySupplyTx(txHash, pubkey, amount, BLEND_POOL_ADDRESS);
      if (supplied) {
        addUsedHash(txHash);
        const newPost = {
          content,
          imageUrl,
          token: 'XLM',
          amount,
          user: {
            name: 'enliven',
            avatar: typeof avatarImg === 'string' ? avatarImg : avatarImg.src,
            time: 'now',
          },
        };
        console.log('Yeni post:', newPost);
        onCreate(newPost);
        setContent("");
        setImageUrl("");
        setAmount(0);
        setShowSupplyModal(false);
      } else {
        setError('Supply transaction could not be verified. Please check the transaction hash, amount, and wallet address.');
      }
    } catch (e: any) {
      setError('Supply kontrolü başarısız: ' + (e?.message || 'Unknown error'));
    }
    setLoading(false);
  };

  return (
    <div style={{position: 'relative'}}>
      <Box style={!isWalletConnected ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}}>
        <Row>
          <Avatar src={avatarUrl} alt="avatar" />
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
            <AttachButton onClick={handleAttachClick} type="button">
              <span role="img" aria-label="attach" style={{marginRight: 6}}>📎</span>Attach
            </AttachButton>
          </div>
          <HiddenInput
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImage}
          />
          <LockButton onClick={handleLockClick} disabled={loading || !content || amount <= 0}>
            {loading ? 'Checking...' : `Lock with XLM`}
          </LockButton>
        </Actions>
        {showSupplyModal && (
          <Modal onClose={() => setShowSupplyModal(false)} onContinue={handleCheckSupply} loading={loading} />
        )}
        {error && <div style={{color:'#ff5252',marginTop:8}}>{error}</div>}
      </Box>
      {!isWalletConnected && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          background: 'linear-gradient(120deg, rgba(54,176,74,0.18) 0%, rgba(24,28,36,0.7) 60%, rgba(54,176,74,0.18) 100%)',
          pointerEvents: 'auto',
          animation: 'gradientMove 3s ease-in-out infinite',
          backgroundSize: '200% 200%',
          borderRadius: 16,
        }}>
          <style>{`
            @keyframes gradientMove {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
          <span style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            textShadow: '0 2px 8px #000',
            letterSpacing: 0.5,
            background: 'linear-gradient(90deg, #36B04A, #b3ffb3, #36B04A)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientMove 2.5s linear infinite',
            backgroundSize: '200% 200%',
          }}>
            Connect Wallet
          </span>
        </div>
      )}
    </div>
  );
};

async function verifySupplyTx(txHash: string, userAddress: string, minAmount: number, poolAddress: string) {
  const server = new Server('https://horizon-testnet.stellar.org');
  try {
    const tx = await server.transactions().transaction(txHash).call();
    const ops = await tx.operations();
    return ops.records.some(op => {
      // Payment ise
      if (
        (op as any).type === 'payment' &&
        ((op as any).from === userAddress || (op as any).source_account === userAddress) &&
        (op as any).to === poolAddress &&
        (op as any).asset_type === 'native' &&
        Number((op as any).amount) === minAmount
      ) {
        return true;
      }
      // Contract call ise asset_balance_changes ile kontrol
      if (
        (op as any).type === 'invoke_host_function' &&
        (op as any).transaction_successful === true &&
        Array.isArray((op as any).asset_balance_changes)
      ) {
        return ((op as any).asset_balance_changes as any[]).some((change: any) =>
          change.asset_type === 'native' &&
          change.from === userAddress &&
          change.to === poolAddress &&
          Number(change.amount) === minAmount
        );
      }
      return false;
    });
  } catch (e) {
    return false;
  }
} 