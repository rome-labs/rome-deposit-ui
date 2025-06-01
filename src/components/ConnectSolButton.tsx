import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export const ConnectSolButton = () => {
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    if (publicKey) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  return (
    <button
      type="button"
      className="shadow-btn bg-white rounded-2xl px-3 py-1.5 flex items-center cursor-pointer gap-2 text-sm text-primary hover:scale-105 justify-center"
      onClick={handleConnect}
    >
      {publicKey ? "Disconnect" : "Connect Wallet"}
    </button>
  );
};
