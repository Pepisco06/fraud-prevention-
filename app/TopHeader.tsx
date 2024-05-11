import Link from "next/link";
import LoginStatus from "./auth/LoginStatus";

const TopHeader = () => {
  return (
    <header className="flex  flex-col items-center justify-between px-24 pt-24 pb-12">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Link
          href="/"
          className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 
        from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 
        dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 
        lg:dark:bg-zinc-800/30"
        >
          CREDIT CARD FRAUD PREVENTION SYSTEM&nbsp;
        </Link>

        <LoginStatus />
        <div
          className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center  
        from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none"
        >
          <span className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
            By ABDULAZEEZ!
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
