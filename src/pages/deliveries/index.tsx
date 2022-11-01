import { useState } from "react";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import { useSelectedStore } from "../../utils/store";

const Deliveries = () => {
  const { set_selected_cursor, selected } = useSelectedStore();
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
      onSettled(data) {
        if (data && data.deliveries) {
          setTotalItems(data?.count || 0);
          set_selected_cursor({
            collection: "deliveries",
            cursor: data.deliveries,
          });
        }
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.deliveries}
      data={selected.deliveries?.cursor}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_compact={true}
    />
  );
};

import Layout from "../../components/layout/Layout";
Deliveries.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Deliveries;
