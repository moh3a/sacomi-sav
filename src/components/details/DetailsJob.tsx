import { Job } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/selectedIdSlice";
import { selectSelectedOne, select_job } from "../../redux/selectedOneSlice";
import { trpc } from "../../utils/trpc";

const DetailsJob = () => {
  const { selected_id } = useSelector(selectSelectedId);
  const { selected_job }: { selected_job: Job } =
    useSelector(selectSelectedOne);
  const dispatch = useDispatch();

  trpc.jobs.byId.useQuery(
    { id: selected_id },
    {
      onSettled(data, error) {
        dispatch(select_job(data?.job));
      },
    }
  );

  return (
    <div>{selected_job ? JSON.stringify(selected_job) : "Fetching..."}</div>
  );
};

export default DetailsJob;
