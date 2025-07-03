import Image from "next/image";

interface TokenIconProps {
  token: string;
  size?: number;
}

export const TokenIcon = ({ token, size = 24 }: TokenIconProps) => {
  const logoURI = `/images/tokens/${token}.png`;

  if (logoURI) {
    return <Image src={logoURI} alt={token} width={size} height={size} />;
  }

  return (
    <div
      className="flex items-center justify-center bg-gray-200"
      style={{ width: size, height: size }}
    >
      <span className="text-xs font-medium">{token.slice(0, 2)}</span>
    </div>
  );
};
