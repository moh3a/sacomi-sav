import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { trpc } from "../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../lib/config";
import PageSkeleton from "../components/PageSkeleton";
import DetailsDelivery from "../components/details/DetailsDelivery";
import {
  selectSelectedAll,
  select_deliveries,
} from "../redux/selectedAllSlice";

const Deliveries = () => {
  const dispatch = useDispatch();
  const { selected_deliveries } = useSelector(selectSelectedAll);
  const router = useRouter();
  const {
    p,
    delivery_date,
    delivery_id,
    name,
  }: {
    p?: string;
    delivery_id?: string;
    delivery_date?: string;
    name?: string;
  } = router.query;

  const [totalItems, setTotalItems] = useState(0);

  trpc.deliveries.all.useQuery(
    { p: Number(p) || 0, delivery_date, delivery_id, name },
    {
      onSettled(data, error) {
        setTotalItems(data?.count || 0);
        dispatch(select_deliveries(data?.deliveries));
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.deliveries}
      data={selected_deliveries}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_compact={true}
      details_component={<DetailsDelivery />}
    />
  );
};

import Layout from "../components/layout/Layout";
Deliveries.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Deliveries;
