export interface ICollection {
  name:
    | "job"
    | "prestation"
    | "entry"
    | "client"
    | "product"
    | "bl"
    | "prestationdetails"
    | "bc"
    | "";
  main_field: string;
}

import { NextApiResponse } from "next";
import { FileMakerXML } from "../../types/sav-xml-data";
export interface IParseFMData {
  res: NextApiResponse;
  fm_data: FileMakerXML;
  save: "file" | "db";
  filePath: string;
}

export const assignToObject = (
  field_object: {},
  field_name: string,
  field_value: string | (string | undefined)[] | undefined
) => {
  Object.defineProperty(field_object, field_name, {
    value: field_value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
};

// check equality in arrays (not array of objects)
export const arrayEquals = (a: string[], b: string[]) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

export const formatFMDate = (d: string | undefined | null) => {
  if (d)
    return d.substring(0, 2) + "/" + d.substring(2, 4) + "/" + d.substring(4);
};

export const formatFMTime = (t: string | undefined | null) => {
  if (t) {
    if (t.length === 5) {
      return "0" + t.substring(0, 1) + ":" + t.substring(1, 3);
    } else {
      return t.substring(0, 2) + ":" + t.substring(2, 4);
    }
  }
};
