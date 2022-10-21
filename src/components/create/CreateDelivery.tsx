import {
  Dispatch,
  FormEvent,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ExclamationCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import { Client } from "@prisma/client";

import { PAGE_ARCHITECTURE } from "../../../lib/config";
import { selectCurrentId } from "../../redux/currentIdSlice";
import { Column } from "../../types";
import { generate_new_id } from "../../utils";
import { trpc } from "../../utils/trpc";
import NotificationsContext from "../../utils/NotificationsContext";
import Button from "../shared/Button";
import LoadingSpinner from "../shared/LoadingSpinner";
import TextInput from "../shared/TextInput";
import Autocomplete from "../shared/Autocomplete";
import Tabs from "../shared/Tabs";
import { TEXT_GRADIENT } from "../design";
import Checkbox from "../shared/Checkbox";
import DateInput from "../shared/DateInput";
import Textarea from "../shared/Textarea";

interface CreateProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateDelivery = ({ setIsOpen }: CreateProps) => {
  const [loading, setLoading] = useState(false);
  // NEW DELIVERY ID
  const { current_deliveries_id } = useSelector(selectCurrentId);
  const id = generate_new_id(current_deliveries_id);

  // SELECTED CLIENT TAB: EXISTING OR CREATE NEW
  const [selectedTab, setSelectedTab] = useState(0);

  // EXISTING CLIENT STATE
  const [client, setClient] = useState<Client | null | undefined>(undefined);

  // NEW CLIENT STATE
  const get_client_state = () => {
    let s: any = {};
    if (PAGE_ARCHITECTURE.clients.create_layout)
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

  // PRESTATION CREATION STATE
  const delivery_state: Column[] = [
    {
      name: "ID de l'entrée",
      field: "entry_id",
      value: "",
    },
    {
      name: "Contenu",
      field: "content",
      value: "",
      textarea: true,
    },
    {
      name: "Date de livraison",
      field: "delivery_date_1",
      value: "",
      type: "date",
    },
    {
      name: "ID de sortie SAGE",
      field: "sage_exit_id",
      value: "",
    },
    {
      name: "Observations",
      field: "observations",
      value: "",
      textarea: true,
    },
  ];
  const [state, setState] = useState(delivery_state);

  // FINISH UP AND CREATE
  const notification = useContext(NotificationsContext);
  const clientCreateMutation = trpc.clients.create.useMutation();
  const deliveryCreateMutation = trpc.deliveries.create.useMutation();
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

    let created_delivery: any = {};
    state.forEach((field) => {
      if (field.value) created_delivery[field.field] = field.value;
    });

    if (id && client_name) {
      console.log(id, client_name, created_delivery);
      await deliveryCreateMutation.mutateAsync(
        {
          delivery_id: id,
          client_name: client_name,
          ...created_delivery,
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
        Créer | Bon de livraison
      </h2>

      <div className={`text-lg uppercase text-primary `}>
        ID de la livraison:{" "}
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
                {PAGE_ARCHITECTURE.clients.create_layout &&
                  PAGE_ARCHITECTURE.clients.create_layout.map(
                    (group, index) => (
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
                                  field.field === "name" &&
                                    setNewClientError("");
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
                    )
                  )}
              </div>
            ),
          },
        ]}
      />

      <div className={`text-lg uppercase text-primary `}>Infos</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-2">
        {state.map((field, index) => (
          <div key={field.field} className="flex items-center">
            {field.type === "checkbox" && (
              <Checkbox
                checked={field.value ? true : false}
                label={field.name}
                tabIndex={index}
                onChange={(e) =>
                  setState(
                    state.map((f, i) => {
                      if (i === index) f.value = e.target.checked;
                      return f;
                    })
                  )
                }
              />
            )}
            {field.type === "date" && (
              <>
                <div className={field.size ? "" : "w-36"}>{field.name}</div>
                <DateInput
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
              </>
            )}
            {(!field.type || field.type === "text") &&
              !field.autocomplete &&
              !field.textarea && (
                <>
                  <div className={field.size ? "" : "w-36"}>{field.name}</div>
                  <TextInput
                    placeholder={field.name}
                    value={field.value}
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
                </>
              )}
            {field.textarea && (
              <>
                <div className={field.size ? "" : "w-36"}>{field.name}</div>
                <Textarea
                  placeholder={field.name}
                  value={field.value}
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
              </>
            )}
          </div>
        ))}
      </div>

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
          Créer le bon de livraison
        </Button>
      </div>
    </form>
  );
};

export default CreateDelivery;
