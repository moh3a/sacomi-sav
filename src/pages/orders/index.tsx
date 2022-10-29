import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { trpc } from "../../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import { selectSelectedAll, select_orders } from "../../redux/selectedAllSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const { selected_orders } = useSelector(selectSelectedAll);
  const router = useRouter();
  const {
    p,
    order_content,
    order_date,
    order_id,
  }: {
    p?: string;
    order_id?: string;
    order_date?: string;
    order_content?: string;
  } = router.query;

  const [totalItems, setTotalItems] = useState(0);

  trpc.orders.all.useQuery(
    { p: Number(p) || 0, order_content, order_date, order_id },
    {
      onSettled(data, error) {
        setTotalItems(data?.count || 0);
        dispatch(select_orders(data?.orders));
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.orders}
      data={selected_orders}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_compact={true}
    />
  );
};

import Layout from "../../components/layout/Layout";
Orders.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Orders;
