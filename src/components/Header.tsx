import Image from "next/image";
import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { ConnectButton } from "@/components/ConnectButton";
import { MobileSidebar } from "./MobileSidebar";

export const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 px-8 py-4 bg-white z-[100]">
      <div className="flex w-full justify-between gap-8 items-center">
        <button type="button">
          <Image
            className=""
            src="/images/logo.svg"
            alt="ROME"
            width={180}
            height={38}
            priority
          />
        </button>
        <div className="flex items-center gap-4">
          <ConnectButton />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 cursor-pointer hover:font-semibold text-black text-center"
          >
            <Bars3Icon className="size-5" />
          </button>
        </div>
      </div>
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};
