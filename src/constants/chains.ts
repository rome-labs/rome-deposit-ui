import { Chain } from "@rainbow-me/rainbowkit";
import { L2_CHAIN_ID, L2_CHAIN_NAME, L2_EXPLORER_URL, L2_RPC_URL } from ".";

export type RomeChain = {
  name: string;
  chainId: string;
  rpcUrl: string;
  explorerUrl?: string;
};

export const L2_CHAINS: RomeChain[] = [
  {
    name: L2_CHAIN_NAME,
    chainId: L2_CHAIN_ID,
    rpcUrl: L2_RPC_URL,
    explorerUrl: L2_EXPLORER_URL,
  },
];

export const createCustomChain = (
  chainId: string,
  rpcUrl: string,
  name?: string,
  explorerUrl?: string
): Chain => {
  const chainName = name || `Rome L2_${chainId}`;

  return {
    id: Number(chainId),
    name: chainName,
    nativeCurrency: {
      decimals: 18,
      name: "Rome",
      symbol: "rSOL",
    },
    rpcUrls: {
      default: { http: [rpcUrl] },
      public: { http: [rpcUrl] },
    },
    blockExplorers: {
      default: { name: `${chainName} Explorer`, url: explorerUrl || "" },
    },
  } as const;
};
