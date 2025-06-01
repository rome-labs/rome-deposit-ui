import { ROLLUP_PROGRAM_ID } from "@/constants";
import {
  AccountMeta,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { findBalancePda, findOwnerInfoPda, findSolWalletPda } from "./pda";
import { encodeRlp, getBytes, toBeHex, ZeroHash } from "ethers";
import { getChainBuffer } from ".";

const DEPOSIT_IX_ID = 1;

export const L2_ROLLUP_CONTRACT = "0x4200000000000000000000000000000000000016";

export const L2_ROLLUP_ABI = [
  {
    type: "function",
    name: "withdrawal",
    payable: true,
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "bytes32" }],
    outputs: [],
  },
] as const;

export const buildDepositIx = (
  chainId: string,
  sender: PublicKey,
  recipient: string,
  amount: string
) => {
  // Add ix type
  const data: number[] = [];

  // Add chainId
  data.push(DEPOSIT_IX_ID);
  data.push(...getChainBuffer(chainId));
  data.push(0x7e); // DepositTransacton

  // Add deposit body
  const address = getBytes(recipient);
  const depositValue = toBeHex(amount);
  const gas = 21000;

  const rlp = encodeRlp([
    ZeroHash, // source_hash
    address, // from
    address, // to
    depositValue, // mint
    depositValue, // value
    toBeHex(gas), // gas
    "0x", // is_system_tx
    "0x", // data
  ]);
  data.push(...getBytes(rlp));

  const keys: AccountMeta[] = [
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: findOwnerInfoPda(),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: findSolWalletPda(chainId),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: sender,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: findBalancePda(chainId, recipient),
      isSigner: false,
      isWritable: true,
    },
  ];

  const ix = new TransactionInstruction({
    keys,
    data: Buffer.from(data),
    programId: ROLLUP_PROGRAM_ID,
  });

  return ix;
};
