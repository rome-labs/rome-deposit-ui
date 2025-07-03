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

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
