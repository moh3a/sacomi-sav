/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";

import { SHADOW } from "../design";
import { CollectionsNames, TableTitle } from "../../types";
import Badge from "./Badge";
import { useSelectedStore } from "../../utils/store";

interface TableProps {
  titles: TableTitle[];
  data: any[][];
  compact?: boolean;
  scrollable?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  link?: string;
  collection?: CollectionsNames;
}

const Table = ({
  titles,
  data,
  compact,
  scrollable,
  setIsOpen,
  link,
  collection,
}: TableProps) => {
  const router = useRouter();
  const { set_selected_id } = useSelectedStore();

  const [imageFieldIndex, setImageFieldIndex] = useState<number | undefined>();
  useEffect(() => {
    const index = titles.findIndex((t) => t.isImage === true);
    setImageFieldIndex(index + 1);
  }, [titles]);

  const [badgeFieldIndex, setBadgeFieldIndex] = useState<number | undefined>();
  useEffect(() => {
    const index = titles.findIndex((t) => t.isBadge === true);
    setBadgeFieldIndex(index + 1);
  }, [titles]);

  const trim = (str: string) => {
    const length = 20;
    return str && str.length > 20 ? str.substring(0, length - 3) + "..." : str;
  };

  const rowClickHandler = (row: any[]) => {
    if (link) router.push(link + "/" + row[0]);
    else if (row[0] && typeof row[1] === "boolean" && row[1] === false) {
      setIsOpen && setIsOpen(true);
      if (collection) set_selected_id({ collection, id: row[0] });
    }
  };

  return (
    <div className="overflow-x-auto">
      <div
        className={`lg:h-[calc(100vh-240px)] ${
          scrollable ? "lg:overflow-auto" : "lg:overflow-hidden"
        } min-w-xl max-w-screen-2xl flex items-center justify-center font-sans text-xs`}
      >
        <div className={`w-full ${compact && "lg:w-5/6"}`}>
          <div
            className={`bg-opacity-75 bg-white dark:bg-black dark:bg-opacity-25 rounded-xl my-2 ${SHADOW} `}
          >
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="uppercase leading-normal">
                  {titles &&
                    titles.map((title, index) => (
                      <th className={`py-3 px-6 text-center`} key={index}>
                        {title.name}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="font-light">
                {data &&
                  data.map((row, row_index) => (
                    <tr
                      key={row_index}
                      className={` ${
                        typeof row[1] === "boolean" && row[1] === true
                          ? "bg-primaryLight dark:bg-primaryDark cursor-not-allowed"
                          : "border-t border-contentDark dark:border-contentLight hover:bg-primaryLight dark:hover:bg-primaryDark cursor-pointer"
                      } max-w-xs`}
                      onClick={() => rowClickHandler(row)}
                    >
                      {row.map((col, col_index) => {
                        if (
                          col_index === 0 ||
                          (col_index === 1 && typeof col[1] !== "boolean")
                        ) {
                          return;
                        } else {
                          return (
                            <td
                              key={col_index}
                              className="p-3 text-center truncate"
                            >
                              {col_index === (imageFieldIndex as number) ? (
                                <div className="flex justify-center">
                                  <img
                                    src={col as string}
                                    alt={"User avatar"}
                                    className="cursor-pointer w-8 h-8 rounded-full"
                                  />
                                </div>
                              ) : col_index === (badgeFieldIndex as number) &&
                                col ? (
                                <div className="flex justify-center">
                                  <Badge text={col} />
                                </div>
                              ) : col === true ? (
                                <CheckCircleIcon className="text-success w-5 h-5 inline" />
                              ) : col === false ? (
                                <XCircleIcon className="text-danger w-5 h-5 inline" />
                              ) : (
                                trim(col)
                              )}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
            {(!data || data.length === 0) && (
              <div className="flex justify-center italic my-4">
                Aucun résultat trouvé
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
