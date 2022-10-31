import { useState } from "react";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import { useSelectedAllStore } from "../../utils/store";

const Orders = () => {
  const { selected_orders, set_selected_orders } = useSelectedAllStore();
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
        if (data && data.orders) {
          setTotalItems(data?.count || 0);
          set_selected_orders(data.orders);
        }
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
