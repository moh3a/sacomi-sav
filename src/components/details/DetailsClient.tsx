import { Client } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/selectedIdSlice";
import { selectSelectedOne, select_client } from "../../redux/selectedOneSlice";
import { trpc } from "../../utils/trpc";

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

  return (
    <div>
      {selected_client ? JSON.stringify(selected_client) : "Fetching..."}
    </div>
  );
};

export default DetailsClient;
