import { useEffect, useState } from "react";
import Head from "next/head";
import { PlusIcon, SearchIcon } from "@heroicons/react/outline";

import { ITEMS_PER_PAGE, PAGE_TITLE } from "../../lib/config";
import { TEXT_GRADIENT } from "./design";
import Pagination from "./shared/Pagination";
import Filters from "./layout/Filters";
import Table from "./shared/Table";
import Modal from "./shared/Modal";
import Button from "./shared/Button";
import Search from "./actions/Search";
import Create from "./actions/Create";
import Edit from "./actions/Edit";
import {
  CollectionsBaseUnit,
  CollectionsWithGeneratedIds,
  PageArchitecture,
} from "../types";
import { useSelectedStore } from "../utils/store";
import { trpc } from "../utils/trpc";

interface PageSkeletonProps {
  page: PageArchitecture;
  data?: any;
  current_page: number;
  total_items: number;
  link?: string;
  table_compact?: boolean;
  table_scrollable?: boolean;
}

const PageSkeleton = ({
  page,
  data,
  current_page,
  total_items,
  table_compact,
  table_scrollable,
  link,
}: PageSkeletonProps) => {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);

  const { selected } = useSelectedStore();
  const lockMutation = trpc[page.collection].lock.useMutation();
  const unlockMutation = trpc[page.collection].unlock.useMutation();

  const utils = trpc.useContext();
  trpc.onAction.useSubscription(undefined, {
    onData(collection) {
      if (collection === page.collection) utils[collection].all.invalidate();
    },
  });

  useEffect(() => {
    if (
      selected[page.collection] &&
      selected[page.collection]?.id &&
      selected[page.collection]?.id?.toString()
    ) {
      if (openDetailsModal) {
        lockMutation.mutate({
          id: selected[page.collection]?.id?.toString() ?? "oops",
        });
      } else {
        unlockMutation.mutate({
          id: selected[page.collection]?.id?.toString() ?? "oops",
        });
      }
    }
    return () => {
      unlockMutation.mutate({
        id: selected[page.collection]?.id?.toString() ?? "oops",
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDetailsModal]);

  return (
    <>
      <Head>
        <title>{page.title + " " + PAGE_TITLE}</title>
      </Head>
      <div className="mx-auto px-2 w-full lg:w-5/6 flex justify-between">
        <h1>
          <span className={`uppercase text-xl font-bold ${TEXT_GRADIENT}`}>
            {page.title}
          </span>
        </h1>
        <div className="flex justify-center z-10">
          {page.create_layout && page.collection !== "jobs" && (
            <div className="mx-1">
              <Button
                onClick={() => setOpenCreateModal(!openCreateModal)}
                variant="solid"
                className="flex justify-center"
                radius="50%"
              >
                <PlusIcon className="h-6 w-6 m-1 z-10" />
              </Button>
            </div>
          )}
          {page.search_layout && (
            <div className="mx-1">
              <Button
                onClick={() => setOpenSearchModal(!openSearchModal)}
                variant="solid"
                className="flex justify-center"
                radius="50%"
              >
                <SearchIcon className="h-6 w-6 m-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {page.create_layout && page.collection !== "jobs" && (
        <Modal isOpen={openCreateModal} setIsOpen={setOpenCreateModal}>
          <Create
            setIsOpen={setOpenCreateModal}
            title={page.title}
            collection={page.collection as CollectionsWithGeneratedIds}
            layout={page.create_layout}
          />
        </Modal>
      )}
      {page.search_layout && (
        <Modal isOpen={openSearchModal} setIsOpen={setOpenSearchModal}>
          <Search
            setIsOpen={setOpenSearchModal}
            title={page.title}
            layout={page.search_layout}
          />
        </Modal>
      )}
      <Filters />
      {data && (
        <>
          <Table
            setIsOpen={setOpenDetailsModal}
            titles={page.table_titles}
            collection={page.collection}
            data={page.table_data(data)}
            link={link}
            compact={table_compact}
            scrollable={table_scrollable}
          />
          <Pagination
            current={current_page}
            unitsPerPage={ITEMS_PER_PAGE}
            totalUnits={total_items}
          />
        </>
      )}

      <Modal isOpen={openDetailsModal} setIsOpen={setOpenDetailsModal}>
        {page.create_layout && (
          <Edit
            setIsOpen={setOpenDetailsModal}
            title={page.title}
            collection={page.collection as CollectionsWithGeneratedIds}
            unit={page.unit as CollectionsBaseUnit}
            url={page.url ?? ""}
            layout={page.create_layout}
          />
        )}
      </Modal>
    </>
  );
};

export default PageSkeleton;
