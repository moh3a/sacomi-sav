import { Client, Prestation, Prisma } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/selectedIdSlice";
import {
  selectSelectedOne,
  select_prestation,
} from "../../redux/selectedOneSlice";
import { trpc } from "../../utils/trpc";
import LoadingSpinner from "../shared/LoadingSpinner";

const PRESTATIONS_DETAIL_LIST_FIELDS = [
  { name: "Désignation", field: "prestationdetail_designation" },
  { name: "Qty", field: "prestationdetail_quantity" },
  { name: "HT", field: "prestationdetail_ht" },
  { name: "TTC", field: "prestationdetail_ttc" },
  { name: "Sous-total", field: "prestationdetail_subtotal" },
];

const DetailsPrestation = () => {
  const { selected_id } = useSelector(selectSelectedId);
  const {
    selected_prestation,
  }: {
    selected_prestation: Prestation & {
      client: Client;
      _count: Prisma.PrestationCountOutputType;
    };
  } = useSelector(selectSelectedOne);
  const dispatch = useDispatch();

  trpc.prestations.byId.useQuery(
    { id: selected_id },
    {
      onSettled(data, error) {
        dispatch(select_prestation(data?.prestation));
      },
    }
  );

  return (
    <div>
      {selected_prestation ? (
        <>
          <div className="my-4 mx-2">
            <div className={`text-lg uppercase text-primary`}>prestation</div>
          </div>
          <div className="my-4 mx-2">
            <div className={`text-lg uppercase text-primary`}>client</div>
          </div>
          <div className="my-4 mx-2">
            <div className={`text-lg uppercase text-primary`}>détails</div>
          </div>
        </>
      ) : (
        <LoadingSpinner size="large" />
      )}
    </div>
  );
};

export default DetailsPrestation;
