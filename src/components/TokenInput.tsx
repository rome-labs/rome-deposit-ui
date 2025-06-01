import { Token, SUPPORTED_TOKENS } from "@/constants/tokens";
import { TokenSelector } from "./TokenSelector";
import { useChainStore } from "@/store/chainStore";

interface TokenInputProps {
  label: "From" | "To";
  selectedToken: Token | null;
  oppositeToken: Token | null;
  value: string;
  onSelect: (token: Token | null) => void;
  onOppositeSelect: (token: Token | null) => void;
  onChange: (value: string) => void;
}

export const TokenInput = ({
  label,
  selectedToken,
  oppositeToken,
  value,
  onSelect,
  onOppositeSelect,
  onChange,
}: TokenInputProps) => {
  const { chainId } = useChainStore();
  const chainTokens = SUPPORTED_TOKENS[chainId] || [];

  const handleTokenSelect = (token: Token | null) => {
    if (!token) {
      onSelect(null);
      return;
    }
    if (oppositeToken && token.address === oppositeToken.address) {
      onSelect(oppositeToken);
      onOppositeSelect(selectedToken);
    } else {
      onSelect(token);
    }
  };

  return (
    <div className="shadow-gray rounded-btn bg-white px-6 py-8">
      <TokenSelector
        tokens={chainTokens}
        selectedToken={selectedToken}
        onSelect={handleTokenSelect}
        label={label}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}; 