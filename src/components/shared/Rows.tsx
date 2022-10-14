import { Dispatch, SetStateAction, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";

import Button from "./Button";
import TextInput from "./TextInput";
import { PRIMARY_COLOR, ROUNDED } from "../../../lib/design";

interface RowsProps {
  initial_state: any;
  state: any[];
  setState: Dispatch<SetStateAction<any[]>>;
}

const Rows = ({ initial_state, setState, state }: RowsProps) => {
  return (
    <>
      {state.map((s, index) => (
        <div key={index} className="w-full flex justify-between my-1">
          {Object.keys(s).map((key) => (
            <div key={key}>
              <TextInput
                placeholder={key}
                value={s[key as keyof typeof s]}
                onChange={(e) =>
                  setState(
                    state.map((s, i) => {
                      if (index === i)
                        s[key as keyof typeof s] = e.target.value;
                      return s;
                    })
                  )
                }
              />
            </div>
          ))}
        </div>
      ))}
      <div
        className={`w-full flex justify-center border ${PRIMARY_COLOR.border} ${ROUNDED} my-1`}
      >
        <Button
          type="button"
          onClick={() =>
            setState((prev) => {
              let newstate = prev;
              newstate = [...prev, initial_state];
              return newstate;
            })
          }
        >
          <PlusCircleIcon className="h-5 w-5 inline" aria-hidden="true" />
        </Button>
      </div>
    </>
  );
};

export default Rows;
