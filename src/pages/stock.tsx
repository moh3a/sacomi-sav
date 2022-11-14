import { useState } from "react";
import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../lib/config";
import PageSkeleton from "../components/PageSkeleton";
import { useSelectedStore } from "../utils/store";

const Stocks = () => {
  const { selected, set_selected_cursor } = useSelectedStore();
  const router = useRouter();
  const { p }: { p?: string } = router.query;

  const [totalItems, setTotalItems] = useState(0);

  trpc.stocks.all.useQuery(
    { p: Number(p) || 0 },
    {
      onSettled(data, error) {
        if (data && data.stocks) {
          setTotalItems(data?.count || 0);
          set_selected_cursor({ collection: "stocks", cursor: data.stocks });
        }
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.stocks}
      data={selected.stocks?.cursor}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_compact={true}
    />
  );
};

import Layout from "../components/layout/Layout";
Stocks.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Stocks;
