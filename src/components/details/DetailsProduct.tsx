import { Product } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/selectedIdSlice";
import {
  selectSelectedOne,
  select_product,
} from "../../redux/selectedOneSlice";
import { trpc } from "../../utils/trpc";

const DetailsProduct = () => {
  const { selected_id } = useSelector(selectSelectedId);
  const { selected_product }: { selected_product: Product } =
    useSelector(selectSelectedOne);
  const dispatch = useDispatch();

  trpc.products.byId.useQuery(
    { id: selected_id },
    {
      onSettled(data, error) {
        dispatch(select_product(data?.product));
      },
    }
  );

  return (
    <div>
      {selected_product ? JSON.stringify(selected_product) : "Fetching..."}
    </div>
  );
};

export default DetailsProduct;
