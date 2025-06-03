export interface Token {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  isNative?: boolean;
}

export const SUPPORTED_TOKENS: Record<string, Token[]> = {
  "100001": [
    // FooSol
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "rSOL",
      decimals: 18,
      logoURI: "/images/tokens/rsol.png",
      isNative: true,
    },
    {
      address: "0xd96e6272b0D1368756c09463174e590790cA9458",
      symbol: "USDC",
      decimals: 6,
      logoURI: "/images/tokens/usdc.png",
    },
    {
      address: "0x58E95BE0AA68dB79036E7F3B1f94a011E45dF8EB",
      symbol: "USDT",
      decimals: 18,
      logoURI: "/images/tokens/usdt.png",
    },
  ],
  "100003": [
    // FooNet
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "rSOL",
      decimals: 18,
      logoURI: "/images/tokens/rsol.png",
      isNative: true,
    },
    {
      address: "0x2578d6871302880532B72c5a617FA6AdC388C32f",
      symbol: "USDC",
      decimals: 6,
      logoURI: "/images/tokens/usdc.png",
    },
    {
      address: "0x30eE3950ea9D7f0A1A60baB373Ae7208B4245eEB",
      symbol: "USDT",
      decimals: 18,
      logoURI: "/images/tokens/usdt.png",
    },
  ],
};
