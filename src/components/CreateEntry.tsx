import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { PlusCircleIcon } from "@heroicons/react/outline";

import { PRIMARY_COLOR, TEXT_GRADIENT } from "../../lib/design";
import { trpc } from "../utils/trpc";
import Button from "./shared/Button";
import TextInput from "./shared/TextInput";
import Autocomplete from "./shared/Autocomplete";
import { create_notification } from "../redux/notificationsSlice";
import { Client } from "@prisma/client";

interface CreateProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateEntry = ({ setIsOpen }: CreateProps) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    entry_id: "",
    entry_date: "",
    entry_time: "",
    warranty: "",
    global: "",
    observations: "",
  });
  const [query, setQuery] = useState("");
  const [client, setClient] = useState<Client | null | undefined>(undefined);
  const [data, setData] = useState<Client[] | null | undefined>([]);
  const mutation = trpc.entries.create.useMutation();

  const clientsMutations = trpc.clients.byUnique.useMutation();
  const fetchClients = useCallback(async () => {
    if (query) {
      await clientsMutations.mutateAsync(
        { name: query },
        {
          onSettled(data) {
            setData(data?.clients);
          },
        }
      );
    } else {
      setData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createHandler = async (event: FormEvent) => {
    event.preventDefault();
    let created_object: any = {};
    Object.keys(state).forEach((field) => {
      if (state[field as keyof typeof state])
        created_object = {
          ...created_object,
          [field]: state[field as keyof typeof state],
        };
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
        Créer | Entrée
      </h2>

      {/* grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-2">
        <div>
          <div className={`text-lg uppercase text-${PRIMARY_COLOR.light}`}>
            INFOS
          </div>

          <div className="my-4 mx-2 flex items-center">
            <div className="w-36">ID entrée</div>
            <TextInput
              placeholder="ID entrée"
              value={state.entry_id}
              onChange={(e) => setState({ ...state, entry_id: e.target.value })}
            />
          </div>

          <div className="my-4 mx-2 flex items-center">
            <div className="w-36">Nom du client</div>
            <Autocomplete
              placeholder="Nom du client"
              displayValue="name"
              filteredResult={data}
              query={query}
              setQuery={setQuery}
              selected={client}
              setSelected={setClient}
            />
          </div>
          {client && (
            <div>
              {client.name} - {client.phone_number}
            </div>
          )}
        </div>
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

export default CreateEntry;
