import { PublicKey } from "@solana/web3.js";

export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
export const ROLLUP_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_ROLLUP_PROGRAM ?? ""
);

export const L2_CHAIN_NAME = process.env.NEXT_PUBLIC_L2_CHAIN_NAME ?? "Rome L2";
export const L2_CHAIN_ID = process.env.NEXT_PUBLIC_L2_CHAIN_ID ?? "";
export const L2_RPC_URL = process.env.NEXT_PUBLIC_L2_RPC_URL ?? "";
export const L2_EXPLORER_URL = process.env.NEXT_PUBLIC_L2_EXPLORER_URL ?? "";
