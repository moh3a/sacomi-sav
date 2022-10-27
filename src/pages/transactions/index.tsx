import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/outline";

import {
  selectSelectedAll,
  select_transactions,
} from "../../redux/selectedAllSlice";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import { TEXT_GRADIENT } from "../../components/design";
import DetailsTransaction from "../../components/details/DetailsTransaction";
import { trpc } from "../../utils/trpc";
import { get_month } from "../../utils";
import { selectCurrentId } from "../../redux/currentIdSlice";

const Movements = () => {
  const dispatch = useDispatch();
  const { selected_transactions } = useSelector(selectSelectedAll);
  const { current_balance } = useSelector(selectCurrentId);
  const router = useRouter();
  const current_month = Number(new Date().toISOString().substring(5, 7));
  const { p }: { p?: string } = router.query;

  const [totalItems, setTotalItems] = useState(0);
  trpc.transactions.all.useQuery(
    { p: Number(p) || 0 },
    {
      onSettled(data, error) {
        setTotalItems(data?.count || 0);
        dispatch(select_transactions(data?.transactions));
      },
    }
  );

  return (
    <>
      {current_balance && (
        <div className="mx-auto mb-6 px-2 w-full lg:w-5/6 flex justify-between">
          <button>
            <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <h1 className="text-2xl text-center font-bold">
            Solde courant en {get_month(current_month)} est de{" "}
            <span className={`text-3xl ${TEXT_GRADIENT} `}>
              {current_balance} DZD
            </span>
          </h1>
          <button>
            <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
      <PageSkeleton
        page={PAGE_ARCHITECTURE.transactions}
        data={selected_transactions}
        current_page={Number(p) || 0}
        total_items={totalItems}
        table_compact={true}
        details_component={<DetailsTransaction />}
      />
    </>
  );
};

import Layout from "../../components/layout/Layout";
Movements.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Movements;
