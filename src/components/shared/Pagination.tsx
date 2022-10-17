import React, { ReactNode } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import { BG_GRADIENT } from "../design";
import { useRouter } from "next/router";

interface PaginationProps {
  current: number;
  unitsPerPage: number;
  totalUnits: number;
}

const PageNumber = ({
  children,
  href,
  p,
}: {
  href?: string;
  p?: number;
  children: ReactNode;
}) => {
  const router = useRouter();
  return (
    <a
      onClick={() =>
        router.push({ href, query: { ...router.query, p: p?.toString() } })
      }
      className={`relative cursor-pointer flex justify-center items-center w-8 h-8 mx-1 rounded-full border ${BG_GRADIENT} text-sm font-medium  hover:text-primary`}
    >
      {children}
    </a>
  );
};

const Pagination = ({ current, totalUnits, unitsPerPage }: PaginationProps) => {
  const router = useRouter();

  return (
    <div className="max-w-md mt-2 mx-auto flex-1 flex items-center justify-center">
      <nav
        className="relative z-0 items-center flex rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <PageNumber href={router.asPath.split("?")[0]} p={undefined}>
          <span className="sr-only">First</span>
          <ChevronDoubleLeftIcon className="h-4 w-4" aria-hidden="true" />
        </PageNumber>
        <PageNumber
          href={router.asPath.split("?")[0]}
          p={current - 1 <= 0 ? undefined : current - 1}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        </PageNumber>
        <p className="text-sm  mx-2">
          Page {current}, montre{" "}
          <span className="font-medium">{unitsPerPage}</span> de{" "}
          <span className="font-medium">{totalUnits}</span> en total.
        </p>
        <PageNumber
          href={router.asPath.split("?")[0]}
          p={current * unitsPerPage > totalUnits ? current : current + 1}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </PageNumber>
        <PageNumber
          href={router.asPath.split("?")[0]}
          p={Math.floor(totalUnits / unitsPerPage)}
        >
          <span className="sr-only">Last</span>
          <ChevronDoubleRightIcon className="h-4 w-4" aria-hidden="true" />
        </PageNumber>
      </nav>
    </div>
  );
};

export default Pagination;
