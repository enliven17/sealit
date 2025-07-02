"use client";
import React, { useRef, useState } from "react";
import styled from "styled-components";

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
  padding: 8px 14px;
  font-size: 1rem;
  width: 80px;
  margin-right: 10px;
`;

type Props = {
  onCreate: (post: { content: string; imageUrl?: string; token: string; amount: number }) => void;
};

export const PostCreateBox: React.FC<Props> = ({ onCreate }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [token, setToken] = useState("AQUA");
  const [amount, setAmount] = useState(10);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setImageUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if ((content.trim() || imageUrl) && amount > 0) {
      onCreate({ content, imageUrl, token, amount });
      setContent("");
      setImageUrl(undefined);
      setAmount(10);
      setToken("AQUA");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Box>
      <Row>
        <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" />
        <Textarea
          placeholder="What's happening?"
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={280}
        />
      </Row>
      {imageUrl && <ImgPreview src={imageUrl} alt="preview" />}
      <Actions>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Select value={token} onChange={e => setToken(e.target.value)}>
            <option value="AQUA">AQUA</option>
            <option value="yUSDC">yUSDC</option>
          </Select>
          <Amount
            type="number"
            min={1}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            placeholder="Amount"
          />
          <Attach>
            <span>📎 Attach</span>
            <HiddenInput
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleImage}
            />
          </Attach>
        </div>
        <PostBtn onClick={handlePost} disabled={(!content.trim() && !imageUrl) || amount < 1}>
          Lock with Token
        </PostBtn>
      </Actions>
    </Box>
  );
}; 