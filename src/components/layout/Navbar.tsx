import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { PAGES } from "../../../lib/config";
import DarkMode from "../DarkMode";
import Account from "../auth/Account";
import Slideover from "./Slideover";
import { useRouter } from "next/router";
import { BG_GRADIENT_REVERSE, SHADOW } from "../design";

const Navbar = () => {
  const { data: session } = useSession();
  const [sideOpen, setSideOpen] = useState(false);

  const router = useRouter();

  return (
    <div className="mb-8 lg:mb-0">
      <nav className="h-14 p-4 flex justify-between">
        {/* hamburger menu icon */}
        <div
          className="flex-1 lg:hidden space-y-1.5"
          onClick={() => setSideOpen(!sideOpen)}
        >
          <span className="block w-5 h-0.5 bg-slate-600 dark:bg-slate-300"></span>
          <span className="block w-8 h-0.5 bg-slate-600 dark:bg-slate-300"></span>
          <span className="block w-8 h-0.5 bg-slate-600 dark:bg-slate-300"></span>
        </div>
        <Slideover open={sideOpen} setOpen={setSideOpen} />
        <div className="flex-1">
          <Link href="/" passHref>
            <button
              className={`inline px-2 py-1 -skew-y-6 font-bold text-contentDark dark:text-contentLight ${BG_GRADIENT_REVERSE} ${SHADOW} `}
            >
              SAV Thomson
            </button>
          </Link>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="hidden lg:block relative top-2 mr-2">
            <DarkMode />
          </div>
          {!router.asPath.includes("/auth") && <Account />}
        </div>
      </nav>
      {session && (
        <nav className="hidden lg:flex justify-center mt-4 mb-8">
          {PAGES.map((page) => (
            <div
              key={page.name}
              className={`mx-4 font-bold hover:text-primary ${
                router.asPath.includes(page.url) &&
                "underline underline-offset-2 decoration-double decoration-primary "
              }`}
            >
              <Link href={page.url}>{page.name}</Link>
            </div>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Navbar;
