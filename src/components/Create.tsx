import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";

import { PRIMARY_COLOR, TEXT_GRADIENT } from "../../lib/design";
import Button from "./shared/Button";
import TextInput from "./shared/TextInput";
import { trpc } from "../utils/trpc";
import { useDispatch } from "react-redux";
import { create_notification } from "../redux/notificationsSlice";

interface CreateProps {
  title: string;
  collection?:
    | "clients"
    | "entries"
    | "deliveries"
    | "products"
    | "jobs"
    | "prestations"
    | "users"
    | "orders";
  layout: {
    group_title?: string;
    group_fields: {
      name: string;
      field: string;
    }[];
  }[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Create = ({ title, collection, layout, setIsOpen }: CreateProps) => {
  const dispatch = useDispatch();
  const mutation = collection && trpc[collection].create.useMutation();
  const get_state = () => {
    let s: any = {};
    layout.forEach((group) => {
      group.group_fields.forEach((field) => (s[field.field] = ""));
    });
    return s;
  };

  const [state, setState] = useState(get_state());

  const createHandler = async (event: FormEvent) => {
    event.preventDefault();
    let created_object: any = {};
    Object.keys(state).forEach((field) => {
      if (state[field])
        created_object = { ...created_object, [field]: state[field] };
    });
    mutation?.mutateAsync(state, {
      onSettled(data, error) {
        if (error)
          dispatch(
            create_notification({ type: "error", message: error.message })
          );
        if (data) {
          if (data.success) {
            dispatch(
              create_notification({ type: "success", message: data?.message })
            );
          } else {
            dispatch(
              create_notification({ type: "error", message: data?.message })
            );
          }
        }
      },
    });
    setIsOpen(false);
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
              <div className={`text-lg uppercase text-${PRIMARY_COLOR.light}`}>
                {group.group_title}
              </div>
            )}
            {group.group_fields.map((field) => (
              <div key={field.field} className="my-4 mx-2 flex items-center">
                <div className="w-36">{field.name}</div>
                <TextInput
                  placeholder={field.name}
                  value={state[field.field]}
                  onChange={(e) =>
                    setState({ ...state, [field.field]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* end grid */}

      <div className="flex justify-end items-center">
        <Button type="submit" variant="solid">
          <PlusCircleIcon className="h-5 w-5 inline" aria-hidden="true" />
          Créer
        </Button>
      </div>
    </form>
  );
};

export default Create;
