import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { PRIMARY_COLOR, TEXT_INPUT } from "../../../lib/design";

interface AutocompleteProps {
  filteredResult: any;
  placeholder: string;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  displayValue: string;
  selected: any;
  setSelected: Dispatch<SetStateAction<any>>;
}

const Autocomplete = ({
  filteredResult,
  placeholder,
  displayValue,
  query,
  setQuery,
  selected,
  setSelected,
}: AutocompleteProps) => {
  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <div className="relative w-full">
          <Combobox.Input
            className={TEXT_INPUT}
            placeholder={placeholder}
            displayValue={(model: any) => model && model[displayValue]}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="z-20 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-black py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredResult.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Aucun résultat.
              </div>
            ) : (
              filteredResult.map((value: any, index: number) => (
                <Combobox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? `bg-${PRIMARY_COLOR.light} text-white` : ""
                    }`
                  }
                  value={value}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {value[displayValue]}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default Autocomplete;
