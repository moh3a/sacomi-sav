import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { trpc } from "../../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import { selectSelectedAll, select_jobs } from "../../redux/selectedAllSlice";

const Jobs = () => {
  const dispatch = useDispatch();
  const { selected_jobs } = useSelector(selectSelectedAll);
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
      onSettled(data, error) {
        setTotalItems(data?.count || 0);
        dispatch(select_jobs(data?.jobs));
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.jobs}
      data={selected_jobs}
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
