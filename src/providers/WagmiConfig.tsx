import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createCustomChain, L2_CHAINS } from "@/constants/chains";

export const createWagmiConfig = (chainId?: string) => {
  const selectedChain =
    L2_CHAINS.find((chain) => chain.chainId === chainId) || L2_CHAINS[0];
  const chain = createCustomChain(
    selectedChain.chainId.toString(),
    selectedChain.rpcUrl,
    selectedChain.name,
    selectedChain.explorerUrl
  );

  return getDefaultConfig({
    appName: "Rome Deposit UI",
    projectId: "e4ae0d87596c5f950b36d0c1ac7adb8c",
    chains: [chain],
    ssr: true,
    syncConnectedChain: true,
  });
};
