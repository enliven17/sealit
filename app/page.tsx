"use client";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { PostCreateModal } from "@/components/PostCreateModal";
import { PostFeed } from "@/components/PostFeed";
import { MainLayout } from "@/components/MainLayout";
import { SidebarTrends } from "@/components/SidebarTrends";
import { DiscoverConnections } from "@/components/DiscoverConnections";
import { UserPanel } from "@/components/UserPanel";
import { Navbar } from "@/components/Navbar";
import React, { useState } from "react";
import { PostCreateBox } from "@/components/PostCreateBox";

// Post tipini PostFeed ile uyumlu tanımlıyoruz
interface Post {
  id: number;
  content: string;
  token: string;
  amount: number;
  locked: boolean;
  imageUrl?: string;
  user?: {
    name: string;
    avatar: string;
    time: string;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const handleCreate = (post: { content: string; imageUrl?: string; token: string; amount: number }) => {
    setPosts(prev => [
      {
        id: Date.now(),
        ...post,
        locked: true,
        user: {
          name: "Benjamin Thompson",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          time: "now"
        }
      },
      ...prev
    ]);
  };
  const handleUnlock = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, locked: false } : p));
  };

  // Orta sütun içeriği
  const center = (
    <>
      <PostCreateBox onCreate={handleCreate} />
      <PostFeed posts={posts} onUnlock={handleUnlock} />
    </>
  );

  return (
    <>
      <Navbar />
      <MainLayout
        left={<SidebarTrends />}
        center={center}
        right={<>
          <UserPanel />
          <DiscoverConnections />
        </>}
      />
    </>
  );
}
