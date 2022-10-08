import { useState } from "react";
import { useRouter } from "next/router";

import { PAGE_ARCHITECTURE } from "../../lib/config";
import PageSkeleton from "../components/PageSkeleton";

const Movements = () => {
  const router = useRouter();
  const p = Number(router.query.p) || 0;

  const [data, setData] = useState<
    (string | number | undefined)[][] | undefined
  >([]);
  const [totalItems, setTotalItems] = useState(0);

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.caisse}
      data={data}
      current_page={p}
      total_items={totalItems}
      table_compact={true}
    />
  );
};

import Layout from "../components/layout/Layout";
Movements.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Movements;
