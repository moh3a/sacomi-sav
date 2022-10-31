import { useState } from "react";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";
import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import { useSelectedAllStore } from "../../utils/store";

const Products = () => {
  const { selected_products, set_selected_products } = useSelectedAllStore();
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
        if (data && data.products) {
          setTotalItems(data?.count || 0);
          set_selected_products(data.products);
        }
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
    />
  );
};

import Layout from "../../components/layout/Layout";
Products.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Products;
