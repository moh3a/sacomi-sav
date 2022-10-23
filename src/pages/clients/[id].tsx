import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { PAGE_ARCHITECTURE } from "../../../lib/config";
import { SHADOW } from "../../components/design";
import Edit from "../../components/actions/Edit";
import { select_id } from "../../redux/selectedIdSlice";

const Client = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  if (id && typeof id === "string") dispatch(select_id({ id }));
  // trpc.clients.byId.useQuery(
  //   { id },
  //   {
  //     onSettled(data, error) {
  //       dispatch(select_client(data?.client));
  //     },
  //   }
  // );

  // <div className="mx-auto lg:w-5/6">
  return (
    <div className="overflow-x-auto">
      <div
        className={`lg:h-[calc(100vh-240px)] lg:overflow-auto min-w-xl max-w-screen-2xl flex items-center justify-center font-sans text-xs`}
      >
        <div className={`w-full lg:w-5/6`}>
          <div
            className={`bg-opacity-75 bg-white dark:bg-black dark:bg-opacity-25 rounded-xl my-6 ${SHADOW} `}
          >
            <Edit
              collection="clients"
              unit="client"
              layout={PAGE_ARCHITECTURE.clients.create_layout!}
              title="Clients"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

import Layout from "../../components/layout/Layout";
Client.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Client;
