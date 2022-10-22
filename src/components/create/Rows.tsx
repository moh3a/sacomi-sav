import { Dispatch, SetStateAction } from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";

import { ROUNDED } from "../design";
import Button from "../shared/Button";
import Inputs from "./Inputs";
import { Column } from "../../types";

interface RowsProps {
  state: {
    group_title?: string;
    group_fields: Column[];
    findOrCreateClient?: boolean;
    rows?: boolean;
    row_fields?: Column[][];
  }[];
  setState: Dispatch<
    SetStateAction<
      {
        group_title?: string;
        group_fields: Column[];
        findOrCreateClient?: boolean;
        rows?: boolean;
        row_fields?: Column[][];
      }[]
    >
  >;
}

const Rows = ({ state, setState }: RowsProps) => {
  return (
    <>
      <div>
        {state.map((group, group_index) => (
          <div className="w-full flex-col" key={group_index}>
            {group.rows &&
              group.row_fields?.map((row, row_index) => (
                <div
                  key={row_index}
                  className="w-full flex justify-between my-1"
                >
                  {row.map((field, field_index) => (
                    <Inputs
                      key={field_index}
                      field={field}
                      field_index={field_index}
                      row_index={row_index}
                      group_index={group_index}
                      state={state}
                      setState={setState}
                      rows={true}
                    />
                  ))}
                </div>
              ))}
          </div>
        ))}
      </div>
      <div
        onClick={() =>
          setState(
            state.map((g) => {
              if (g.rows) {
                let newarray = JSON.parse(JSON.stringify(g.group_fields));
                g.row_fields?.push(newarray);
              }
              return g;
            })
          )
        }
        className={`cursor-pointer w-full flex justify-center text-white bg-primary ${ROUNDED} mt-2 mb-1`}
      >
        <Button type="button">
          <PlusCircleIcon className="h-5 w-5 inline" aria-hidden="true" />
        </Button>
      </div>
    </>
  );
};

export default Rows;
