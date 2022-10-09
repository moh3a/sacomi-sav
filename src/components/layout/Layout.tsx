import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

import { trpc } from "../../utils/trpc";
import { getIds } from "../../redux/currentIdSlice";
import Toast from "../shared/Toast";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { status } = useSession();
  useEffect(() => {
    if (router.asPath.includes("/auth") && status === "authenticated")
      router.replace("/");
    else if (router.asPath !== "/" && status === "unauthenticated")
      router.push("/auth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router.asPath]);

  const dispatch = useDispatch();
  trpc.config.all.useQuery(undefined, {
    onSettled(data) {
      if (data) dispatch(getIds(data.config));
    },
  });

  return (
    <div className="w-screen h-screen max-w-screen-2xl max-h-screen-2xl lg:overflow-hidden bg-gradient-to-r from-teal-100 via-rose-100 to-teal-100 dark:from-slate-900 dark:via-neutral-900 dark:to-slate-900">
      <Toast />
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
