import { AdjustmentsIcon, RefreshIcon, XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

const Filters = () => {
  const router = useRouter();

  return (
    <div className="w-full flex justify-around">
      {router.query && Object.keys(router.query).length > 0 && (
        <>
          <div className="flex flex-wrap justify-center space-x-2">
            <div className="p-2 rounded-full flex justify-center items-center text-gray-500 bg-gray-200 font-semibold w-max cursor-pointer transition duration-300 ease">
              <AdjustmentsIcon className="h-4 w-4" aria-hidden="true" />
            </div>
            {router.query &&
              Object.keys(router.query).map((query) => {
                if (router.query[query])
                  return (
                    <span
                      key={query}
                      className="px-4 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
                    >
                      {query}: {router.query[query]}{" "}
                      <button
                        onClick={() => {
                          delete router.query[query];
                          router.push({
                            href: router.asPath.split("?")[0],
                            query: router.query,
                          });
                        }}
                        className="bg-transparent hover focus:outline-none"
                      >
                        <XIcon className="ml-3 h-4 w-4" aria-hidden="true" />
                      </button>
                    </span>
                  );
              })}
          </div>
          <div className="p-2 rounded-full flex justify-center items-center text-gray-500 bg-gray-200 font-semibold w-max cursor-pointer transition duration-300 ease">
            <button
              onClick={() => {
                router.push({
                  href: router.asPath.split("?")[0],
                  query: undefined,
                });
              }}
            >
              <RefreshIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Filters;
