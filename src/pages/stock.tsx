const Stock = () => {
  return <div>Stock</div>;
};

import Layout from "../components/layout/Layout";
Stock.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Stock;
