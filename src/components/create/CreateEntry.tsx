import {
  Dispatch,
  FormEvent,
  Fragment,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useSelector } from "react-redux";
import {
  ExclamationCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import { Client } from "@prisma/client";

import { PAGE_ARCHITECTURE } from "../../../lib/config";
import { TEXT_GRADIENT } from "../design";
import Button from "../shared/Button";
import TextInput from "../shared/TextInput";
import Rows from "../shared/Rows";
import Tabs from "../shared/Tabs";
import LoadingSpinner from "../shared/LoadingSpinner";
import Autocomplete from "../shared/Autocomplete";
import { selectCurrentId } from "../../redux/currentIdSlice";
import { trpc } from "../../utils/trpc";
import { generate_new_id } from "../../utils";
import NotificationsContext from "../../utils/NotificationsContext";
import { Column } from "../../types";

interface CreateProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateEntry = ({ setIsOpen }: CreateProps) => {
  const [loading, setLoading] = useState(false);
  // NEW ENTRY ID
  const { current_entries_id } = useSelector(selectCurrentId);
  const id = generate_new_id(current_entries_id);

  // SELECTED CLIENT TAB: EXISTING OR CREATE NEW
  const [selectedTab, setSelectedTab] = useState(0);

  // EXISTING CLIENT STATE
  const [client, setClient] = useState<Client | null | undefined>(undefined);

  // NEW CLIENT STATE
  const get_client_state = () => {
    let s: any = {};
    PAGE_ARCHITECTURE.clients.create_layout.forEach((group) => {
      group.group_fields.forEach((field) => (s[field.field] = ""));
    });
    return s;
  };
  const [newClient, setNewClient] = useState(get_client_state());
  const [newClientError, setNewClientError] = useState("");
  const checkClientExistsMutations = trpc.clients.clientExists.useMutation();
  const checkClientExists = async () => {
    if (newClient.name) {
      await checkClientExistsMutations.mutateAsync(
        { name: newClient.name },
        {
          onSettled(data) {
            if (data && data.exists) setNewClientError("Client existe déjà.");
            else setNewClientError("");
          },
        }
      );
    }
  };

  // NAME ENTRIES
  const initial_product: Column[] = [
    {
      name: "N°",
      field: "entry_subid",
      value: "",
      index: true,
    },
    {
      name: "Modèle du produit",
      field: "product_model",
      collection: "products",
      value: "",
      autocomplete: true,
    },
    {
      name: "Désignation",
      field: "designation",
      value: "",
    },
    {
      name: "Garantie",
      field: "warranty",
      value: "",
    },
  ];
  const [products, setProducts] = useState([initial_product]);

  // FINISH UP AND CREATE
  const notification = useContext(NotificationsContext);
  const clientCreateMutation = trpc.clients.create.useMutation();
  const entryCreateMutation = trpc.entries.create.useMutation();
  const createHandler = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (selectedTab !== 0 && newClient.name && !newClientError) {
      await clientCreateMutation.mutateAsync(newClient, {
        onSettled(data) {
          if (data?.client) {
            setClient(data.client);
          } else setClient(undefined);
        },
      });
    }
    let client_name = "";
    if (selectedTab === 0 && client?.name) {
      client_name = client?.name;
    } else if (selectedTab === 1 && newClient.name) {
      client_name = newClient.name;
    }
    let created_products = products.map((product) => {
      let s: any = {};
      product.forEach((value) => {
        if (value.value) s[value.field] = value.value;
      });
      return s;
    });
    if (id && client_name && created_products[0].product_model) {
      await entryCreateMutation.mutateAsync(
        {
          entry_id: id,
          client_name: client_name,
          products: created_products,
        },
        {
          onSettled(data, error) {
            if (error) notification?.error(error.message, 5000);
            if (data) {
              if (data.success) notification?.success(data.message, 5000);
              else notification?.error(data.message, 5000);
              setIsOpen(false);
            }
            setLoading(false);
          },
        }
      );
    }
    setLoading(false);
  };

  return (
    <form onSubmit={createHandler}>
      <h2
        className={`uppercase text-xl font-bold text-center ${TEXT_GRADIENT} `}
      >
        Créer | Entrée
      </h2>

      <div className={`text-lg uppercase text-primary `}>
        ID d&apos;entrée:{" "}
        <span className={`font-bold ${TEXT_GRADIENT} `}>{id}</span>
      </div>

      <div className={`text-lg uppercase text-primary `}>Client</div>
      <Tabs
        setSelectedTab={setSelectedTab}
        tabs={[
          {
            title: "Client existant?",
            children: (
              <>
                <Autocomplete
                  placeholder="Nom du client"
                  displayValue="name"
                  collection="clients"
                  selected={client}
                  setSelected={setClient}
                />
                {client && (
                  <div>
                    {client.name} - {client.phone_number}
                  </div>
                )}
              </>
            ),
          },
          {
            title: "Créer un nouveau client!",
            children: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-2">
                {PAGE_ARCHITECTURE.clients.create_layout.map((group, index) => (
                  <div key={index}>
                    {group.group_title && (
                      <div className={`text-lg uppercase text-primary`}>
                        {group.group_title}
                      </div>
                    )}
                    {group.group_fields.map((field) => (
                      <Fragment key={field.field}>
                        {field.field === "name" && newClientError && (
                          <div className="font-bold text-red-600">
                            <ExclamationCircleIcon
                              className="h-4 w-4 inline mr-1"
                              aria-hidden="true"
                            />
                            {newClientError}
                          </div>
                        )}
                        <div className="my-4 mx-2 flex items-center">
                          <div className="w-36">{field.name}</div>
                          <TextInput
                            placeholder={field.name}
                            value={newClient[field.field]}
                            onChange={(e) => {
                              field.field === "name" && setNewClientError("");
                              setNewClient({
                                ...newClient,
                                [field.field]: e.target.value.toUpperCase(),
                              });
                            }}
                            onBlur={() =>
                              field.field === "name" && checkClientExists()
                            }
                          />
                        </div>
                      </Fragment>
                    ))}
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />

      <div className={`text-lg uppercase text-primary `}>Entrées</div>
      <Rows
        initial_state={initial_product}
        state={products}
        setState={setProducts}
      />

      <div className="flex justify-end items-center mt-6">
        <Button type="submit" variant="solid">
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <PlusCircleIcon
              className="h-5 w-5 inline mr-1"
              aria-hidden="true"
            />
          )}
          Créer entrée
        </Button>
      </div>
    </form>
  );
};

export default CreateEntry;
