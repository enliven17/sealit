"use client";
import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@/theme/theme";
import { GlobalStyle } from "@/theme/globalStyles";
import { Provider } from "react-redux";
import { store } from "@/store/index";

const ClientProviders = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  </Provider>
);

export default ClientProviders; 