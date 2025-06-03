import { useUniswapV2Swap } from "@/hooks/useUniswapV2Swap";
import { toast } from "react-toastify";
import { formatUnits, parseUnits } from "ethers";
import { useState, useMemo, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { useChainStore } from "@/store/chainStore";
import { Token } from "@/constants/tokens";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { SlippageModal } from "./SlippageModal";
import { TokenInput } from "./TokenInput";
import { getPairAdress } from "@/utils";
import { L2_CHAINS } from "@/constants/chains";
import { shortenAddress } from "@/utils";
import Link from "next/link";

export const Swap = () => {
  const { address, isConnected } = useAccount();
  const { chainId } = useChainStore();
  const { swapTokens, isConfirming, isSuccess, hash, getReserves } =
    useUniswapV2Swap();

  const chain = L2_CHAINS.find((c) => c.chainId === chainId);
  const factoryAddress = chain?.contracts.uniswapV2Factory;

  // Helper to get the correct address for a token (WETH if native)
  const getTokenAddress = (token: Token, chain: (typeof L2_CHAINS)[number]) =>
    token.isNative ? chain.contracts.weth : token.address;

  const [tokenIn, setTokenIn] = useState<Token | null>(null);
  const [tokenOut, setTokenOut] = useState<Token | null>(null);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const [slippage, setSlippage] = useState("0.5"); // 0.5% default slippage
  const [isProcessing, setProcessing] = useState(false);
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);
  const [toastId, setToastId] = useState<string | number | null>(null);

  // Add balance hooks for both tokens
  const { refetch: refetchTokenInBalance } = useBalance({
    address,
    token: tokenIn?.isNative ? undefined : (tokenIn?.address as `0x${string}`),
  });

  const { refetch: refetchTokenOutBalance } = useBalance({
    address,
    token: tokenOut?.isNative
      ? undefined
      : (tokenOut?.address as `0x${string}`),
  });

  // Reset token selection when chain changes
  useEffect(() => {
    setTokenIn(null);
    setTokenOut(null);
    setAmountIn("");
    setAmountOut("");
  }, [chainId]);

  // Handle transaction confirmation and refresh balances
  useEffect(() => {
    if (isSuccess && toastId && hash) {
      const explorerUrl = chain?.explorerUrl;
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
      setAmountIn("");
      setAmountOut("");
      setToastId(null);

      // Refresh balances after successful transaction
      if (tokenIn) refetchTokenInBalance();
      if (tokenOut) refetchTokenOutBalance();
    }
  }, [
    isSuccess,
    hash,
    toastId,
    chain,
    tokenIn,
    tokenOut,
    refetchTokenInBalance,
    refetchTokenOutBalance,
  ]);

  const quoteInfo = useMemo(() => {
    if (!tokenIn || !tokenOut || !amountIn || !amountOut) return null;

    // Format numbers to avoid scientific notation
    const formattedAmountIn = Number(amountIn).toLocaleString("fullwide", {
      useGrouping: false,
      maximumFractionDigits: tokenIn.decimals,
    });
    const formattedAmountOut = Number(amountOut).toLocaleString("fullwide", {
      useGrouping: false,
      maximumFractionDigits: tokenOut.decimals,
    });

    const amountInWei = parseUnits(formattedAmountIn, tokenIn.decimals);
    const amountOutWei = parseUnits(formattedAmountOut, tokenOut.decimals);

    // Calculate exchange rate considering decimal differences
    const decimalDiff = BigInt(
      10 ** Math.abs(tokenIn.decimals - tokenOut.decimals)
    );
    const exchangeRate =
      tokenIn.decimals > tokenOut.decimals
        ? (Number(amountOutWei) / Number(amountInWei)) * Number(decimalDiff)
        : Number(amountOutWei) / Number(amountInWei) / Number(decimalDiff);

    const priceImpact = 0; // TODO: Calculate price impact based on reserves

    return {
      exchangeRate,
      priceImpact,
    };
  }, [tokenIn, tokenOut, amountIn, amountOut]);

  // Update the fetchQuote function to handle undefined factoryAddress
  useEffect(() => {
    const fetchQuote = async () => {
      if (!tokenIn || !tokenOut || !amountIn || !factoryAddress || !chain) {
        setAmountOut("");
        return;
      }
      try {
        const tokenInAddr = getTokenAddress(tokenIn, chain);
        const tokenOutAddr = getTokenAddress(tokenOut, chain);
        const pairAddress = getPairAdress(
          factoryAddress,
          tokenInAddr,
          tokenOutAddr
        );
        if (!pairAddress) {
          setAmountOut("");
          return;
        }
        const reserves = await getReserves(pairAddress as `0x${string}`);
        if (!reserves) {
          setAmountOut("");
          return;
        }

        // Sort tokens by address to determine reserves order
        const [token0Addr, token1Addr] = [tokenInAddr, tokenOutAddr].sort();
        console.log(token0Addr, token1Addr);
        const isToken0In =
          tokenInAddr.toLowerCase() === token0Addr.toLowerCase();
        const [reserveIn, reserveOut] = isToken0In
          ? [reserves[0], reserves[1]]
          : [reserves[1], reserves[0]];

        const amountInWei = parseUnits(amountIn, tokenIn.decimals);

        const numerator = amountInWei * reserveOut;
        const denominator = reserveIn + amountInWei;
        const outputAmount = numerator / denominator;

        // For native token output, we need to handle WETH decimals
        const formattedAmount = formatUnits(outputAmount, tokenOut.decimals);
        setAmountOut(Number(formattedAmount).toFixed(6));
      } catch (error) {
        console.error("Error fetching quote:", error);
        setAmountOut("");
      }
    };

    if (factoryAddress && chain) {
      fetchQuote();
    }
  }, [tokenIn, tokenOut, getReserves, factoryAddress, amountIn, chain]);

  const handleSwap = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!tokenIn || !tokenOut || !chain) {
      toast.error("Please select both tokens");
      return;
    }
    if (!amountIn) {
      toast.error("Please enter an amount");
      return;
    }
    setProcessing(true);
    try {
      const tokenInAddr = getTokenAddress(tokenIn, chain);
      const tokenOutAddr = getTokenAddress(tokenOut, chain);
      // const slippagePercent = Number(slippage) / 100;
      // const amountOutMin = (
      //   Number(amountOut) *
      //   (1 - slippagePercent)
      // ).toString();

      // Execute the swap first
      await swapTokens(
        tokenInAddr,
        tokenOutAddr,
        amountIn,
        // amountOutMin
        "0",
        tokenIn.isNative ?? false
      );

      // Show loading toast only after transaction is submitted
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
    } catch (error) {
      console.error("Swap error:", error);
      const errorMessage = (error as Error).message;

      // Don't show any error message for user rejections
      if (errorMessage.includes("User rejected the request")) {
        return;
      }

      // Extract core error message
      let coreError = errorMessage;

      // Remove common prefixes and technical details
      if (errorMessage.includes("reason=")) {
        coreError = errorMessage
          .split("reason=")[1]
          .split(",")[0]
          .replace(/"/g, "");
      } else if (errorMessage.includes("execution reverted:")) {
        coreError = errorMessage
          .split("execution reverted:")[1]
          .split("(")[0]
          .trim();
      } else if (errorMessage.includes("(")) {
        coreError = errorMessage.split("(")[0].trim();
      }

      // Remove any remaining technical details
      coreError = coreError
        .replace(/\[.*?\]/g, "") // Remove anything in square brackets
        .replace(/\(.*?\)/g, "") // Remove anything in parentheses
        .replace(/code=.*$/, "") // Remove code= and everything after
        .replace(/version=.*$/, "") // Remove version= and everything after
        .trim();

      toast.error(`Swap failed: ${coreError}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleAmountInChange = async (value: string) => {
    setAmountIn(value);
    if (!tokenIn || !tokenOut || !value || !factoryAddress || !chain) {
      setAmountOut("");
      return;
    }
  };

  const handleAmountOutChange = async (value: string) => {
    setAmountOut(value);
    if (!tokenIn || !tokenOut || !value || !factoryAddress || !chain) {
      setAmountIn("");
      return;
    }
  };

  return (
    <div className="w-xl flex flex-col mx-auto gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Swap
          <button
            onClick={() => setIsSlippageModalOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </h2>
      </div>

      <SlippageModal
        isOpen={isSlippageModalOpen}
        onClose={() => setIsSlippageModalOpen(false)}
        slippage={slippage}
        onSlippageChange={setSlippage}
      />

      <div className="flex flex-col gap-4">
        <TokenInput
          label="From"
          selectedToken={tokenIn}
          oppositeToken={tokenOut}
          value={amountIn}
          onSelect={setTokenIn}
          onOppositeSelect={setTokenOut}
          onChange={handleAmountInChange}
        />

        <div className="flex justify-center">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => {
              const temp = tokenIn;
              setTokenIn(tokenOut);
              setTokenOut(temp);
              const tempAmount = amountIn;
              setAmountIn(amountOut);
              setAmountOut(tempAmount);
            }}
          >
            ↓↑
          </button>
        </div>

        <TokenInput
          label="To"
          selectedToken={tokenOut}
          oppositeToken={tokenIn}
          value={amountOut}
          onSelect={setTokenOut}
          onOppositeSelect={setTokenIn}
          onChange={handleAmountOutChange}
        />
      </div>

      {quoteInfo && (
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-gray-50">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Exchange Rate</span>
            <span className="font-medium">
              1 {tokenIn?.symbol} = {quoteInfo.exchangeRate.toFixed(6)}{" "}
              {tokenOut?.symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price Impact</span>
            <span className="font-medium">
              {quoteInfo.priceImpact.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Slippage Tolerance</span>
            <span className="font-medium">{slippage}%</span>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          className="shadow-btn bg-white rounded-full px-12 py-4 cursor-pointer hover:font-semibold text-black text-center min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSwap}
          disabled={
            !isConnected ||
            isProcessing ||
            isConfirming ||
            !tokenIn ||
            !tokenOut ||
            !amountIn
          }
        >
          {!isConnected
            ? "Connect Wallet"
            : isProcessing
            ? "Processing..."
            : isConfirming
            ? "Confirming..."
            : "Swap"}
        </button>
      </div>
    </div>
  );
};
