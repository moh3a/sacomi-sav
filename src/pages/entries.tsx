import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { trpc } from "../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../lib/config";
import PageSkeleton from "../components/PageSkeleton";
import DetailsEntry from "../components/details/DetailsEntry";
import { selectSelectedAll, select_entries } from "../redux/selectedAllSlice";

const Entries = () => {
  const dispatch = useDispatch();
  const { selected_entries } = useSelector(selectSelectedAll);
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
        setTotalItems(data?.count || 0);
        dispatch(select_entries(data?.entries));
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
      details_component={<DetailsEntry />}
    />
  );
};

import Layout from "../components/layout/Layout";
Entries.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Entries;
