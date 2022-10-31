import { useState } from "react";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import { useSelectedAllStore } from "../../utils/store";

const Clients = () => {
  const { selected_clients, set_selected_clients } = useSelectedAllStore();
  const router = useRouter();
  const { p, name, type }: { p?: string; name?: string; type?: string } =
    router.query;

  const [totalItems, setTotalItems] = useState(0);

  trpc.clients.all.useQuery(
    { p: Number(p) || 0, name, type },
    {
      onSettled(data, error) {
        if (data && data.clients) {
          setTotalItems(data?.count || 0);
          set_selected_clients(data.clients);
        }
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.clients}
      data={selected_clients}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_compact={true}
    />
  );
};

import Layout from "../../components/layout/Layout";
Clients.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Clients;
