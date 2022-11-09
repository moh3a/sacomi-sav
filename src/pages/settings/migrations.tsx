import { useCallback, useState } from "react";
import { CloudUploadIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useEffectOnce } from "../../utils/useEffectOnce";

import { MigrationsConfig } from "../../types";
import { Uploader } from "../../components/Uploader";
import Table from "../../components/shared/Table";
import Banner from "../../components/shared/Banner";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const MIGRATIONS_LIST_FIELDS = [
  { name: "Order" },
  { name: "Name" },
  { name: "File" },
  { name: "Collection" },
  { name: "File uploaded" },
  { name: "Can be inserted" },
  { name: "Inserted to DB" },
  { name: "Insert" },
];

const SeedScreen = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type?: "success" | "warning" | "error";
    text?: string;
  }>({ type: undefined, text: undefined });
  const [data, setData] = useState<any>();

  const insertToDB = async (migration: MigrationsConfig) => {
    if (migration.canInsert) {
      setMessage({
        type: "warning",
        text: "Please wait! Inserting data... do not close the page.",
      });
      setLoading(true);
      const { data } = await axios.post("/api/migrations/insert", {
        migration,
      });
      if (data.success) {
        setLoading(false);
        setMessage({ type: "success", text: data.message });
        fetchUploadedFiles();
      } else {
        setLoading(false);
        setMessage({ type: "error", text: data.message });
        fetchUploadedFiles();
      }
    } else {
      setMessage({ type: "error", text: "Cannot insert data." });
    }
  };

  const fetchUploadedFiles = useCallback(async () => {
    const { data } = await axios.get("/api/migrations/uploaded");
    if (data.success) {
      let newdata: any[][] = (data.migrations_config as MigrationsConfig[]).map(
        (migration) => {
          return [
            Math.round(Math.random() * 10000),
            ...Object.values(migration),
            <button key={migration.order} onClick={() => insertToDB(migration)}>
              <CloudUploadIcon className="w-5 h-5 inline text-teal-500" />
            </button>,
          ];
        }
      );
      setData(newdata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffectOnce(() => {
    fetchUploadedFiles();
  });

  return (
    <>
      <h1 className="text-center text-4xl uppercase font-bold my-6">
        Migrations
      </h1>
      <div>
        <p className="text-xs uppercase text-center text-teal-500 font-bold">
          Upload new file
        </p>
        <Uploader />
      </div>
      {message.type && <Banner type={message.type} message={message.text} />}
      {loading && (
        <div className="text-teal-500 mt-6 text-center font-bold uppercase text-xs">
          <LoadingSpinner size="small" /> please wait
        </div>
      )}
      <div>
        {data && (
          <Table titles={MIGRATIONS_LIST_FIELDS} data={data} compact={true} />
        )}
      </div>
    </>
  );
};

import Layout from "../../components/layout/Layout";
SeedScreen.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default SeedScreen;
