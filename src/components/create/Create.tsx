import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";

import { TEXT_GRADIENT } from "../design";
import Button from "../shared/Button";
import TextInput from "../shared/TextInput";
import { trpc } from "../../utils/trpc";
import { useSelector } from "react-redux";
import { generate_new_id } from "../../utils";
import { selectCurrentId } from "../../redux/currentIdSlice";
import NotificationsContext from "../../utils/NotificationsContext";
import { Collection, Column } from "../../types";
import NumberInput from "../shared/NumberInput";
import RadioInput from "../shared/RadioInput";
import DateInput from "../shared/DateInput";
import Checkbox from "../shared/Checkbox";
import PasswordInput from "../shared/PasswordInput";

interface CreateProps {
  title: string;
  collection: Collection["name"];
  layout: {
    group_title?: string;
    group_fields: Column[];
  }[];
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const Create = ({ title, collection, layout, setIsOpen }: CreateProps) => {
  const currentId = useSelector(selectCurrentId);
  const mutation = collection && trpc[collection].create.useMutation();
  const get_state = () => {
    let s: any = {};
    layout.forEach((group) => {
      group.group_fields.forEach((field) => {
        if (field.autogenerated)
          s[field.field] = generate_new_id(
            currentId[`current_${collection}_id`]
          );
        else if (field.type === "number") s[field.field] = 0;
        else s[field.field] = "";
      });
    });
    return s;
  };

  const [state, setState] = useState(get_state());

  const notification = useContext(NotificationsContext);
  const createHandler = async (event: FormEvent) => {
    event.preventDefault();
    let created_object: any = {};
    Object.keys(state).forEach((field) => {
      if (state[field])
        created_object = { ...created_object, [field]: state[field] };
    });
    mutation?.mutateAsync(state, {
      onSettled(data, error) {
        if (error) notification?.error(error.message, 5000);
        if (data) {
          if (data.success) notification?.success(data.message, 5000);
          else notification?.error(data.message, 5000);
        }
      },
    });
    setIsOpen && setIsOpen(false);
  };

  return (
    <form onSubmit={createHandler}>
      <h2
        className={`uppercase text-xl font-bold text-center ${TEXT_GRADIENT}`}
      >
        Créer | {title}
      </h2>

      {/* grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-2">
        {layout.map((group, index) => (
          <div key={index}>
            {group.group_title && (
              <div className={`text-lg uppercase text-primary`}>
                {group.group_title}
              </div>
            )}
            {group.group_fields.map((field) => (
              <div key={field.field} className="my-4 mx-2 flex items-center">
                <div className="w-36">{field.name}</div>
                {field.type === "date" && (
                  <DateInput
                    value={state[field.field]}
                    onChange={(e) =>
                      setState({
                        ...state,
                        [field.field]: e.target.value,
                      })
                    }
                    readOnly={field.autogenerated || field.index}
                    min={"2005-01-01"}
                    max={new Date().toISOString().substring(0, 10)}
                  />
                )}
                {field.type === "checkbox" && (
                  <Checkbox
                    checked={state[field.field] ? true : false}
                    label={field.name}
                    readOnly={field.autogenerated || field.index}
                    onChange={(e) =>
                      setState({ ...state, [field.field]: e.target.checked })
                    }
                  />
                )}
                {field.type === "radio" && field.options && (
                  <RadioInput
                    options={field.options}
                    selected={
                      field.options[
                        field.options.findIndex(
                          (e) => e.value === state[field.field]
                        )
                      ]
                    }
                    setSelected={(v) => {
                      setState({ ...state, [field.field]: v.value });
                    }}
                  />
                )}
                {field.type === "number" && (
                  <NumberInput
                    placeholder={field.name}
                    value={state[field.field]}
                    readOnly={field.autogenerated || field.index}
                    onChange={(e) =>
                      setState({
                        ...state,
                        [field.field]: Number(e.target.value),
                      })
                    }
                    type={field.type}
                  />
                )}
                {field.type === "password" && (
                  <PasswordInput
                    placeholder={field.name}
                    value={state[field.field]}
                    readOnly={field.autogenerated || field.index}
                    onChange={(e) =>
                      setState({
                        ...state,
                        [field.field]: e.target.value,
                      })
                    }
                  />
                )}
                {(!field.type || field.type === "text") && (
                  <TextInput
                    placeholder={field.name}
                    value={state[field.field]}
                    readOnly={field.autogenerated || field.index}
                    onChange={(e) =>
                      setState({ ...state, [field.field]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* end grid */}

      <div className="flex justify-end items-center">
        <Button type="submit" variant="solid">
          <PlusCircleIcon className="h-5 w-5 inline mr-1" aria-hidden="true" />
          Créer {title}
        </Button>
      </div>
    </form>
  );
};

export default Create;
