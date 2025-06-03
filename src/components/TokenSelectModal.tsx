import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Token } from "@/constants/tokens";
import { TokenIcon } from "./TokenIcon";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token | null) => void;
  tokens: Token[];
}

export const TokenSelectModal = ({
  isOpen,
  onClose,
  onSelect,
  tokens,
}: TokenSelectModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customAddress, setCustomAddress] = useState("");

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomToken = () => {
    if (!customAddress) return;

    // Basic validation for Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(customAddress)) {
      alert("Invalid token address");
      return;
    }

    // Create a custom token object
    const customToken: Token = {
      address: customAddress as `0x${string}`,
      symbol: "CUSTOM",
      decimals: 18,
    };

    onSelect(customToken);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-black mb-4"
                >
                  Select Token
                </Dialog.Title>

                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search by name or paste address"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
                </div>

                {tokens.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No tokens available for the selected chain
                  </div>
                ) : searchQuery && !filteredTokens.length ? (
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Enter token address"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                    />
                    <button
                      onClick={handleCustomToken}
                      className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Add Custom Token
                    </button>
                  </div>
                ) : (
                  <div className="max-h-[60vh] overflow-y-auto">
                    {filteredTokens.map((token) => (
                      <button
                        key={token.address}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                        onClick={() => {
                          onSelect(token);
                          onClose();
                        }}
                      >
                        <TokenIcon token={token} size={32} />
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-black">
                            {token.symbol}
                          </span>
                          <span className="text-sm text-gray-500">
                            {token.address.slice(0, 6)}...
                            {token.address.slice(-4)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
