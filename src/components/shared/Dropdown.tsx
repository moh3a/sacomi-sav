import React, { Dispatch, SetStateAction } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { SHADOW, TEXT_INPUT } from "../design";

interface DropdownProps {
  options: {
    name: string;
    value: string;
  }[];
  selected: any;
  setSelected: Dispatch<SetStateAction<any>>;
}

const Dropdown = ({ options, selected, setSelected }: DropdownProps) => {
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button
          className={` ${TEXT_INPUT} justify-center inline-flex w-full`}
        >
          {selected}
          <ChevronDownIcon
            className="ml-2 -mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
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
          <Menu.Items
            className={`absolute right-0 mt-2 w-56 origin-top-right divide-y divide-primaryLight rounded-md bg-white ${SHADOW} ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            <div className="px-1 py-1 ">
              {options.map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      onClick={() => setSelected(option)}
                      className={`${
                        active
                          ? "bg-primary text-contentDark"
                          : "text-contentLight"
                      } group flex w-full items-center rounded-md px-3 py-1 text-xs`}
                    >
                      {option.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default Dropdown;
