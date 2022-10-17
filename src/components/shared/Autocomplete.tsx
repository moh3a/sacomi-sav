import {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { trpc } from "../../utils/trpc";
import { TEXT_INPUT } from "../design";
import { Collection } from "../../types";

interface AutocompleteProps {
  collection: Collection["name"];
  displayValue: string;
  placeholder: string;
  value?: string;
  selected?: any;
  setSelected: Dispatch<SetStateAction<any>>;
}

const Autocomplete = ({
  placeholder,
  value,
  displayValue,
  selected,
  setSelected,
  collection,
}: AutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [filteredResult, setFilteredResult] = useState<any>([]);

  const mutations = trpc[collection].byUnique.useMutation();
  const fetchData = useCallback(async () => {
    if (query) {
      await mutations.mutateAsync(
        // @ts-ignore
        { [displayValue]: query },
        {
          onSettled(data) {
            // @ts-ignore
            if (data) setFilteredResult(data[collection]);
          },
        }
      );
    } else {
      setFilteredResult([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <div className="relative w-full">
          <Combobox.Input
            className={` ${TEXT_INPUT} w-full`}
            placeholder={placeholder}
            displayValue={(model: any) =>
              value ? value : model && model[displayValue]
            }
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
                      active ? `bg-primary text-white` : ""
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
                            active ? "text-white" : "text-primary"
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
