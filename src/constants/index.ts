import { PublicKey } from "@solana/web3.js";

export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
export const ROLLUP_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_ROLLUP_PROGRAM ?? ""
);
