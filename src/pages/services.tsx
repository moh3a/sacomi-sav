import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { trpc } from "../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../lib/config";
import PageSkeleton from "../components/PageSkeleton";
import DetailsPrestation from "../components/details/DetailsPrestation";
import {
  selectSelectedAll,
  select_prestations,
} from "../redux/selectedAllSlice";
import { PageArchitecture } from "../types";

const Prestations = () => {
  const dispatch = useDispatch();
  const { selected_prestations } = useSelector(selectSelectedAll);
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
        setTotalItems(data?.count || 0);
        dispatch(select_prestations(data?.prestations));
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.prestations}
      data={selected_prestations}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_compact={true}
      details_component={<DetailsPrestation />}
    />
  );
};

import Layout from "../components/layout/Layout";
Prestations.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Prestations;
