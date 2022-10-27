import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import { Client } from "@prisma/client";

import { PAGE_ARCHITECTURE } from "../../../lib/config";
import { TEXT_GRADIENT } from "../design";
import FindOrCreateClient from "./FindOrCreateClient";
import LoadingSpinner from "../shared/LoadingSpinner";
import Button from "../shared/Button";
import Inputs from "./Inputs";
import Rows from "./Rows";
import { selectCurrentId } from "../../redux/currentIdSlice";
import { trpc } from "../../utils/trpc";
import { generate_new_id } from "../../utils";
import NotificationsContext from "../../utils/NotificationsContext";
import { Collection, DataLayout } from "../../types";

interface CreateProps {
  title: string;
  collection: Collection["name"];
  layout: DataLayout[];
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const Create = ({ title, collection, layout, setIsOpen }: CreateProps) => {
  const [loading, setLoading] = useState(false);
  const currentId = useSelector(selectCurrentId);
  const notification = useContext(NotificationsContext);
  const mutation = collection && trpc[collection].create.useMutation();

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
  const clientCreateMutation = trpc.clients.create.useMutation();

  const [state, setState] = useState<(DataLayout | undefined)[]>();

  useEffect(() => {
    setState(
      layout
        .map((group) => {
          group.group_fields = group.group_fields.map((field) => {
            if (field.autogenerated)
              field.value = generate_new_id(
                currentId[`current_${collection}_id`]
              );
            else if (field.type === "number") field.value = 0;
            else field.value = "";
            return field;
          });
          if (group.rows && group.rows_collection) {
            let fields = JSON.parse(JSON.stringify(group.group_fields));
            group.row_fields = [fields];
            return group;
          }
          return group;
        })
        .filter((e) => typeof e !== "undefined")
    );
  }, [collection, currentId, layout]);

  const createHandler = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    let rows: any[] = [];
    let client_name = "";
    let input: any = {};
    if (state) {
      state.forEach(async (group) => {
        if (group) {
          if (group.rows && group.row_fields) {
            group.row_fields.forEach((row) => {
              let r: any = {};
              row.forEach((field) => {
                if (field.value) r[field.field] = field.value;
              });
              rows.push(r);
            });
          } else if (group.findOrCreateClient) {
            if (selectedTab !== 0 && newClient.name && !newClientError) {
              await clientCreateMutation.mutateAsync(newClient, {
                onSettled(data) {
                  if (data?.client) {
                    setClient(data.client);
                  } else setClient(undefined);
                },
              });
            }
            if (selectedTab === 0 && client?.name) client_name = client?.name;
            else if (selectedTab === 1 && newClient.name)
              client_name = newClient.name;
          } else {
            group.group_fields.forEach((field) => {
              if (field.value) input[field.field] = field.value;
            });
          }
        }
      });
    }
    if (client_name) input = { ...input, client_name };
    if (rows.length > 0) input = { ...input, rows };
    await mutation.mutateAsync(input, {
      onSettled(data, error) {
        if (error) notification?.error(error.message, 5000);
        if (data) {
          if (data.success) {
            notification?.success(data.message, 5000);
            setState(
              layout
                .map((group) => {
                  group.group_fields = group.group_fields.map((field) => {
                    if (field.autogenerated) {
                      field.value = generate_new_id(
                        currentId[`current_${collection}_id`]
                      );
                    } else if (field.type === "number") {
                      field.value = 0;
                    } else field.value = "";
                    return field;
                  });
                  return group;
                })
                .flat()
                .filter((e) => typeof e !== "undefined")
            );
          } else notification?.error(data.message, 5000);
          setIsOpen && setIsOpen(false);
        }
        setLoading(false);
      },
    });
    setLoading(false);
  };

  return (
    <form onSubmit={createHandler}>
      <h2
        className={`uppercase text-xl font-bold text-center ${TEXT_GRADIENT}`}
      >
        Créer | {title}
      </h2>

      {state &&
        state.map((group, group_index) => (
          <div key={group_index}>
            {group && group.group_title && (
              <div className={`text-lg uppercase text-primary`}>
                {group.group_title}
              </div>
            )}
            {group && group.findOrCreateClient && (
              <FindOrCreateClient
                client={client}
                setClient={setClient}
                newClient={newClient}
                setNewClient={setNewClient}
                newClientError={newClientError}
                setNewClientError={setNewClientError}
                setSelectedTab={setSelectedTab}
              />
            )}
            {group && group.rows && (
              <Rows
                action="create"
                state={state as DataLayout[]}
                setState={setState as any}
              />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-2">
              {group &&
                !group.findOrCreateClient &&
                !group.rows &&
                group.group_fields.map((field, field_index) => (
                  <Inputs
                    key={field_index}
                    field={field}
                    field_index={field_index}
                    group_index={group_index}
                    state={state as DataLayout[]}
                    setState={setState as any}
                  />
                ))}
            </div>
          </div>
        ))}

      <div className="flex justify-end items-center">
        <Button type="submit" variant="solid">
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <PlusCircleIcon
              className="h-5 w-5 inline mr-1"
              aria-hidden="true"
            />
          )}
          Créer {title}
        </Button>
      </div>
    </form>
  );
};

export default Create;
