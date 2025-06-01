import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="lg:shadow-gray rounded-btn bg-white px-6 py-8 w-72 flex flex-col gap-6 text-black">
      <Link href="/">
        <button
          type="button"
          className={clsx(
            "w-full rounded-xl px-8 py-3 text-left cursor-pointer hover:shadow-menu",
            pathname == "/" && "shadow-menu"
          )}
        >
          Transfer
        </button>
      </Link>
      <div className="w-full bg-gray h-[1px]" />

      <Link href="https://discord.gg/romeprotocol" target="_blank">
        <button
          type="button"
          className="w-full flex items-center gap-2 border border-primary/20 rounded-2xl py-4 px-4 cursor-pointer hover:shadow-menu"
        >
          <Image
            src="/images/ic_support.svg"
            alt="Support"
            width={24}
            height={24}
          />
          <span>Support Line</span>
        </button>
      </Link>

      <div className="w-full flex justify-center gap-4">
        <Link href="https://t.me/+tdnr-M6kcngxYzhk" target="_blank">
          <button
            type="button"
            className="shadow-menu rounded-xl p-2 cursor-pointer hover:shadow-gray"
          >
            <Image
              src="/images/ic_telegram.svg"
              alt="Telegram"
              width={24}
              height={24}
            />
          </button>
        </Link>
        <Link href="https://x.com/romeprotocol" target="_blank">
          <button
            type="button"
            className="shadow-menu rounded-xl p-2 cursor-pointer hover:shadow-gray"
          >
            <Image
              src="/images/ic_twitter.svg"
              alt="Twitter"
              width={24}
              height={24}
            />
          </button>
        </Link>
        <Link href="https://docs.rome.builders" target="_blank">
          <button
            type="button"
            className="shadow-menu rounded-xl p-2 cursor-pointer hover:shadow-gray"
          >
            <Image
              src="/images/ic_docs.svg"
              alt="Document"
              width={24}
              height={24}
            />
          </button>
        </Link>
      </div>
    </div>
  );
};
