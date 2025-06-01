import { SOLANA_RPC_URL } from "@/constants";
import useSolBalance from "@/hooks/useSolBalance";
import { shortenAddress, sleep } from "@/utils";
import { buildDepositIx } from "@/utils/txs";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ComputeBudgetProgram,
  Connection,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";
import { toast } from "react-toastify";
import { parseEther, formatUnits, parseUnits } from "ethers";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useAccount, useBalance } from "wagmi";
import { TokenIcon } from "@/components/TokenIcon";
import { ConnectSolButton } from "@/components/ConnectSolButton";
import { useChainStore } from "@/store/chainStore";
import { Toggler } from "./Toggler";

export const Deposit = () => {
  const { publicKey, signTransaction } = useWallet();
  const { address, isConnected } = useAccount();
  const { chainId } = useChainStore();

  const { data: solBalance, refetch: loadSolBalance } = useSolBalance({
    address: publicKey ? publicKey.toBase58() : null,
  });
  const { data: destBalance } = useBalance({
    address,
    query: {
      refetchInterval: 10000,
    },
  });

  const [amount, setAmount] = useState("");
  const [isProcessing, setProcessing] = useState(false);

  const recipient = useMemo(() => {
    if (isConnected && address) {
      return address;
    }

    return "";
  }, [isConnected, address]);

  const lamports = useMemo(() => {
    const _amount = Number(amount);
    if (!_amount || isNaN(_amount)) {
      return 0;
    }

    return Math.floor(_amount * LAMPORTS_PER_SOL);
  }, [amount]);

  const wei = useMemo(() => {
    const _amount = Number(amount);
    if (!_amount || isNaN(_amount)) {
      return 0;
    }

    return parseUnits(_amount.toString(), "gwei");
  }, [amount]);

  const handleTransfer = () => {
    if (!amount) {
      toast.error("You need to input amount");
      return;
    }

    handleDeposit();
  };

  const handleDeposit = async () => {
    if (!publicKey || !recipient || !signTransaction) {
      toast.error("Connect wallet first");
      return;
    }

    if (solBalance < Number(amount)) {
      toast.error("Your balance is not enough");
      return;
    }

    const depositAmount = parseEther(amount);

    setProcessing(true);

    try {
      const connection = new Connection(SOLANA_RPC_URL, "confirmed");

      const computeIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 200_000,
      });
      const depositIx = buildDepositIx(
        chainId,
        publicKey,
        recipient,
        depositAmount.toString()
      );

      const tx = new Transaction();
      tx.instructions = [computeIx, depositIx];

      tx.feePayer = publicKey;
      tx.recentBlockhash = (
        await connection.getLatestBlockhash("confirmed")
      ).blockhash;

      let signature;
      try {
        const signedTx = await signTransaction(tx);
        signature = await connection.sendRawTransaction(
          Buffer.from(signedTx.serialize()),
          {
            preflightCommitment: "confirmed",
            maxRetries: 10,
          }
        );
      } catch (ex) {
        throw ex;
      }

      // Check confirmations
      let isConfirmed = false;
      for (let i = 0; i < 10; i++) {
        const ret = await connection.getSignatureStatus(signature, {
          searchTransactionHistory: false,
        });

        if (ret.value) {
          if (ret.value.err) {
            throw new Error(ret.value.err.toString());
          }

          isConfirmed = true;
          break;
        }

        await sleep(3000);
      }
      if (!isConfirmed) {
        throw new Error("Transaction submitted, but confirmation failed");
      }

      toast.success(
        <Link
          target="_blank"
          href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
        >
          Deposit successed - signature: {shortenAddress(signature)}
        </Link>
      );

      setAmount("");
      loadSolBalance();
    } catch (ex) {
      console.log(ex);
      if (!(ex as Error).message.includes("User rejected the request")) {
        toast.error(`Deposit failed: Error - ${(ex as Error).message}`);
      }
    }

    setProcessing(false);
  };

  return (
    <div className="w-xl flex flex-col mx-auto">
      <div className="border border-gray p-8 rounded-2xl text-black bg-white h-96 flex flex-col gap-4 justify-between">
        <div className="w-full flex justify-between items-center gap-4">
          <span className="text-base">You&apos;re sending</span>
          <ConnectSolButton />
        </div>

        <div className="w-full text-center">
          <div className="text-7xl text-black w-full">
            <input
              type="number"
              className="text-center w-full focus:outline-none"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-800">{wei} Gwei</p>
          <p className="text-sm text-gray-800">{lamports} Lamports</p>
        </div>

        <div className="flex justify-between gap-4 items-center">
          <TokenIcon token={"sol"} />
          {publicKey && (
            <p className="text-sm text-gray-800">
              Balance: {solBalance.toFixed(2)} SOL
            </p>
          )}
        </div>
      </div>

      <Toggler />

      <div className="border border-gray p-8 rounded-2xl text-black bg-white flex flex-col gap-4 justify-between">
        <div className="w-full flex justify-between items-center gap-4">
          <span className="text-base">You&apos;re depositing</span>
        </div>

        {recipient && (
          <input
            type="text"
            placeholder=""
            value={recipient}
            className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm/6 text-black shadow-menu"
            readOnly
          />
        )}

        <div className="flex justify-between gap-4 items-center">
          <TokenIcon token={"rome"} />
          <p className="text-sm text-gray-800">
            Balance:{" "}
            {destBalance
              ? `${formatUnits(destBalance.value, 18)} ${destBalance.symbol}`
              : "0 rSOL"}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="shadow-btn bg-white rounded-full px-7 py-4 cursor-pointer hover:font-semibold w-56 text-black text-center mx-auto mt-6"
        onClick={handleTransfer}
        disabled={isProcessing}
      >
        {isProcessing ? "Transferring..." : "Transfer"}
      </button>
    </div>
  );
};
