import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";

import Button from "./Button";
import TextInput from "./TextInput";

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
        <div key={index} className="w-full flex justify-around">
          {Object.keys(product).map((key, idx) => (
            <div key={idx}>
              <TextInput
                placeholder={key}
                value={product[key as keyof typeof product]}
                onChange={(e) =>
                  setProducts((prev) => {
                    let newstate = prev;
                    newstate[index][key as keyof typeof product] =
                      e.target.value;
                    console.log(newstate);
                    return newstate;
                  })
                }
              />
            </div>
          ))}
        </div>
      ))}
      <div>
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
