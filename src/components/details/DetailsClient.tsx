import { Fragment, useContext, useEffect, useState } from "react";
import { ExclamationCircleIcon, SaveIcon } from "@heroicons/react/outline";
import { Client } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";

import { PAGE_ARCHITECTURE } from "../../../lib/config";
import { TEXT_GRADIENT } from "../design";
import Button from "../shared/Button";
import LoadingSpinner from "../shared/LoadingSpinner";
import TextInput from "../shared/TextInput";
import { selectSelectedId } from "../../redux/selectedIdSlice";
import { selectSelectedOne, select_client } from "../../redux/selectedOneSlice";
import { trpc } from "../../utils/trpc";
import NotificationsContext from "../../utils/NotificationsContext";

const DetailsClient = () => {
  const { selected_id } = useSelector(selectSelectedId);
  const { selected_client }: { selected_client: Client } =
    useSelector(selectSelectedOne);
  const dispatch = useDispatch();

  trpc.clients.byId.useQuery(
    { id: selected_id },
    {
      onSettled(data, error) {
        dispatch(select_client(data?.client));
      },
    }
  );

  // EDIT CLIENT STATE
  const [newClient, setNewClient] = useState<any>({});
  useEffect(() => {
    let s: any = {};
    if (PAGE_ARCHITECTURE.clients.create_layout)
      PAGE_ARCHITECTURE.clients.create_layout.forEach((group) => {
        group.group_fields.forEach(
          (field) =>
            (s[field.field] = selected_client[field.field as keyof Client])
        );
      });
    s.id = selected_client.id;
    setNewClient(s);
  }, [selected_client]);

  const [newClientError, setNewClientError] = useState("");
  const checkClientExistsMutations = trpc.clients.checkExists.useMutation();
  const updateClientMutation = trpc.clients.update.useMutation();
  const notification = useContext(NotificationsContext);

  const editClient = async () => {
    let clientExists = false;
    if (newClient.name) {
      await checkClientExistsMutations.mutateAsync(
        { name: newClient.name },
        {
          onSettled(data) {
            if (data && data.exists) {
              setNewClientError(data.message);
              clientExists = true;
            } else {
              setNewClientError("");
              clientExists = false;
            }
          },
        }
      );
    }
    if (!clientExists) {
      await updateClientMutation.mutateAsync(newClient, {
        onSettled(data, error) {
          if (error) notification?.error(error.message, 5000);
          if (data) {
            if (data.success) notification?.success(data.message, 5000);
            else notification?.error(data.message, 5000);
          }
        },
      });
    }
  };

  return (
    <div>
      {selected_client ? (
        <div className="lg:flex">
          {/* start block */}
          <div className="my-4 mx-2 lg:flex-1">
            <h2
              className={`uppercase text-xl font-bold text-center ${TEXT_GRADIENT}`}
            >
              Modifier | Client
            </h2>
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
                            value={newClient[field.field]}
                            onChange={(e) => {
                              field.field === "name" && setNewClientError("");
                              setNewClient({
                                ...newClient,
                                [field.field]: e.target.value.toUpperCase(),
                              });
                            }}
                          />
                        </div>
                      </Fragment>
                    ))}
                  </div>
                ))}
            </div>
            <div className="flex justify-end items-center">
              <Button type="button" variant="solid" onClick={editClient}>
                <SaveIcon className="h-5 w-5 inline mr-1" aria-hidden="true" />
                Modifier le client
              </Button>
            </div>
          </div>
          {/* end block */}
        </div>
      ) : (
        <LoadingSpinner size="large" />
      )}
    </div>
  );
};

export default DetailsClient;
