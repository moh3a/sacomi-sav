import React, { Dispatch, SetStateAction } from "react";
import { Column, DataLayout } from "../../types";
import Autocomplete from "../shared/Autocomplete";
import Checkbox from "../shared/Checkbox";
import DateInput from "../shared/DateInput";
import NumberInput from "../shared/NumberInput";
import RadioInput from "../shared/RadioInput";
import Textarea from "../shared/Textarea";
import TextInput from "../shared/TextInput";

interface InputsProps {
  field: Column;
  field_index: number;
  row_index?: number;
  group_index: number;
  rows?: boolean;
  state: DataLayout[];
  setState: Dispatch<SetStateAction<DataLayout[]>>;
  setUniqueError?: Dispatch<SetStateAction<string>>;
}

const Inputs = ({
  setState,
  state,
  field,
  field_index,
  group_index,
  row_index,
  rows,
  setUniqueError,
}: InputsProps) => {
  return (
    <div key={field_index} className={!rows ? "m-2 flex items-center" : ""}>
      {field.type === "checkbox" && (
        <Checkbox
          checked={field.value === "OUI" ? true : false}
          label={field.name}
          tabIndex={field_index}
          onChange={(e) =>
            setState(
              state.map((g, gidx) => {
                if (gidx === group_index) {
                  if (g.rows) {
                    g.row_fields = g.row_fields?.map((r, ridx) => {
                      if (ridx === row_index) {
                        r.map((f, fidx) => {
                          if (f.index) f.value = String(row_index + 1);
                          if (fidx === field_index) {
                            f.value = e.target.checked ? "OUI" : "NON"; // ! to fix in migrations
                          }
                          return f;
                        });
                      }
                      return r;
                    });
                  } else {
                    g.group_fields = g.group_fields.map((f, fidx) => {
                      if (fidx === field_index) {
                        f.value = e.target.checked ? "OUI" : "NON"; // ! to fix in migrations
                      }
                      return f;
                    });
                  }
                }
                return g;
              })
            )
          }
        />
      )}
      {field.type !== "checkbox" && !rows && (
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
              state.map((g, gidx) => {
                if (gidx === group_index) {
                  if (g.rows) {
                    g.row_fields = g.row_fields?.map((r, ridx) => {
                      if (ridx === row_index) {
                        r.map((f, fidx) => {
                          if (f.unique) setUniqueError && setUniqueError("");
                          if (f.index) f.value = String(row_index + 1);
                          if (fidx === field_index) {
                            f.value = value[field.field];
                          }
                          return f;
                        });
                      }
                      return r;
                    });
                  } else {
                    g.group_fields = g.group_fields.map((f, fidx) => {
                      if (fidx === field_index) {
                        if (f.unique) setUniqueError && setUniqueError("");
                        f.value = value[field.field];
                      }
                      return f;
                    });
                  }
                }
                return g;
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
              state.map((g, gidx) => {
                if (gidx === group_index) {
                  if (g.rows) {
                    g.row_fields = g.row_fields?.map((r, ridx) => {
                      if (ridx === row_index) {
                        r.map((f, fidx) => {
                          if (f.unique) setUniqueError && setUniqueError("");
                          if (f.index) f.value = String(row_index + 1);
                          if (fidx === field_index) {
                            f.value = v.value;
                          }
                          return f;
                        });
                      }
                      return r;
                    });
                  } else {
                    g.group_fields = g.group_fields.map((f, fidx) => {
                      if (fidx === field_index) {
                        if (f.unique) setUniqueError && setUniqueError("");
                        f.value = v.value;
                      }
                      return f;
                    });
                  }
                }
                return g;
              })
            );
          }}
        />
      )}
      {field.type === "date" && (
        <DateInput
          required={field.required}
          tabIndex={field_index}
          value={field.value}
          onChange={(e) =>
            setState(
              state.map((g, gidx) => {
                if (gidx === group_index) {
                  if (g.rows) {
                    g.row_fields = g.row_fields?.map((r, ridx) => {
                      if (ridx === row_index) {
                        r.map((f, fidx) => {
                          if (f.unique) setUniqueError && setUniqueError("");
                          if (f.index) f.value = String(row_index + 1);
                          if (fidx === field_index) {
                            f.value = e.target.value;
                          }
                          return f;
                        });
                      }
                      return r;
                    });
                  } else {
                    g.group_fields = g.group_fields.map((f, fidx) => {
                      if (fidx === field_index) {
                        if (f.unique) setUniqueError && setUniqueError("");
                        f.value = e.target.value;
                      }
                      return f;
                    });
                  }
                }
                return g;
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
              state.map((g, gidx) => {
                if (gidx === group_index) {
                  if (g.rows) {
                    g.row_fields = g.row_fields?.map((r, ridx) => {
                      if (ridx === row_index) {
                        r.map((f, fidx) => {
                          if (f.unique) setUniqueError && setUniqueError("");
                          if (f.index) f.value = String(row_index + 1);
                          if (fidx === field_index) {
                            f.value = Number(e.target.value);
                          }
                          return f;
                        });
                      }
                      return r;
                    });
                  } else {
                    g.group_fields = g.group_fields.map((f, fidx) => {
                      if (fidx === field_index) {
                        if (f.unique) setUniqueError && setUniqueError("");
                        f.value = Number(e.target.value);
                      }
                      return f;
                    });
                  }
                }
                return g;
              })
            )
          }
          type={field.type}
          tabIndex={field_index}
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
                state.map((g, gidx) => {
                  if (gidx === group_index) {
                    if (g.rows) {
                      g.row_fields = g.row_fields?.map((r, ridx) => {
                        if (ridx === row_index) {
                          r.map((f, fidx) => {
                            if (f.unique) setUniqueError && setUniqueError("");
                            if (f.index) f.value = String(row_index + 1);
                            if (fidx === field_index) {
                              f.value = e.target.value;
                            }
                            return f;
                          });
                        }
                        return r;
                      });
                    } else {
                      g.group_fields = g.group_fields.map((f, fidx) => {
                        if (fidx === field_index) {
                          if (f.unique) setUniqueError && setUniqueError("");
                          f.value = e.target.value;
                        }
                        return f;
                      });
                    }
                  }
                  return g;
                })
              )
            }
            type={field.type}
            size={field.size}
            tabIndex={field_index}
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
              state.map((g, gidx) => {
                if (gidx === group_index) {
                  if (g.rows) {
                    g.row_fields = g.row_fields?.map((r, ridx) => {
                      if (ridx === row_index) {
                        r.map((f, fidx) => {
                          if (f.unique) setUniqueError && setUniqueError("");
                          if (f.index) f.value = String(row_index + 1);
                          if (fidx === field_index) {
                            f.value = e.target.value;
                          }
                          return f;
                        });
                      }
                      return r;
                    });
                  } else {
                    g.group_fields = g.group_fields.map((f, fidx) => {
                      if (fidx === field_index) {
                        if (f.unique) setUniqueError && setUniqueError("");
                        f.value = e.target.value;
                      }
                      return f;
                    });
                  }
                }
                return g;
              })
            )
          }
          tabIndex={field_index}
        />
      )}
    </div>
  );
};

export default Inputs;
