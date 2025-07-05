"use client";
import { PostCreateBox } from "@/components/PostCreateBox";
import { PostFeed } from "@/components/PostFeed";
import { MainLayout } from "@/components/MainLayout";
import { SidebarTrends } from "@/components/SidebarTrends";
import { DiscoverConnections } from "@/components/DiscoverConnections";
import { UserPanel } from "@/components/UserPanel";
import { Navbar } from "@/components/Navbar";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, unlockPost, Post } from "@/store/postsSlice";
import { RootState } from "@/store/index";

export default function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);

  const handleCreate = (post: Omit<Post, "id" | "locked">) => {
    dispatch(addPost({
      ...post,
      id: Date.now(),
      locked: true,
      user: post.user
    }));
  };
  const handleUnlock = (id: number) => {
    dispatch(unlockPost(id));
  };

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
