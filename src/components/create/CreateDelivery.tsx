import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";
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
import FindOrCreateClient from "./FindOrCreateClient";
import { TEXT_GRADIENT } from "../design";
import Inputs from "../Inputs";

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
      <FindOrCreateClient
        client={newClient}
        setClient={setNewClient}
        newClientError={newClientError}
        setNewClientError={setNewClientError}
        setSelectedTab={setSelectedTab}
      />

      <div className={`text-lg uppercase text-primary `}>Infos</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-2">
        <Inputs state={state} setState={setState} />
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
