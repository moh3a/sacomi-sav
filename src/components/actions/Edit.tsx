import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import {
  ExclamationCircleIcon,
  SaveIcon,
  ExternalLinkIcon,
} from "@heroicons/react/outline";
import { Client } from "@prisma/client";

import { TEXT_GRADIENT } from "../design";
import Button from "../shared/Button";
import LoadingSpinner from "../shared/LoadingSpinner";
import Inputs from "./Inputs";
import Rows from "./Rows";
import { trpc } from "../../utils/trpc";
import {
  CollectionsBaseUnit,
  CollectionsNames,
  Column,
  DataLayout,
} from "../../types";
import Autocomplete from "../shared/Autocomplete";
import { useNotificationStore, useSelectedStore } from "../../utils/store";
import Link from "next/link";

interface EditProps {
  title: string;
  collection: CollectionsNames;
  unit: CollectionsBaseUnit;
  url: string;
  layout: DataLayout[];
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const Edit = ({
  collection,
  unit,
  url,
  title,
  setIsOpen,
  layout,
}: EditProps) => {
  const [loading, setLoading] = useState(false);
  const { selected, set_selected_one } = useSelectedStore();

  trpc[collection].byId.useQuery(
    // @ts-ignore
    { id: selected[collection]?.id ?? "oops" },
    {
      onSettled(data, error) {
        // @ts-ignore
        set_selected_one({ collection, one: data[unit] });
      },
    }
  );

  // TO UPDATE A CLIENT IF EXISTS
  const [client, setClient] = useState<Client | null | undefined>(undefined);
  const [rowsData, setRowsData] = useState<any>();
  trpc[
    layout.find((e) => e.rows_collection)?.rows_collection ?? "jobs"
  ].byRelationId.useQuery(
    {
      // @ts-ignore
      id: selected[collection]?.id,
    },
    {
      onSettled(data) {
        setRowsData(data?.rows);
      },
    }
  );

  const [state, setState] = useState<(DataLayout | undefined)[]>();
  useEffect(() => {
    setState(
      layout && selected[collection]?.one
        ? layout
            .map((group) => {
              if (
                group.rows &&
                group.group_fields &&
                group.rows_collection &&
                rowsData
              ) {
                group.row_fields = rowsData.map((row: any) => {
                  let fields = JSON.parse(JSON.stringify(group.group_fields));
                  let data = fields.map((field: Column) => {
                    if (field.unit && row[field.unit])
                      field.value = row[field.unit][field.field];
                    else if (field.type === "number")
                      field.value = Number(row[field.field]) ?? 0;
                    else field.value = row[field.field] ?? "";
                    return field;
                  });
                  return data;
                });
                return group;
              } else if (!group.rows) {
                group.group_fields = group.group_fields.map((field) => {
                  if (field.unique) setUniqueField(field.field);
                  if (field.unit && selected[collection]?.one[field.unit]) {
                    if (field.type === "number")
                      field.value =
                        Number(
                          selected[collection]?.one[field.unit][field.field]
                        ) ?? 0;
                    else if (field.type === "date")
                      field.value = selected[collection]?.one[field.unit][
                        field.field
                      ]
                        ? selected[collection]?.one[field.unit][field.field]
                            .toISOString()
                            .substring(0, 10)
                        : "";
                    else
                      field.value =
                        selected[collection]?.one[field.unit][field.field] ??
                        "";
                  } else if (field.type === "number")
                    field.value =
                      Number(selected[collection]?.one[field.field]) ?? 0;
                  else if (field.type === "date")
                    field.value = selected[collection]?.one[field.field]
                      ? selected[collection]?.one[field.field]
                          .toISOString()
                          .substring(0, 10)
                      : "";
                  else
                    field.value = selected[collection]?.one[field.field] ?? "";
                  return field;
                });
                return group;
              } else return undefined;
            })
            .filter((e) => typeof e !== "undefined")
        : []
    );
  }, [collection, layout, rowsData, selected]);

  useEffect(() => {
    if (selected[collection]?.one && selected[collection]?.one.client)
      setClient(selected[collection]?.one.client);
  }, [collection, selected]);

  const [uniqueField, setUniqueField] = useState("");
  const [uniqueError, setUniqueError] = useState("");
  const checkUniqueMutation = trpc[collection].checkExists.useMutation();
  const updateMutation = trpc[collection].update.useMutation();
  const notification = useNotificationStore();
  const editClient = async () => {
    setLoading(true);
    let itemExists = false;
    let uniqueValue = "";
    layout.forEach((group) => {
      group.group_fields.forEach((field) => {
        if (field.field === uniqueField) uniqueValue = field.value;
      });
    });
    if (
      uniqueField &&
      uniqueValue &&
      uniqueValue !== selected[collection]?.one[uniqueField]
    ) {
      await checkUniqueMutation.mutateAsync(
        // @ts-ignore
        { [uniqueField]: uniqueValue },
        {
          onSettled(data) {
            if (data && data.exists) {
              setUniqueError(data.message);
              itemExists = true;
            } else {
              setUniqueError("");
              itemExists = false;
            }
          },
        }
      );
    }
    let rows: any[] = [];
    let client_name = "";
    let input: any = {};
    if (state) {
      state.forEach(async (group) => {
        if (group) {
          if (group.rows && group.row_fields) {
            group.row_fields.forEach((row, row_index) => {
              let r: any = {};
              row.forEach((field) => {
                r.id =
                  rowsData[row_index] && rowsData[row_index].id
                    ? rowsData[row_index].id
                    : undefined;
                if (field.value || field.value === false)
                  r[field.field] = field.value;
              });
              rows.push(r);
            });
          } else if (group.findOrCreateClient && client?.name) {
            client_name = client?.name;
          } else {
            group.group_fields.forEach((field) => {
              if (field.value || field.value === false)
                input[field.field] = field.value;
            });
          }
        }
      });
    }
    if (client_name) input = { ...input, client_name };
    if (rows.length > 0) input = { ...input, rows };
    if (collection === "jobs")
      input = { ...input, job_id: selected[collection]?.one.job_id };
    input = { ...input, id: selected[collection]?.id };
    if (!itemExists) {
      await updateMutation.mutateAsync(input, {
        onSettled(data: any, error: any) {
          if (error) notification.error(error.message, 5000);
          if (data) {
            if (data.success) notification.success(data.message, 5000);
            else notification.error(data.message, 5000);
          }
          setIsOpen && setIsOpen(false);
          setLoading(false);
        },
      });
    }
    setLoading(false);
  };

  return (
    <div>
      {selected[collection]?.one ? (
        <div className="lg:flex">
          <div className="my-4 mx-2 lg:flex-1">
            <h2
              className={`uppercase text-xl font-bold text-center ${TEXT_GRADIENT}`}
            >
              Modifier | {title}{" "}
              <Link href={`${url}/${selected[collection]?.id}`}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen && setIsOpen(false)}
                >
                  <Button type="button">
                    <ExternalLinkIcon
                      className="h-6 w-6 text-primary inline"
                      aria-hidden="true"
                    />
                  </Button>
                </a>
              </Link>
            </h2>

            {state &&
              state.map((group, group_index) => (
                <div key={group_index} className="mb-6">
                  {group && group.group_title && (
                    <div
                      className={`border-b border-primaryLight dark:border-primaryDark text-lg uppercase text-primary`}
                    >
                      {group.group_title}
                    </div>
                  )}
                  {group && group.findOrCreateClient && (
                    <>
                      <Autocomplete
                        placeholder="Nom du client"
                        displayValue="name"
                        collection="clients"
                        selected={client}
                        setSelected={setClient}
                      />
                      {client && (
                        <a
                          href={`/clients/${client.id}`}
                          target={"_blank"}
                          rel="noreferrer"
                          className="text-xs"
                        >
                          Modifi?? {client.name}{" "}
                          <ExternalLinkIcon
                            className="h-4 w-4 text-primary inline"
                            aria-hidden="true"
                          />
                        </a>
                      )}
                    </>
                  )}
                  {group && group.rows && (
                    <Rows
                      action="edit"
                      state={state as DataLayout[]}
                      setState={setState as any}
                    />
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-2 gap-x-2">
                    {group &&
                      !group.rows &&
                      !group.findOrCreateClient &&
                      group.group_fields.map((field, field_index) => (
                        <Fragment key={field.field}>
                          {field.field === uniqueField && uniqueError && (
                            <div className="font-bold text-red-600">
                              <ExclamationCircleIcon
                                className="h-4 w-4 inline mr-1"
                                aria-hidden="true"
                              />
                              {uniqueError}
                            </div>
                          )}
                          <div>
                            <Inputs
                              field={field}
                              field_index={field_index}
                              group_index={group_index}
                              state={state as DataLayout[]}
                              setState={setState as any}
                              setUniqueError={setUniqueError}
                            />
                            {field.collection && field.unique && field.value && (
                              <a
                                href={`/${field.collection}?${
                                  field.field
                                }=${String(field.value).replace(" ", "+")}`}
                                target={"_blank"}
                                rel="noreferrer"
                                className="text-xs"
                              >
                                Modifi?? {field.value}{" "}
                                <ExternalLinkIcon
                                  className="h-4 w-4 text-primary inline"
                                  aria-hidden="true"
                                />
                              </a>
                            )}
                          </div>
                        </Fragment>
                      ))}
                  </div>
                </div>
              ))}
            <div className="mt-6 flex justify-end items-center">
              <Button type="button" variant="solid" onClick={editClient}>
                {loading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <SaveIcon
                    className="h-5 w-5 inline mr-1"
                    aria-hidden="true"
                  />
                )}
                Modifier - {title}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <LoadingSpinner size="large" />
      )}
    </div>
  );
};

export default Edit;
