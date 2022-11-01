import { useState } from "react";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import { useSelectedStore } from "../../utils/store";

const Jobs = () => {
  const { selected, set_selected_cursor } = useSelectedStore();
  const router = useRouter();
  const {
    p,
    diagnostics,
    entry_date,
    entry_id,
    exit_date,
    name,
    product_model,
    serial_number,
    status,
    technician,
  }: {
    p?: string;
    entry_id?: string;
    entry_date?: string;
    name?: string;
    serial_number?: string;
    technician?: string;
    diagnostics?: string;
    status?: string;
    exit_date?: string;
    product_model?: string;
  } = router.query;

  const [totalItems, setTotalItems] = useState(0);

  trpc.jobs.all.useQuery(
    {
      p: Number(p) || 0,
      diagnostics,
      entry_date,
      entry_id,
      exit_date,
      name,
      product_model,
      serial_number,
      status,
      technician,
    },
    {
      onSettled(data) {
        if (data && data.jobs) {
          setTotalItems(data?.count || 0);
          set_selected_cursor({ collection: "jobs", cursor: data.jobs });
        }
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.jobs}
      data={selected.jobs?.cursor}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_scrollable={true}
    />
  );
};

import Layout from "../../components/layout/Layout";
Jobs.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Jobs;
