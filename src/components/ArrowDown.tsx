import Image from "next/image";

export const ArrowDown = () => {
  return (
    <div className="mx-auto -my-4 z-[10]">
      <div className="bg-white border border-gray rounded-xl w-fit p-1.5 shadow">
        <Image
          src="/images/ic_arrow_down.svg"
          alt="Arrow Down"
          className="w-8 h-8"
          width={32}
          height={32}
        />
      </div>
    </div>
  );
}; 