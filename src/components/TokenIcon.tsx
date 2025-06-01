import { Token } from "@/constants/tokens";

interface TokenIconProps {
  token: string | Token;
  size?: number;
}

export const TokenIcon = ({ token, size = 24 }: TokenIconProps) => {
  const symbol = typeof token === "string" ? token : token.symbol;
  const logoURI =
    typeof token === "string" ? `/images/tokens/${symbol}.png` : token.logoURI;

  if (logoURI) {
    return <img src={logoURI} alt={symbol} width={size} height={size} />;
  }

  return (
    <div
      className="flex items-center justify-center bg-gray-200"
      style={{ width: size, height: size }}
    >
      <span className="text-xs font-medium">{symbol.slice(0, 2)}</span>
    </div>
  );
};
