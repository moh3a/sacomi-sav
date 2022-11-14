/* eslint-disable @next/next/no-img-element */
import React, { Fragment } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { LogoutIcon, UserCircleIcon } from "@heroicons/react/outline";
import { useRealtimeStore } from "../../utils/store";
import { trpc } from "../../utils/trpc";

const Account = () => {
  const { data: session } = useSession();
  const { connected, set_connected } = useRealtimeStore();

  trpc.onCheck.useSubscription(undefined, {
    onData(is) {
      set_connected(is);
    },
    onError() {
      set_connected(false);
    },
  });

  if (!session) {
    return (
      <div>
        <Link href={"/auth"} passHref>
          <button className="flex items-center justify-center">
            <UserCircleIcon className="inline w-10 h-10" aria-hidden="true" />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>
        <div>
          <span className="absolute -bottom-3 flex h-3 w-3">
            {connected && (
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full  bg-success opacity-75`}
              />
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                connected ? "bg-success" : "bg-danger"
              }`}
            />
          </span>
          <img
            src={session.user?.image as string}
            alt={session.user?.name as string}
            className="cursor-pointer w-10 h-10 rounded-full"
          />
        </div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-full shadow-md bg-primaryLight dark:bg-primaryDark ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? "bg-secondaryLight  dark:bg-secondaryDark" : "",
                    "rounded-full w-full px-4 py-2 text-sm"
                  )}
                  onClick={() => signOut()}
                >
                  <LogoutIcon
                    className="inline h-5 w-5 mr-2"
                    aria-hidden="true"
                  />
                  Se déconnecter
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default Account;
