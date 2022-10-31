import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/outline";

import { PAGE_ARCHITECTURE } from "../../../lib/config";
import PageSkeleton from "../../components/PageSkeleton";
import { TEXT_GRADIENT } from "../../components/design";
import { trpc } from "../../utils/trpc";
import { get_month } from "../../utils";
import { useCurrentIdStore, useSelectedAllStore } from "../../utils/store";

const Movements = () => {
  const { selected_transactions, set_selected_transactions } =
    useSelectedAllStore();
  const { current_balance } = useCurrentIdStore();

  const router = useRouter();
  const { p, date }: { p?: string; date?: string } = router.query;
  const current_month = Number(new Date().toISOString().substring(5, 7));
  const current_year = Number(new Date().toISOString().substring(0, 4));
  const [cursorMonth, setCursorMonth] = useState(current_month);
  const [cursorYear, setCursorYear] = useState(current_year);

  useEffect(() => {
    if (date) {
      setCursorMonth(Number(date.substring(5, 7)));
      setCursorYear(Number(date.substring(0, 4)));
    } else {
      setCursorMonth(current_month);
      setCursorYear(current_year);
    }
  }, [current_month, current_year, date]);

  const [totalItems, setTotalItems] = useState(0);
  trpc.transactions.all.useQuery(
    { p: Number(p) || 0, date },
    {
      onSettled(data) {
        if (data && data.transactions) {
          setTotalItems(data?.count || 0);
          set_selected_transactions(data.transactions);
        }
      },
    }
  );

  return (
    <>
      {current_balance && (
        <h1 className="text-2xl text-center font-bold">
          Solde courant en {get_month(current_month)} {current_year} est de{" "}
          <span className={`text-3xl ${TEXT_GRADIENT} `}>
            {current_balance} DZD
          </span>
        </h1>
      )}
      <div className="mx-auto mb-6 px-2 w-full lg:w-5/6 flex justify-between">
        <a
          onClick={() => {
            let newmonth = cursorMonth <= 1 ? 12 : cursorMonth - 1;
            let newyear = cursorMonth <= 1 ? cursorYear - 1 : cursorYear;
            router.push({
              href: router.asPath.split("?")[0],
              query: {
                ...router.query,
                date:
                  newyear + "-" + (newmonth < 10 ? "0" + newmonth : newmonth),
              },
            });
            setCursorMonth(newmonth);
            setCursorYear(newyear);
          }}
        >
          <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
        </a>
        <h1 className="text-xl text-center font-semibold">
          Caisse du mois de {get_month(cursorMonth)} {cursorYear}
        </h1>
        <a
          onClick={() => {
            let newmonth = cursorMonth >= 12 ? 1 : cursorMonth + 1;
            let newyear = cursorMonth >= 12 ? cursorYear + 1 : cursorYear;
            router.push({
              href: router.asPath.split("?")[0],
              query: {
                ...router.query,
                date:
                  newyear + "-" + (newmonth < 10 ? "0" + newmonth : newmonth),
              },
            });
            setCursorMonth(newmonth);
            setCursorYear(newyear);
          }}
        >
          <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
      <PageSkeleton
        page={PAGE_ARCHITECTURE.transactions}
        data={selected_transactions}
        current_page={Number(p) || 0}
        total_items={totalItems}
        table_compact={true}
      />
    </>
  );
};

import Layout from "../../components/layout/Layout";
Movements.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Movements;
