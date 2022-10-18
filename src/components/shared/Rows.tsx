import { Dispatch, SetStateAction } from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";

import { ROUNDED } from "../design";
import Button from "./Button";
import TextInput from "./TextInput";
import Autocomplete from "./Autocomplete";
import { Column } from "../../types";
import NumberInput from "./NumberInput";

interface RowsProps {
  initial_state: Column[];
  state: Column[][];
  setState: Dispatch<SetStateAction<any[]>>;
}

const Rows = ({ initial_state, setState, state }: RowsProps) => {
  return (
    <>
      {state.map((row, row_index) => (
        <div key={row_index} className="w-full flex justify-between my-1">
          {row &&
            row.map((col, col_index) => (
              <div key={col_index}>
                {col.autocomplete && col.collection ? (
                  <Autocomplete
                    collection={col.collection}
                    placeholder={col.name}
                    displayValue={col.field}
                    value={col.value}
                    setSelected={(value) => {
                      setState(
                        state.map((r, i) => {
                          if (row_index === i)
                            r = r.map((c, j) => {
                              if (c.index) c.value = String(row_index + 1);
                              if (col_index === j && c.autocomplete)
                                c.value = value[col.field];
                              return c;
                            });
                          return r;
                        })
                      );
                    }}
                  />
                ) : col.type === "number" ? (
                  <NumberInput
                    placeholder={col.name}
                    value={col.value}
                    readOnly={col.index}
                    onChange={(event) =>
                      setState(
                        state.map((r, i) => {
                          if (row_index === i)
                            r = r.map((c, j) => {
                              if (c.index) c.value = String(row_index + 1);
                              if (col_index === j)
                                c.value = event.target.value.toUpperCase();
                              return c;
                            });
                          return r;
                        })
                      )
                    }
                    type={col.type}
                  />
                ) : (
                  <TextInput
                    placeholder={col.name}
                    value={col.value}
                    readOnly={col.index}
                    onChange={(event) =>
                      setState(
                        state.map((r, i) => {
                          if (row_index === i)
                            r = r.map((c, j) => {
                              if (c.index) c.value = String(row_index + 1);
                              if (col_index === j)
                                c.value = event.target.value.toUpperCase();
                              return c;
                            });
                          return r;
                        })
                      )
                    }
                    type={col.type}
                    size={col.size}
                  />
                )}
              </div>
            ))}
        </div>
      ))}
      <div
        className={`w-full flex justify-center border primary ${ROUNDED} my-1`}
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
