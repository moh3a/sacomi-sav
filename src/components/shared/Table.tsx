/* eslint-disable @next/next/no-img-element */
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { select_id } from "../../redux/selectedIdSlice";

interface TableProps {
  titles: { name: string; field?: string; isImage?: boolean }[];
  data: any[][];
  compact?: boolean;
  scrollable?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  link?: string;
}

const Table = ({
  titles,
  data,
  compact,
  scrollable,
  setIsOpen,
  link,
}: TableProps) => {
  const [imageFieldIndex, setImageFieldIndex] = useState<number | undefined>();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setImageFieldIndex(titles.findIndex((t) => t.isImage === true));
  }, [titles]);

  const trim = (str: string) => {
    const length = 20;
    return str && str.length > 20 ? str.substring(0, length - 3) + "..." : str;
  };

  const rowClickHandler = (row: any[]) => {
    if (link) router.push(link + "/" + row[0]);
    else if (row[0]) {
      dispatch(select_id({ id: row[0] }));
      setIsOpen && setIsOpen(true);
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
          <div className="bg-opacity-75 bg-white dark:bg-black dark:bg-opacity-25 rounded-xl my-6 shadow-md shadow-teal-500">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="uppercase leading-normal">
                  {titles &&
                    titles.map((title, index) => (
                      <th className="py-3 px-6 text-center" key={index}>
                        {title.name}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="font-light">
                {data.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 max-w-xs cursor-pointer"
                    onClick={() => rowClickHandler(row)}
                  >
                    {row.map((col, i) => {
                      if (i !== 0) {
                        return (
                          <td key={i} className="p-3 text-center truncate">
                            {i === (imageFieldIndex as number) ? (
                              <img
                                src={col as string}
                                alt={"User avatar"}
                                className="cursor-pointer w-8 h-8 rounded-full"
                              />
                            ) : col === true ? (
                              <CheckCircleIcon className="text-green-500 w-5 h-5 inline" />
                            ) : col === false ? (
                              <XCircleIcon className="text-red-500 w-5 h-5 inline" />
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
            {data.length === 0 && (
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
