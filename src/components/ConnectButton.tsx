import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export const ConnectButton = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      openConnectModal?.();
    }
  };

  return (
    <button
      type="button"
      className="shadow-btn bg-white rounded-full px-7 py-4 cursor-pointer hover:font-semibold w-56 text-black text-center"
      onClick={handleConnect}
    >
      {isConnected ? "Connected" : "Connect L2 Wallet"}
    </button>
  );
};
