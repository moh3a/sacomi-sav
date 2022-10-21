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
import Rows from "../shared/Rows";
import { TEXT_GRADIENT } from "../design";
import Inputs from "../Inputs";
import FindOrCreateClient from "./FindOrCreateClient";

interface CreateProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CreatePrestation = ({ setIsOpen }: CreateProps) => {
  const [loading, setLoading] = useState(false);
  // NEW ENTRY ID
  const { current_prestations_id } = useSelector(selectCurrentId);
  const id = generate_new_id(current_prestations_id);

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

  // ENTER PRESTATION DETAILS
  const initial_service: Column[] = [
    {
      name: "Désignation",
      field: "designation",
      value: "",
      type: "text",
    },
    {
      name: "Quantité",
      field: "quantity",
      value: "",
      size: 4,
      type: "number",
    },
    {
      name: "HT",
      field: "price_ht",
      value: "",
      type: "number",
    },
    {
      name: "TTC",
      field: "price_ttc",
      value: "",
      type: "number",
    },
    {
      name: "Sous-total",
      field: "subtotal",
      value: "",
      type: "number",
    },
  ];
  const [services, setServices] = useState([initial_service]);

  // PRESTATION CREATION STATE
  const prestation_state: Column[] = [
    {
      name: "Payé",
      field: "is_paid",
      value: "",
      type: "checkbox",
    },
    {
      name: "A facturer",
      field: "to_bill",
      value: "",
      type: "checkbox",
    },
    {
      name: "Date d'encaissement",
      field: "payment_date",
      value: "",
      type: "date",
    },
    {
      name: "Date de récupération",
      field: "recovery_date",
      value: "",
      type: "date",
    },
    {
      name: "Facture",
      field: "invoice",
      value: "",
    },
  ];
  const [state, setState] = useState(prestation_state);

  // FINISH UP AND CREATE
  const notification = useContext(NotificationsContext);
  const clientCreateMutation = trpc.clients.create.useMutation();
  const prestationCreateMutation = trpc.prestations.create.useMutation();
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
    let created_services = services.map((service) => {
      let s: any = {};
      service.forEach((value) => {
        if (value.value) s[value.field] = value.value;
      });
      return s;
    });

    let created_prestation: any = {};
    state.forEach((field) => {
      if (field.value) created_prestation[field.field] = field.value;
    });

    if (id && client_name && created_services[0].designation) {
      console.log(id, client_name, created_services, created_prestation);
      await prestationCreateMutation.mutateAsync(
        {
          prestation_id: id,
          client_name: client_name,
          services: created_services,
          ...created_prestation,
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
        Créer | Prestation
      </h2>

      <div className={`text-lg uppercase text-primary `}>
        ID de la prestation:{" "}
        <span className={`font-bold ${TEXT_GRADIENT} `}>{id}</span>
      </div>

      <div className={`text-lg uppercase text-primary `}>Client</div>
      <FindOrCreateClient
        client={newClient}
        setClient={setNewClient}
        setNewClientError={setNewClientError}
        newClientError={newClientError}
        setSelectedTab={setSelectedTab}
      />

      <div className={`text-lg uppercase text-primary `}>Services</div>
      <Rows
        initial_state={initial_service}
        state={services}
        setState={setServices}
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
          Créer la prestation
        </Button>
      </div>
    </form>
  );
};

export default CreatePrestation;
