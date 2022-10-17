import { Tab } from "@headlessui/react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { ROUNDED } from "../design";

interface TabsProps {
  tabs: { title: string; children: ReactNode }[];
  setSelectedTab?: Dispatch<SetStateAction<number>>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs, setSelectedTab }: TabsProps) {
  return (
    <Tab.Group>
      <Tab.List
        className={`flex space-x-1 ${ROUNDED} bg-teal-900/20 p-1 max-w-md m-auto`}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2",
                selected
                  ? "bg-white shadow"
                  : "text-teal-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
            onClick={() => setSelectedTab && setSelectedTab(index)}
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
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2"
            )}
          >
            {tab.children}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
