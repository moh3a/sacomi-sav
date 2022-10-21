import { Dispatch, SetStateAction } from "react";
import { Column } from "../types";
import Autocomplete from "./shared/Autocomplete";
import Checkbox from "./shared/Checkbox";
import DateInput from "./shared/DateInput";
import NumberInput from "./shared/NumberInput";
import RadioInput from "./shared/RadioInput";
import Textarea from "./shared/Textarea";
import TextInput from "./shared/TextInput";

interface InputsProps {
  state: Column[];
  setState: Dispatch<SetStateAction<Column[]>>;
}

const Inputs = ({ state, setState }: InputsProps) => {
  return (
    <>
      {state.map((field, index) => (
        <div key={field.field} className="flex items-center">
          {field.type === "checkbox" && (
            <Checkbox
              checked={field.value === "OUI" ? true : false}
              label={field.name}
              tabIndex={index}
              onChange={(e) =>
                setState(
                  state.map((f, i) => {
                    if (i === index) f.value = e.target.checked ? "OUI" : "NON"; // ! to fix in migrations
                    return f;
                  })
                )
              }
            />
          )}
          {field.type !== "checkbox" && (
            <div className={field.size ? "" : "w-36"}>
              {field.name}
              <span className="text-danger">{field.required && "*"}</span>
            </div>
          )}
          {field.autocomplete && field.collection && (
            <Autocomplete
              collection={field.collection}
              placeholder={field.name}
              displayValue={field.field}
              value={field.value}
              setSelected={(value) => {
                setState(
                  state.map((f, i) => {
                    if (i === index) f.value = value[field.field];
                    return f;
                  })
                );
              }}
            />
          )}
          {field.type === "radio" && field.options && (
            <RadioInput
              options={field.options}
              selected={
                field.options[
                  field.options.findIndex((e) => e.value === field.value)
                ]
              }
              setSelected={(v) => {
                setState(
                  state.map((f, i) => {
                    if (i === index) f.value = v.value;
                    return f;
                  })
                );
              }}
            />
          )}
          {field.type === "date" && (
            <DateInput
              required={field.required}
              tabIndex={index}
              value={field.value}
              onChange={(e) =>
                setState(
                  state.map((f, i) => {
                    if (i === index) f.value = e.target.value;
                    return f;
                  })
                )
              }
              min={"2005-01-01"}
              max={new Date().toISOString().substring(0, 10)}
            />
          )}
          {field.type === "number" && (
            <NumberInput
              required={field.required}
              placeholder={field.name}
              value={field.value}
              readOnly={field.autogenerated || field.index}
              onChange={(e) =>
                setState(
                  state.map((f, i) => {
                    if (i === index) f.value = Number(e.target.value);
                    return f;
                  })
                )
              }
              type={field.type}
              tabIndex={index}
            />
          )}
          {(!field.type || field.type === "text") &&
            !field.autocomplete &&
            !field.textarea && (
              <TextInput
                required={field.required}
                placeholder={field.name}
                value={field.value}
                readOnly={field.autogenerated || field.index}
                onChange={(e) =>
                  setState(
                    state.map((f, i) => {
                      if (i === index) f.value = e.target.value;
                      return f;
                    })
                  )
                }
                type={field.type}
                size={field.size}
                tabIndex={index}
              />
            )}
          {field.textarea && (
            <Textarea
              required={field.required}
              placeholder={field.name}
              value={field.value}
              readOnly={field.autogenerated || field.index}
              onChange={(e) =>
                setState(
                  state.map((f, i) => {
                    if (i === index) f.value = e.target.value;
                    return f;
                  })
                )
              }
              tabIndex={index}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default Inputs;