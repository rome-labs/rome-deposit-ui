import type { FC } from "react";
import React, { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { SOLANA_RPC_URL } from "@/constants";
import { useChainStore } from "@/store/chainStore";

// Use require instead of import since order matters
import "react-toastify/dist/ReactToastify.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import "../globals.css";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const { wagmiConfig } = useChainStore();

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={SOLANA_RPC_URL}>
        <WagmiProvider config={wagmiConfig}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <RainbowKitProvider>
                <div>
                  <ToastContainer />
                  <Component {...pageProps} />
                </div>
              </RainbowKitProvider>
            </WalletModalProvider>
          </WalletProvider>
        </WagmiProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

export default App;
