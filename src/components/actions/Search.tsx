import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { SearchIcon } from "@heroicons/react/outline";

import { TEXT_GRADIENT } from "../design";
import Button from "../shared/Button";
import TextInput from "../shared/TextInput";
import { useRouter } from "next/router";
import { SearchLayout } from "../../types";

interface SearchProps {
  title: string;
  layout: SearchLayout[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Search = ({ title, layout, setIsOpen }: SearchProps) => {
  const get_state = () => {
    let s: any = {};
    layout.forEach((group) => {
      group.group_fields.forEach((field) => (s[field.field] = ""));
    });
    return s;
  };

  const [state, setState] = useState(get_state());
  const router = useRouter();

  const searchHandler = async (event: FormEvent) => {
    event.preventDefault();
    let router_filters: any = {};
    Object.keys(state).forEach((field) => {
      if (state[field])
        router_filters = { ...router_filters, [field]: state[field] };
    });
    router.push({
      href: router.asPath.split("?")[0],
      query: {
        ...router_filters,
      },
    });
    setIsOpen(false);
  };

  return (
    <form onSubmit={searchHandler}>
      <h2
        className={`uppercase text-xl font-bold text-center ${TEXT_GRADIENT}`}
      >
        Recherche | {title}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-2 gap-x-2">
        {layout.map((group, group_index) => (
          <div key={group_index}>
            {group.group_title && (
              <div className={`text-lg uppercase text-primary`}>
                {group.group_title}
              </div>
            )}
            {group.group_fields.map((field, field_index) => (
              <div key={field.field} className="m-1">
                <div className="w-full">{field.name}</div>
                <TextInput
                  placeholder={field.name}
                  value={state[field.field]}
                  onChange={(e) =>
                    setState({
                      ...state,
                      [field.field]: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center">
        <Button type="submit" variant="solid">
          <SearchIcon className="h-5 w-5 inline" aria-hidden="true" />
          Rechercher
        </Button>
      </div>
    </form>
  );
};

export default Search;
