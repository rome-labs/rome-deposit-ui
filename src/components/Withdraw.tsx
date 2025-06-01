import { shortenAddress } from "@/utils";
import { L2_ROLLUP_ABI, L2_ROLLUP_CONTRACT } from "@/utils/txs";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { formatUnits, JsonRpcProvider, parseEther, parseUnits } from "ethers";
import { useMemo, useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ConnectSolButton } from "@/components/ConnectSolButton";
import { bytesToHex, encodeFunctionData, parseGwei } from "viem";
import { Toggler } from "./Toggler";
import useSolBalance from "@/hooks/useSolBalance";
import { TokenIcon } from "./TokenIcon";
import Link from "next/link";
import { useChainStore } from "@/store/chainStore";
import { L2_CHAINS } from "@/constants/chains";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const Withdraw = () => {
  const { publicKey } = useWallet();
  const { address } = useAccount();
  const { data: hash, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    timeout: 60000,
  });

  const { chainId } = useChainStore();

  const recipient = useMemo(() => {
    return publicKey ? publicKey.toBase58() : "";
  }, [publicKey]);

  const { data: rsolBalance, refetch: loadBalance } = useBalance({
    address,
    query: {
      refetchInterval: 10000,
    },
  });
  const { data: destBalance, refetch: loadDestBalance } = useSolBalance({
    address: recipient,
  });

  const [amount, setAmount] = useState("");
  const [isProcessing, setProcessing] = useState(false);
  const [toastId, setToastId] = useState<string | number | null>(null);

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

  useEffect(() => {
    if (isSuccess && toastId) {
      const explorerUrl = L2_CHAINS.find(
        (chain) => chain.chainId === chainId
      )?.explorerUrl;

      if (explorerUrl) {
        toast.update(toastId, {
          render: (
            <Link target="_blank" href={`${explorerUrl}/tx/${hash}`}>
              Transaction confirmed! View on explorer: {shortenAddress(hash)}
            </Link>
          ),
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.update(toastId, {
          render: `Transaction confirmed! Hash: ${shortenAddress(hash)}`,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      }
      setAmount("");
      loadBalance();
      loadDestBalance();
      setToastId(null);
    }
  }, [isSuccess, hash, toastId, chainId]);

  const handleTransfer = () => {
    if (!amount) {
      toast.error("You need to input amount");
      return;
    }

    handleWithdraw();
  };

  const handleWithdraw = async () => {
    if (!publicKey || !address) {
      toast.error("Connect wallet first");
      return;
    }

    if (Number(rsolBalance?.formatted) < Number(amount)) {
      toast.error("Your balance is not enough");
      return;
    }

    const withdrawValue = parseEther(amount);

    setProcessing(true);

    try {
      // Estimate gas
      const chain = L2_CHAINS.find((c) => c.chainId === chainId);
      const provider = new JsonRpcProvider(chain?.rpcUrl);

      const args = [bytesToHex(publicKey.toBytes())] as const;
      const gas = await provider.estimateGas({
        to: L2_ROLLUP_CONTRACT,
        from: address,
        data: encodeFunctionData({
          abi: L2_ROLLUP_ABI,
          functionName: "withdrawal",
          args,
        }),
      });
      console.log(`estimated gas: ${gas}`);

      await writeContractAsync({
        address: L2_ROLLUP_CONTRACT,
        abi: L2_ROLLUP_ABI,
        functionName: "withdrawal",
        args,
        value: withdrawValue,
        gas,
        gasPrice: parseGwei("1"),
      });

      // Show loading toast
      const id = toast.loading(
        "Transaction submitted, waiting for confirmation..."
      );
      setToastId(id);

      // Set timeout for 30 seconds
      setTimeout(() => {
        if (toastId === id && !isSuccess) {
          toast.update(id, {
            render:
              "Transaction confirmation timeout. Please check the transaction status manually.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          setToastId(null);
        }
      }, 30000);
    } catch (ex) {
      console.log(ex);
      if (!(ex as Error).message.includes("User rejected the request")) {
        toast.error(`Transfer failed: Error - ${(ex as Error).message}`);
      }
    }

    setProcessing(false);
  };

  return (
    <div className="w-xl flex flex-col mx-auto">
      <div className="border border-gray p-8 rounded-2xl text-black bg-white min-h-96 flex flex-col gap-4 justify-between">
        <div className="w-full flex justify-between items-center gap-4">
          <span className="text-base">You&apos;re sending</span>
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
          <TokenIcon token={"rome"} />
          <p className="text-sm text-gray-800">
            Balance: {rsolBalance ? formatUnits(rsolBalance?.value, 18) : "-"}{" "}
            rSOL
          </p>
        </div>
      </div>

      <Toggler />

      <div className="border border-gray p-8 rounded-2xl text-black bg-white flex flex-col gap-4 justify-between">
        <div className="w-full flex justify-between items-center gap-4">
          <span className="text-base">You&apos;re depositing</span>
          <ConnectSolButton />
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
          <TokenIcon token={"sol"} />
          <p className="text-sm text-gray-800">
            Balance: {destBalance ?? "-"} SOL
          </p>
        </div>
      </div>

      <button
        type="button"
        className="shadow-btn bg-white rounded-full px-7 py-4 cursor-pointer hover:font-semibold w-56 text-black text-center mx-auto mt-6"
        onClick={handleTransfer}
        disabled={isProcessing || isConfirming}
      >
        {isProcessing
          ? "Transferring..."
          : isConfirming
          ? "Confirming..."
          : "Transfer"}
      </button>
    </div>
  );
};
