import { useState } from "react";
import { Token } from "@/constants/tokens";
import { TokenIcon } from "./TokenIcon";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { TokenSelectModal } from "./TokenSelectModal";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "ethers";

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token | null) => void;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const TokenSelector = ({
  tokens,
  selectedToken,
  onSelect,
  label,
  value,
  onChange,
}: TokenSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address } = useAccount();

  // Use different balance hooks for native and non-native tokens
  const { data: tokenBalance } = useBalance({
    address,
    token: selectedToken?.isNative ? undefined : selectedToken?.address,
  });

  const { data: nativeBalance } = useBalance({
    address,
    token: undefined, // undefined means native token
  });

  // Use native balance for native tokens, otherwise use token balance
  const balance = selectedToken?.isNative ? nativeBalance : tokenBalance;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">{label}</span>
        {selectedToken && balance && (
          <span className="text-sm text-gray-600">
            Balance:{" "}
            {Number(formatUnits(balance.value, balance.decimals)).toFixed(4)}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.0"
          className="flex-1 bg-transparent text-2xl outline-none"
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-menu"
        >
          {selectedToken ? (
            <>
              <TokenIcon token={selectedToken} size={20} />
              <span className="font-medium hidden sm:inline">
                {selectedToken.symbol}
              </span>
            </>
          ) : (
            <span className="font-medium hidden lg:inline">Select Token</span>
          )}
          <ChevronDownIcon className="w-5 h-5" />
        </button>
      </div>

      <TokenSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={onSelect}
        tokens={tokens}
      />
    </div>
  );
};
