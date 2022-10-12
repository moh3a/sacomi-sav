import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircleIcon } from "@heroicons/react/outline";

import { PRIMARY_COLOR, TEXT_GRADIENT } from "../../lib/design";
import { trpc } from "../utils/trpc";
import Button from "./shared/Button";
import TextInput from "./shared/TextInput";
import Autocomplete from "./shared/Autocomplete";
import { Client } from "@prisma/client";
import Rows from "./shared/Rows";
import { selectCurrentId } from "../redux/currentIdSlice";
import { generate_new_id } from "../utils";
import Tabs from "./shared/Tabs";
import { PAGE_ARCHITECTURE } from "../../lib/config";
import Create from "./Create";
import { Collection } from "../types";

interface CreateProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateEntry = ({ setIsOpen }: CreateProps) => {
  const dispatch = useDispatch();

  // NEW ENTRY ID
  const { current_entries_id } = useSelector(selectCurrentId);
  const [id, setId] = useState(generate_new_id(current_entries_id));

  // CLIENT STATE
  const [query, setQuery] = useState("");
  const [client, setClient] = useState<Client | null | undefined>(undefined);
  const [data, setData] = useState<Client[] | null | undefined>([]);
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

  // FINISH UP AND CREATE
  const mutation = trpc.entries.create.useMutation();
  const createHandler = async (event: FormEvent) => {
    event.preventDefault();
    // let created_object: any = {};
    // Object.keys(state).forEach((field) => {
    //   if (state[field as keyof typeof state])
    //     created_object = {
    //       ...created_object,
    //       [field]: state[field as keyof typeof state],
    //     };
    // });
    // mutation?.mutateAsync(state, {
    //   onSettled(data, error) {
    //
    //   },
    // });
    setIsOpen(false);
  };

  return (
    <form onSubmit={createHandler}>
      <h2
        className={`uppercase text-xl font-bold text-center ${TEXT_GRADIENT} `}
      >
        Créer | Entrée
      </h2>

      <div className={`text-lg uppercase text-${PRIMARY_COLOR.light} `}>
        ID d&apos;entrée:{" "}
        <span className={`font-bold ${TEXT_GRADIENT} `}>{id}</span>
      </div>

      <div className={`text-lg uppercase text-${PRIMARY_COLOR.light} `}>
        Client
      </div>
      <Tabs
        tabs={[
          {
            title: "Client existant?",
            children: (
              <Autocomplete
                placeholder="Nom du client"
                displayValue="name"
                filteredResult={data}
                query={query}
                setQuery={setQuery}
                selected={client}
                setSelected={setClient}
              />
            ),
          },
          {
            title: "Créer un nouveau client!",
            children: (
              <Create
                title={PAGE_ARCHITECTURE.clients.title}
                collection={
                  PAGE_ARCHITECTURE.clients.collection as Collection["name"]
                }
                layout={PAGE_ARCHITECTURE.clients.create_layout}
              />
            ),
          },
        ]}
      />
      {client && (
        <div>
          {client.name} - {client.phone_number}
        </div>
      )}

      <div className={`text-lg uppercase text-${PRIMARY_COLOR.light} `}>
        Entrées
      </div>
      <Rows />

      <div className="flex justify-end items-center">
        <Button type="submit" variant="solid">
          Créer
        </Button>
      </div>
    </form>
  );
};

export default CreateEntry;
