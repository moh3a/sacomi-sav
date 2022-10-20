import { Dispatch, SetStateAction } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { PADDING, ROUNDED } from "../design";

interface RadioInputProps {
  id?: string;
  name?: string;
  options: {
    name: string;
    value: string;
  }[];
  selected: any;
  setSelected: Dispatch<SetStateAction<any>>;
}

export default function RadioInput({
  id,
  name,
  options,
  selected,
  setSelected,
}: RadioInputProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      <RadioGroup value={selected} onChange={setSelected} id={id} name={name}>
        <div className="flex flex-wrap space-x-2">
          {options.map((option) => (
            <RadioGroup.Option
              key={option.value}
              value={option}
              className={({ active, checked }) =>
                `${
                  active
                    ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-primary"
                    : ""
                }
                  ${
                    checked ? "bg-primary bg-opacity-75 text-white" : "bg-white"
                  }
                    relative flex cursor-pointer ${ROUNDED} ${PADDING} shadow-md focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <RadioGroup.Label
                        as="p"
                        className={`text-sm font-medium  ${
                          checked ? "text-white" : "text-primary"
                        }`}
                      >
                        {option.name}
                      </RadioGroup.Label>
                    </div>
                    {checked && (
                      <div className="shrink-0 text-white">
                        <CheckCircleIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
