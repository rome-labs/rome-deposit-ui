import Image from "next/image";
import { useAppStore } from "@/store/appStore";

export const Toggler = () => {
  const { isDeposit, setIsDeposit } = useAppStore();

  return (
    <div className="mx-auto -my-4 z-[10]">
      <button
        type="button"
        className="bg-white border border-gray rounded-xl w-fit p-1.5 shadow cursor-pointer"
        onClick={() => setIsDeposit(!isDeposit)}
      >
        <Image
          src="/images/ic_refresh.png"
          alt="Refresh"
          className="w-8 h-8"
          width={32}
          height={32}
        />
      </button>
    </div>
  );
};
