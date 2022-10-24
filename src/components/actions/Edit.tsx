import {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ExclamationCircleIcon,
  SaveIcon,
  ExternalLinkIcon,
} from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { PAGE_ARCHITECTURE } from "../../../lib/config";
import { TEXT_GRADIENT } from "../design";
import Button from "../shared/Button";
import LoadingSpinner from "../shared/LoadingSpinner";
import TextInput from "../shared/TextInput";
import { selectSelectedId } from "../../redux/selectedIdSlice";
import { selectSelectedOne, select_one } from "../../redux/selectedOneSlice";
import { trpc } from "../../utils/trpc";
import NotificationsContext from "../../utils/NotificationsContext";
import { Collection, DataLayout } from "../../types";
import Inputs from "./Inputs";

interface EditProps {
  title: string;
  collection: Collection["name"];
  unit: Collection["unit"];
  layout: DataLayout[];
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const Edit = ({ collection, unit, title, setIsOpen, layout }: EditProps) => {
  const { selected_id } = useSelector(selectSelectedId);
  const { selected_one } = useSelector(selectSelectedOne);
  const dispatch = useDispatch();
  const router = useRouter();

  trpc[collection].byId.useQuery(
    { id: selected_id },
    {
      onSettled(data, error) {
        // @ts-ignore
        dispatch(select_one(data[unit as any]));
      },
    }
  );

  // EDIT CLIENT STATE
  const [uniqueField, setUniqueField] = useState("");
  const [edition, setEdition] = useState<any>({});
  // useEffect(() => {
  //   let s: any = {};
  //   if (PAGE_ARCHITECTURE[collection].create_layout && selected_one) {
  //     PAGE_ARCHITECTURE[collection].create_layout?.forEach((group) => {
  //       group.group_fields.forEach((field) => {
  //         s[field.field] = selected_one[field.field];
  //         if (field.unique) setUniqueField(field.field);
  //       });
  //     });
  //     s.id = selected_one.id;
  //   }
  //   setEdition(s);
  // }, [collection, selected_one]);

  const [uniqueError, setUniqueError] = useState("");
  const checkUniqueMutation = trpc[collection].checkExists.useMutation();
  const updateMutation = trpc[collection].update.useMutation();
  const notification = useContext(NotificationsContext);

  const [state, setState] = useState<(DataLayout | undefined)[]>();
  useEffect(() => {
    setState(
      layout && selected_one
        ? layout
            .map((group) => {
              if (!group.rows) {
                group.group_fields = group.group_fields.map((field) => {
                  field.value = selected_one[field.field];
                  if (field.unique) setUniqueField(field.field);
                  return field;
                });
                return group;
              } else return undefined;
            })
            .filter((e) => typeof e !== "undefined")
        : []
    );
  }, [layout, selected_one]);

  const editClient = async () => {
    // let itemExists = false;
    // if (uniqueField && edition[uniqueField] !== selected_one[uniqueField]) {
    //   await checkUniqueMutation.mutateAsync(
    //     // @ts-ignore
    //     { [uniqueField]: edition[uniqueField] },
    //     {
    //       onSettled(data) {
    //         if (data && data.exists) {
    //           setUniqueError(data.message);
    //           itemExists = true;
    //         } else {
    //           setUniqueError("");
    //           itemExists = false;
    //         }
    //       },
    //     }
    //   );
    // }
    // if (!itemExists) {
    //   await updateMutation.mutateAsync(edition, {
    //     onSettled(data: any, error: any) {
    //       if (error) notification?.error(error.message, 5000);
    //       if (data) {
    //         if (data.success) notification?.success(data.message, 5000);
    //         else notification?.error(data.message, 5000);
    //       }
    //       setIsOpen && setIsOpen(false);
    //     },
    //   });
    // }
  };

  return (
    <div>
      {selected_one ? (
        <div className="lg:flex">
          {/* start block */}
          <div className="my-4 mx-2 lg:flex-1">
            <h2
              className={`uppercase text-xl font-bold text-center ${TEXT_GRADIENT}`}
            >
              Modifier | {title}{" "}
              <Button
                type="button"
                onClick={() => router.push(`/${collection}/${selected_id}`)}
              >
                <ExternalLinkIcon
                  className="h-6 w-6 text-primary inline"
                  aria-hidden="true"
                />
              </Button>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-2">
              {state &&
                state.map((group, group_index) => (
                  <div key={group_index}>
                    {group && group.group_title && (
                      <div className={`text-lg uppercase text-primary`}>
                        {group.group_title}
                      </div>
                    )}
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
                          <Inputs
                            field={field}
                            field_index={field_index}
                            group_index={group_index}
                            state={state as DataLayout[]}
                            setState={setState as any}
                            setUniqueError={setUniqueError}
                          />
                        </Fragment>
                      ))}
                  </div>
                ))}
            </div>
            <div className="flex justify-end items-center">
              <Button type="button" variant="solid" onClick={editClient}>
                <SaveIcon className="h-5 w-5 inline mr-1" aria-hidden="true" />
                Modifier - {title}
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

export default Edit;
