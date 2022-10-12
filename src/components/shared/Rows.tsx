import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";

import Button from "./Button";
import TextInput from "./TextInput";
import { PRIMARY_COLOR, ROUNDED } from "../../../lib/design";

const Rows = () => {
  const [products, setProducts] = useState([
    {
      entry_subid: "",
      product_model: "",
      designation: "",
      warranty: "",
    },
  ]);

  return (
    <>
      {products.map((product, index) => (
        <div key={index} className="w-full flex justify-between my-1">
          {Object.keys(product).map((key) => (
            <div key={key}>
              <TextInput
                placeholder={key}
                value={product[key as keyof typeof product]}
                onChange={(e) =>
                  setProducts(
                    products.map((product, i) => {
                      if (index === i)
                        product[key as keyof typeof product] = e.target.value;
                      return product;
                    })
                  )
                }
              />
            </div>
          ))}
        </div>
      ))}
      <div
        className={`w-full flex justify-center border ${PRIMARY_COLOR.border} ${ROUNDED} my-1`}
      >
        <Button
          type="button"
          onClick={() =>
            setProducts((prev) => {
              let newstate = prev;
              newstate = [
                ...prev,
                {
                  entry_subid: "",
                  product_model: "",
                  designation: "",
                  warranty: "",
                },
              ];
              return newstate;
            })
          }
        >
          <PlusCircleIcon className="h-5 w-5 inline" aria-hidden="true" />
        </Button>
      </div>
    </>
  );
};

export default Rows;
