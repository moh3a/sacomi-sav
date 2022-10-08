import { Client, Delivery } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";
import { PRIMARY_COLOR, TEXT_GRADIENT } from "../../../lib/design";
import { selectSelectedId } from "../../redux/selectedIdSlice";
import {
  selectSelectedOne,
  select_delivery,
} from "../../redux/selectedOneSlice";
import { formatFMDate } from "../../utils/filemaker/utils";
import { trpc } from "../../utils/trpc";
import LoadingSpinner from "../shared/LoadingSpinner";

const DetailsDelivery = () => {
  const { selected_id } = useSelector(selectSelectedId);
  const {
    selected_delivery,
  }: {
    selected_delivery: Delivery & {
      client: Client;
    };
  } = useSelector(selectSelectedOne);
  const dispatch = useDispatch();

  trpc.deliveries.byId.useQuery(
    { id: selected_id },
    {
      onSettled(data, error) {
        dispatch(select_delivery(data?.delivery));
      },
    }
  );

  return (
    <div>
      {selected_delivery ? (
        <>
          <div className="my-4 mx-2">
            <div className={`text-lg uppercase text-${PRIMARY_COLOR.light}`}>
              bon de livraison
            </div>
          </div>
          <div className="my-4 mx-2">
            <div className={`text-lg uppercase text-${PRIMARY_COLOR.light}`}>
              client
            </div>
          </div>
          <div className="my-4 mx-2">
            <div className={`text-lg uppercase text-${PRIMARY_COLOR.light}`}>
              bon de retour
            </div>
          </div>
          <div className="my-4 mx-2">
            <div className={`text-lg uppercase text-${PRIMARY_COLOR.light}`}>
              contenu de la livraison
            </div>
          </div>
          <div className="my-4 mx-2">
            <div className={`text-lg uppercase text-${PRIMARY_COLOR.light}`}>
              infos
            </div>
          </div>
        </>
      ) : (
        <LoadingSpinner size="large" />
      )}
    </div>
  );
};

export default DetailsDelivery;
