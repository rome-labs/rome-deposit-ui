import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { L2_CHAINS } from "@/constants/chains";
import { useChainStore } from "@/store/chainStore";
import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { createWagmiConfig } from "@/providers/WagmiConfig";
import { clearRainbowKitCache } from "@/utils/wallet";

interface ChainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChainModal = ({ isOpen, onClose }: ChainModalProps) => {
  const { selectedChainId, setSelectedChainId, setChain, setWagmiConfig } =
    useChainStore();
  const { isConnected } = useAccount();

  const handleChainSelect = async (chainId: string) => {
    setSelectedChainId(chainId);
    const chain = L2_CHAINS.find((chain) => chain.chainId === chainId);
    if (chain) {
      setChain(chain.chainId);

      // If wallet is connected, update wagmi config and reconnect
      if (isConnected) {
        try {
          // Update wagmi config with new chain
          setWagmiConfig(createWagmiConfig(chain.chainId));

          // Clear RainbowKit cache
          clearRainbowKitCache();
        } catch (error) {
          toast.error("Failed to switch chain. Please try again.");
          console.error("Failed to switch chain:", error);
        }
      }
    }
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={onClose}>
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
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Select L2 Chain
                </Dialog.Title>

                <div className="flex flex-col gap-4">
                  {L2_CHAINS.map((chain) => (
                    <button
                      key={chain.chainId}
                      onClick={() =>
                        handleChainSelect(chain.chainId.toString())
                      }
                      className={clsx(
                        "flex items-center gap-2 rounded-xl px-4 py-3 text-left transition-colors",
                        selectedChainId === chain.chainId.toString()
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <CheckIcon
                        className={clsx(
                          "size-5",
                          selectedChainId === chain.chainId.toString()
                            ? "text-blue-600"
                            : "text-transparent"
                        )}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {chain.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Chain ID: {chain.chainId}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
