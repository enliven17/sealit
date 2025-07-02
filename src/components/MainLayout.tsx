"use client";
import React from "react";
import styled from "styled-components";

const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: #111216;
  color: #fff;
`;
const Sidebar = styled.aside`
  width: 320px;
  min-width: 260px;
  max-width: 340px;
  padding: 32px 20px 0 0;
  @media (max-width: 1100px) { display: none; }
`;
const Main = styled.main`
  flex: 1;
  max-width: 800px;
  min-width: 0;
  padding: 32px 0 0 0;
`;
const Rightbar = styled.aside`
  width: 320px;
  min-width: 260px;
  max-width: 340px;
  padding: 32px 0 0 20px;
  @media (max-width: 1100px) { display: none; }
`;

type Props = {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
};

export const MainLayout: React.FC<Props> = ({ left, center, right }) => (
  <Layout>
    <Sidebar>{left}</Sidebar>
    <Main>{center}</Main>
    <Rightbar>{right}</Rightbar>
  </Layout>
); 