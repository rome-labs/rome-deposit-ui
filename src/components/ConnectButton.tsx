import { useMemo } from "react";

import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useDisconnect } from "wagmi";
import { useChainStore } from "@/store/chainStore";
import { clearRainbowKitCache } from "@/utils/wallet";
import { createWagmiConfig } from "@/providers/WagmiConfig";
import { toast } from "react-toastify";
import { WalletIcon } from "@heroicons/react/20/solid";
import { shortenAddress } from "@/utils";

export const ConnectButton = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { disconnect } = useDisconnect();
  const { chainId, setWagmiConfig } = useChainStore();

  const { address } = useAccount();
  const currentChainId = useChainId();

  const isValidChain = useMemo(() => {
    if (!chainId) return true;
    return currentChainId.toString() === chainId;
  }, [currentChainId, chainId]);

  const handleConnect = () => {
    if (!address) {
      if (openConnectModal) {
        openConnectModal();
        return;
      }
    } else {
      if (isValidChain) {
        if (openAccountModal) {
          openAccountModal();
          return;
        }
      } else {
        if (chainId) {
          setWagmiConfig(createWagmiConfig(chainId));

          // Reset Wagmi by disconnecting first
          disconnect();

          // Clear RainbowKit cache from localStorage
          clearRainbowKitCache();

          if (openConnectModal) {
            openConnectModal();
            return;
          }
        } else {
          toast.error("Please select a chain");
        }
      }
    }
  };

  return (
    <button
      className="shadow-btn bg-white rounded-full px-4 py-2 flex items-center cursor-pointer gap-2 text-sm text-black hover:font-semibold justify-center"
      type="button"
      onClick={handleConnect}
    >
      {address ? (
        <div className="flex items-center gap-2">
          <WalletIcon className="size-5" />
          <span className="hidden sm:inline">{shortenAddress(address)}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <WalletIcon className="size-5" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </div>
      )}
    </button>
  );
};
