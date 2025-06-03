import { useCallback } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { parseEther } from "ethers";
import {
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V2_PAIR_ABI,
} from "@/constants/uniswap";
import { useChainStore } from "@/store/chainStore";
import { L2_CHAINS } from "@/constants/chains";

export const useUniswapV2Swap = () => {
  const { address } = useAccount();
  const { chainId } = useChainStore();
  const publicClient = usePublicClient();

  const chain = L2_CHAINS.find((c) => c.chainId === chainId);
  const routerAddress = chain?.contracts.uniswapV2Router as `0x${string}`;

  const { writeContractAsync, data: hash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const getReserves = useCallback(
    async (pairAddress: `0x${string}`) => {
      if (!publicClient) return null;

      const data = await publicClient.readContract({
        abi: UNISWAP_V2_PAIR_ABI,
        address: pairAddress,
        functionName: "getReserves",
      });
      return data;
    },
    [publicClient]
  );

  const swapTokens = useCallback(
    async (
      tokenInAddress: string,
      tokenOutAddress: string,
      amountIn: string,
      amountOutMin: string,
      isNative: boolean
    ) => {
      if (!address || !routerAddress) return;

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
      const path = [tokenInAddress, tokenOutAddress] as `0x${string}`[];

      if (isNative) {
        // Swap native token for tokens
        await writeContractAsync({
          abi: UNISWAP_V2_ROUTER_ABI,
          address: routerAddress,
          functionName: "swapExactETHForTokens",
          args: [parseEther(amountOutMin), path, address, BigInt(deadline)],
          value: parseEther(amountIn),
        });
      } else if (
        tokenOutAddress.toLowerCase() === chain?.contracts.weth.toLowerCase()
      ) {
        // Swap tokens for native token
        await writeContractAsync({
          abi: UNISWAP_V2_ROUTER_ABI,
          address: routerAddress,
          functionName: "swapExactTokensForETH",
          args: [
            parseEther(amountIn),
            parseEther(amountOutMin),
            path,
            address,
            BigInt(deadline),
          ],
        });
      } else {
        // Swap tokens for tokens
        await writeContractAsync({
          abi: UNISWAP_V2_ROUTER_ABI,
          address: routerAddress,
          functionName: "swapExactTokensForTokens",
          args: [
            parseEther(amountIn),
            parseEther(amountOutMin),
            path,
            address,
            BigInt(deadline),
          ],
        });
      }
    },
    [address, routerAddress, writeContractAsync, chain]
  );

  return {
    swapTokens,
    getReserves,
    isConfirming,
    isSuccess,
    hash,
  };
};
