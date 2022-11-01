import { useState } from "react";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import { useSelectedStore } from "../../utils/store";

const Prestations = () => {
  const { selected, set_selected_cursor } = useSelectedStore();
  const router = useRouter();
  const {
    p,
    is_paid,
    name,
    payment_date,
    prestation_date,
    prestation_id,
  }: {
    p?: string;
    prestation_id?: string;
    prestation_date?: string;
    name?: string;
    is_paid?: string;
    payment_date?: string;
  } = router.query;

  const [totalItems, setTotalItems] = useState(0);

  trpc.prestations.all.useQuery(
    {
      p: Number(p) || 0,
      is_paid,
      name,
      payment_date,
      prestation_date,
      prestation_id,
    },
    {
      onSettled(data, error) {
        if (data && data.prestations) {
          setTotalItems(data?.count || 0);
          set_selected_cursor({
            collection: "prestations",
            cursor: data.prestations,
          });
        }
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.prestations}
      data={selected.prestations?.cursor}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_compact={true}
    />
  );
};

import Layout from "../../components/layout/Layout";
Prestations.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Prestations;
