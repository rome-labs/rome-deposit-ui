import { keccak256, solidityPacked } from "ethers";
import { getAddress } from "ethers/address";
import { Address } from "viem";

import pairArtifact from "@/abis/UniswapV2Pair.json";
const { bytecode: pairBytecode } = pairArtifact;

export const shortenAddress = (address: string | null | undefined) => {
  if (address) {
    return (
      address.substring(0, 4) +
      "..." +
      address.substring(address.length - 4, address.length)
    );
  }

  return "-";
};

export const getChainBuffer = (chainId: string) => {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(BigInt(chainId));
  return buffer;
};

export function getPairAdress(
  factoryAddress: string,
  tokenA: string,
  tokenB: string
): Address {
  const [token0, token1] =
    tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
  const create2Inputs = [
    "0xff",
    factoryAddress,
    keccak256(solidityPacked(["address", "address"], [token0, token1])),
    keccak256(pairBytecode),
  ];
  const sanitizedInputs = `0x${create2Inputs.map((i) => i.slice(2)).join("")}`;
  return getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`) as Address;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
