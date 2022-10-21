import { Product, Transaction } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/selectedIdSlice";
import {
  selectSelectedOne,
  select_transaction,
} from "../../redux/selectedOneSlice";
import { trpc } from "../../utils/trpc";

const DetailsTransaction = () => {
  const { selected_id } = useSelector(selectSelectedId);
  const { selected_transaction }: { selected_transaction: Transaction } =
    useSelector(selectSelectedOne);
  const dispatch = useDispatch();

  trpc.transactions.byId.useQuery(
    { id: selected_id },
    {
      onSettled(data, error) {
        dispatch(select_transaction(data?.transaction));
      },
    }
  );

  return (
    <div>
      {selected_transaction
        ? JSON.stringify(selected_transaction)
        : "Fetching..."}
    </div>
  );
};

export default DetailsTransaction;
