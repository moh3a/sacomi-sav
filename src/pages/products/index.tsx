import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { trpc } from "../../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import DetailsProduct from "../../components/details/DetailsProduct";
import {
  selectSelectedAll,
  select_products,
} from "../../redux/selectedAllSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { selected_products } = useSelector(selectSelectedAll);
  const router = useRouter();
  const {
    p,
    product_brand,
    product_model,
    product_type,
  }: {
    p?: string;
    product_model?: string;
    product_brand?: string;
    product_type?: string;
  } = router.query;

  const [totalItems, setTotalItems] = useState(0);

  trpc.products.all.useQuery(
    { p: Number(p) || 0, product_brand, product_model, product_type },
    {
      onSettled(data, error) {
        setTotalItems(data?.count || 0);
        dispatch(select_products(data?.products));
      },
    }
  );

  return (
    <PageSkeleton
      page={PAGE_ARCHITECTURE.products}
      data={selected_products}
      current_page={Number(p) || 0}
      total_items={totalItems}
      table_compact={true}
      details_component={<DetailsProduct />}
    />
  );
};

import Layout from "../../components/layout/Layout";
Products.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Products;
