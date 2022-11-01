import { useEffect } from "react";
import { useRouter } from "next/router";

import { PAGE_ARCHITECTURE } from "../../../lib/config";
import { SHADOW } from "../../components/design";
import Edit from "../../components/actions/Edit";
import { useSelectedStore } from "../../utils/store";

const Job = () => {
  const router = useRouter();
  const { id } = router.query;
  const { set_selected_id } = useSelectedStore();

  useEffect(() => {
    if (id && typeof id === "string")
      set_selected_id({ collection: "jobs", id });
  }, [id, set_selected_id]);

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
              title={PAGE_ARCHITECTURE.jobs.title}
              layout={PAGE_ARCHITECTURE.jobs.create_layout!}
              collection={PAGE_ARCHITECTURE.jobs.collection ?? "jobs"}
              unit={PAGE_ARCHITECTURE.jobs.unit ?? "job"}
              url={PAGE_ARCHITECTURE.jobs.url ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

import Layout from "../../components/layout/Layout";
Job.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Job;
