import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { PAGE_ARCHITECTURE } from "../../../lib/config";
import { SHADOW } from "../../components/design";
import Edit from "../../components/actions/Edit";
import { select_id } from "../../redux/selectedIdSlice";

const Transaction = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  if (id && typeof id === "string") dispatch(select_id({ id }));

  return (
    <div className="overflow-x-auto">
      <div
        className={` lg:overflow-auto min-w-xl max-w-screen-2xl flex items-center justify-center font-sans`}
      >
        <div className={`w-full lg:w-5/6`}>
          <div
            className={`bg-opacity-75 bg-white dark:bg-black dark:bg-opacity-25 rounded-xl my-6 ${SHADOW} `}
          >
            <Edit
              title={PAGE_ARCHITECTURE.transactions.title}
              layout={PAGE_ARCHITECTURE.transactions.create_layout!}
              collection={
                PAGE_ARCHITECTURE.transactions.collection ?? "transactions"
              }
              unit={PAGE_ARCHITECTURE.transactions.unit ?? "transaction"}
              url={PAGE_ARCHITECTURE.transactions.url ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

import Layout from "../../components/layout/Layout";
Transaction.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Transaction;
