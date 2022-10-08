import React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@headlessui/react";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";

const DarkMode = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Switch
      checked={theme === "dark" ? true : false}
      onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`bg-gradient-to-r dark:from-rose-100 dark:to-teal-100 from-neutral-900 to-slate-900 relative inline-flex w-14 h-7 items-center rounded-full`}
    >
      <span className="sr-only">Toggle Dark Mode</span>
      <div
        className={`${
          theme === "dark" ? "translate-x-7" : "translate-x-1"
        } inline-block h-6 w-6 transform transition ease-in-out duration-200 rounded-full`}
      >
        {theme === "dark" ? (
          <MoonIcon className="text-teal-600 h-6 w-6 " />
        ) : (
          <SunIcon className="text-teal-400 h-6 w-6" />
        )}
      </div>
    </Switch>
  );
};

export default DarkMode;
