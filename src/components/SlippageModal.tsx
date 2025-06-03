import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface SlippageModalProps {
  isOpen: boolean;
  onClose: () => void;
  slippage: string;
  onSlippageChange: (value: string) => void;
}

export const SlippageModal = ({
  isOpen,
  onClose,
  slippage,
  onSlippageChange,
}: SlippageModalProps) => {
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
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Slippage Settings
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSlippageChange("0.1")}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        slippage === "0.1" ? "bg-blue-500 text-white" : "bg-gray-100"
                      }`}
                    >
                      0.1%
                    </button>
                    <button
                      onClick={() => onSlippageChange("0.5")}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        slippage === "0.5" ? "bg-blue-500 text-white" : "bg-gray-100"
                      }`}
                    >
                      0.5%
                    </button>
                    <button
                      onClick={() => onSlippageChange("1.0")}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        slippage === "1.0" ? "bg-blue-500 text-white" : "bg-gray-100"
                      }`}
                    >
                      1.0%
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-24 rounded-xl bg-white/5 px-3 py-2 text-sm text-black shadow-menu"
                      value={slippage}
                      onChange={(e) => onSlippageChange(e.target.value)}
                      min="0.1"
                      max="100"
                      step="0.1"
                    />
                    <span className="text-sm">%</span>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="shadow-btn bg-white rounded-full px-7 py-3 cursor-pointer hover:font-semibold w-full text-black text-center"
                    onClick={onClose}
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 