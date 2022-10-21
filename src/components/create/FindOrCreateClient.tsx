import { ExclamationCircleIcon } from "@heroicons/react/outline";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import { trpc } from "../../utils/trpc";
import Autocomplete from "../shared/Autocomplete";
import Tabs from "../shared/Tabs";
import TextInput from "../shared/TextInput";

interface FindOrCreateClientProps {
  client: any;
  setClient: Dispatch<SetStateAction<any>>;
  newClientError: string;
  setNewClientError: Dispatch<SetStateAction<string>>;
  setSelectedTab: Dispatch<SetStateAction<number>>;
}

const FindOrCreateClient = ({
  client,
  newClientError,
  setClient,
  setNewClientError,
  setSelectedTab,
}: FindOrCreateClientProps) => {
  const checkClientExistsMutations = trpc.clients.checkExists.useMutation();
  const checkClientExists = async () => {
    if (client.name) {
      await checkClientExistsMutations.mutateAsync(
        { name: client.name },
        {
          onSettled(data) {
            if (data && data.exists) setNewClientError("Client existe déjà.");
            else setNewClientError("");
          },
        }
      );
    }
  };

  return (
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
                PAGE_ARCHITECTURE.clients.create_layout.map((group, index) => (
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
                            value={client[field.field]}
                            onChange={(e) => {
                              field.field === "name" && setNewClientError("");
                              setClient({
                                ...client,
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
  );
};

export default FindOrCreateClient;
