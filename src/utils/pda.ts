import { ROLLUP_PROGRAM_ID } from "@/constants";
import { PublicKey } from "@solana/web3.js";
import { getBytes } from "ethers";
import { getChainBuffer } from ".";

export const findOwnerInfoPda = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("OWNER_INFO")],
    ROLLUP_PROGRAM_ID
  )[0];
};

export const findSolWalletPda = (chainId: string) => {
  return PublicKey.findProgramAddressSync(
    [getChainBuffer(chainId), Buffer.from("CONTRACT_SOL_WALLET")],
    ROLLUP_PROGRAM_ID
  )[0];
};

export const findBalancePda = (chainId: string, address: string) => {
  return PublicKey.findProgramAddressSync(
    [getChainBuffer(chainId), Buffer.from("ACCOUN_SEED"), getBytes(address)],
    ROLLUP_PROGRAM_ID
  )[0];
};
