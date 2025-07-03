import { create } from "zustand";
import { L2_CHAINS } from "@/constants/chains";
import { Config } from "wagmi";
import { createWagmiConfig } from "@/providers/WagmiConfig";
import { clearRainbowKitCache } from "@/utils/wallet";

interface ChainState {
  selectedChainId: string;
  setSelectedChainId: (chainId: string) => void;

  chainId: string;
  setChain: (chainId: string) => void;
  resetChain: () => void;

  wagmiConfig: Config;
  setWagmiConfig: (wagmiConfig: Config) => void;
}

export const useChainStore = create<ChainState>((set) => ({
  selectedChainId: L2_CHAINS[0].chainId,
  chainId: L2_CHAINS[0].chainId,

  setSelectedChainId: (chainId) => set({ selectedChainId: chainId }),
  setChain: (chainId) => {
    set({ chainId });
    // Clear cache when changing chains
    clearRainbowKitCache();
  },
  resetChain: () => {
    set({
      chainId: L2_CHAINS[0].chainId,
    });
    // Clear cache when resetting chain
    clearRainbowKitCache();
  },

  wagmiConfig: createWagmiConfig(L2_CHAINS[0].chainId),
  setWagmiConfig: (wagmiConfig) => set({ wagmiConfig }),
}));
