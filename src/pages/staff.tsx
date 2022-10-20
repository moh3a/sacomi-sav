import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

import { PAGE_ARCHITECTURE } from "../../lib/config";
import PageSkeleton from "../components/PageSkeleton";

const Staff = () => {
  const router = useRouter();
  const { p }: { p?: string } = router.query;

  const [data, setData] = useState<any[] | undefined>([]);
  const [totalItems, setTotalItems] = useState(0);
  trpc.users.all.useQuery(
    { p: Number(p) || 0 },
    {
      onSettled(data, error) {
        setTotalItems(data?.count || 0);
        setData(data?.users);
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.users}
      data={data}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_compact={true}
    />
  );
};

import Layout from "../components/layout/Layout";
Staff.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Staff;
