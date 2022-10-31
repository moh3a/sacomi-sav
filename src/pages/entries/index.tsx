import { useState } from "react";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";

const Entries = () => {
  const { set_selected_entries, selected_entries } = useSelectedAllStore();
  const router = useRouter();
  const {
    name,
    entry_id,
    entry_date,
    p,
  }: { name?: string; entry_id?: string; entry_date?: string; p?: string } =
    router.query;

  const [totalItems, setTotalItems] = useState(0);

  trpc.entries.all.useQuery(
    { p: Number(p) || 0, name, entry_date, entry_id },
    {
      onSettled(data, error) {
        if (data && data.entries) {
          setTotalItems(data?.count || 0);
          set_selected_entries(data.entries);
        }
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.entries}
      data={selected_entries}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_compact={true}
    />
  );
};

import Layout from "../../components/layout/Layout";
import { useSelectedAllStore } from "../../utils/store";
Entries.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Entries;
