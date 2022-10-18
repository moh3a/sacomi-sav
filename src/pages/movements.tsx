import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import {
  selectSelectedAll,
  select_transactions,
} from "../redux/selectedAllSlice";
import { trpc } from "../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../lib/config";
import PageSkeleton from "../components/PageSkeleton";

const Movements = () => {
  const dispatch = useDispatch();
  const { selected_transactions } = useSelector(selectSelectedAll);
  const router = useRouter();
  const { p }: { p?: string } = router.query;

  const [totalItems, setTotalItems] = useState(0);
  trpc.transactions.all.useQuery(
    { p: Number(p) || 0 },
    {
      onSettled(data, error) {
        setTotalItems(data?.count || 0);
        console.log(data?.transactions);
        dispatch(select_transactions(data?.transactions));
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.caisse}
      data={selected_transactions}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_compact={true}
    />
  );
};

import Layout from "../components/layout/Layout";
Movements.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Movements;
