import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { trpc } from "../../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import DetailsClient from "../../components/details/DetailsClient";
import {
  selectSelectedAll,
  select_clients,
} from "../../redux/selectedAllSlice";

const Clients = () => {
  const dispatch = useDispatch();
  const { selected_clients } = useSelector(selectSelectedAll);
  const router = useRouter();
  const { p, name, type }: { p?: string; name?: string; type?: string } =
    router.query;

  const [totalItems, setTotalItems] = useState(0);

  trpc.clients.all.useQuery(
    { p: Number(p) || 0, name, type },
    {
      onSettled(data, error) {
        setTotalItems(data?.count || 0);
        dispatch(select_clients(data?.clients));
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
      details_component={<DetailsClient />}
    />
  );
};

import Layout from "../../components/layout/Layout";
Clients.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Clients;
