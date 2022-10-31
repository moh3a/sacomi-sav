import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

import { useCurrentIdStore } from "../../utils/store";
import { trpc } from "../../utils/trpc";
import Toast from "../shared/Toast";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { status } = useSession();
  const { setCurrentId } = useCurrentIdStore();
  useEffect(() => {
    if (router.asPath.includes("/auth") && status === "authenticated")
      router.replace("/");
    else if (router.asPath !== "/" && status === "unauthenticated")
      router.push("/auth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router.asPath]);

  trpc.config.all.useQuery(undefined, {
    onSettled(data) {
      if (data && data.config) {
        setCurrentId(data.config);
      }
    },
  });

  return (
    <div className="w-screen h-screen overflow-y-scroll break-words bg-gradient-to-r from-primaryLight via-secondaryLight to-primaryLight dark:from-primaryDark dark:via-secondaryDark dark:to-primaryDark text-contentLight dark:text-contentDark ">
      <Toast />
      <Navbar />
      <main className="mb-2">{children}</main>
    </div>
  );
};

export default Layout;
