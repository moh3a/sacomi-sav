import { Tab } from "@headlessui/react";
import { ReactNode } from "react";
import { ROUNDED } from "../../../lib/design";

interface TabsProps {
  tabs: { title: string; children: ReactNode }[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs }: TabsProps) {
  return (
    <div className="w-full px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List
          className={`flex space-x-1 ${ROUNDED} bg-teal-900/20 p-1 max-w-md m-auto`}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-teal-600",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-teal-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-teal-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {tab.title}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map((tab, index) => (
            <Tab.Panel
              key={index}
              className={classNames(
                "p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-teal-400 focus:outline-none focus:ring-2"
              )}
            >
              {tab.children}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
