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
      className="shadow-btn bg-white rounded-full px-7 py-4 cursor-pointer hover:font-semibold w-56 text-black text-center"
      onClick={handleConnect}
    >
      {publicKey ? "Connected" : "Connect Wallet (SOL)"}
    </button>
  );
};
