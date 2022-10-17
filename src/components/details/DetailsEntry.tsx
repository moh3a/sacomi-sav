import { Client, Entry, Prisma } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";
import { TEXT_GRADIENT } from "../design";
import { selectSelectedId } from "../../redux/selectedIdSlice";
import { selectSelectedOne, select_entry } from "../../redux/selectedOneSlice";
import { formatFMDate } from "../../utils/filemaker/utils";
import { trpc } from "../../utils/trpc";
import LoadingSpinner from "../shared/LoadingSpinner";

const DetailsEntry = () => {
  const { selected_id } = useSelector(selectSelectedId);
  const {
    selected_entry,
  }: {
    selected_entry: Entry & {
      client: Client;
      _count: Prisma.EntryCountOutputType;
    };
  } = useSelector(selectSelectedOne);
  const dispatch = useDispatch();

  trpc.entries.byId.useQuery(
    { id: selected_id },
    {
      onSettled(data, error) {
        dispatch(select_entry(data?.entry));
      },
    }
  );

  return (
    <div>
      {selected_entry ? (
        <div className="lg:flex">
          <div className="my-4 mx-2 lg:flex-1">
            <div className={`text-lg text-primary`}>ENTREE</div>
            <div className="text-lg">
              Numéro de bon{" "}
              <span className={`text-lg font-bold ${TEXT_GRADIENT}`}>
                {selected_entry.entry_id}
              </span>
            </div>
            <div className="text-sm">
              Date d&apos;entrée {formatFMDate(selected_entry.entry_date)}
            </div>
          </div>
          <div className="my-4 mx-2 lg:flex-1">
            <div className={`text-lg text-primary`}>CLIENT</div>
            <div>
              <span className={`text-lg font-bold ${TEXT_GRADIENT}`}>
                {selected_entry.client?.name}
              </span>
            </div>
            <div>Numéro de téléphone {selected_entry.client?.phone_number}</div>
          </div>
        </div>
      ) : (
        <LoadingSpinner size="large" />
      )}
    </div>
  );
};

export default DetailsEntry;
