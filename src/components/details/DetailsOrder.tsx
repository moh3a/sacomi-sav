import { Order } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/selectedIdSlice";
import { selectSelectedOne, select_order } from "../../redux/selectedOneSlice";
import { trpc } from "../../utils/trpc";
import LoadingSpinner from "../shared/LoadingSpinner";

const DetailsOrder = () => {
  const { selected_id } = useSelector(selectSelectedId);
  const { selected_order }: { selected_order: Order } =
    useSelector(selectSelectedOne);
  const dispatch = useDispatch();

  trpc.orders.byId.useQuery(
    { id: selected_id },
    {
      onSettled(data, error) {
        dispatch(select_order(data?.order));
      },
    }
  );

  return (
    <div>
      {selected_order ? (
        JSON.stringify(selected_order)
      ) : (
        <LoadingSpinner size="large" />
      )}
    </div>
  );
};

export default DetailsOrder;
