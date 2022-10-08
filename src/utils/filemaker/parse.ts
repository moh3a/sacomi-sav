import { sanitize } from "../index";
import { MAP_SAV_DB } from "../../types";
import { FileMakerXML } from "../../types/sav-xml-data";
import { arrayEquals, assignToObject, ICollection } from "./utils";

export const fm_job_parser = (fm_data: FileMakerXML, fields: string[]) => {
  return fm_data.FMPXMLRESULT.RESULTSET[0].ROW.map((row) => {
    let temp: any = {};
    const id: number = Number(row.$.RECORDID);
    row.COL.map((value, i) => {
      const voc = parseFMCol(value);
      assignToObject(temp, fields[i], voc);
    });
    return { ...temp, job_id: id };
  });
};

export const fm_prestation_details_parser = (
  fm_data: FileMakerXML,
  fields: string[]
) => {
  let data: any[] = [];
  fm_data.FMPXMLRESULT.RESULTSET[0].ROW.map((row) => {
    let max_length = 0;
    let temp: any = {};
    let temp_arr: any[] = [];
    row.COL.forEach((value) => {
      max_length =
        value.DATA && value.DATA.length > max_length
          ? value.DATA.length
          : max_length;
    });
    if (max_length === 1) {
      row.COL.map((value, i) => {
        const voc = parseFMCol(value);
        assignToObject(temp, fields[i], voc);
      });
    } else {
      for (let i = 0; i < max_length; i++) {
        row.COL.forEach((value, index) => {
          if (value.DATA && value.DATA.length === 1) {
            assignToObject(
              temp,
              fields[index],
              value.DATA[0] ? sanitize(value.DATA[0]).toUpperCase() : undefined
            );
          } else if (value.DATA && value.DATA.length > 1) {
            assignToObject(
              temp,
              fields[index],
              value.DATA[i] ? sanitize(value.DATA[i]).toUpperCase() : undefined
            );
          }
        });
        temp_arr.push(temp);
        temp = {};
      }
    }
    if (Object.keys(temp).length > 0) {
      data.push(temp);
    } else if (temp_arr.length > 0) {
      data.push(...temp_arr);
    }
  });
  return data;
};

export const fm_general_parser = (
  fm_data: FileMakerXML,
  fields: string[],
  main_field: string
) => {
  let data: any[] = [];
  fm_data.FMPXMLRESULT.RESULTSET[0].ROW.map((row) => {
    let temp: any = {};
    let client_name: string | undefined;
    row.COL.map((value, i) => {
      const voc = parseFMCol(value);
      if (fields[i] === "client_name") {
        client_name =
          value.DATA && value.DATA[0]
            ? sanitize(value.DATA[0]).toUpperCase()
            : undefined;
        temp.client_name = client_name;
      }
      if (
        (main_field === "product_model" &&
          (fields[i] === "product_type" ||
            fields[i] === "product_brand" ||
            fields[i] === "product_model")) ||
        main_field !== "product_model"
      ) {
        assignToObject(temp, fields[i], voc);
      }
    });
    const exits_index = data.findIndex(
      (v) =>
        (v[main_field] &&
          typeof v[main_field] === "string" &&
          v[main_field] === temp[main_field]) ||
        (Array.isArray(v[main_field]) &&
          arrayEquals(v[main_field], temp[main_field]))
    );
    if (
      exits_index === -1 &&
      Object.keys(temp).length > 0 &&
      temp[main_field]
    ) {
      if (main_field === "product_model") delete temp.client_name;
      data.push({ ...temp });
    }
  });
  return data;
};

export const parseFMDataFields = (
  fm_data: FileMakerXML,
  collection: ICollection
): string[] => {
  const fields = fm_data.FMPXMLRESULT.METADATA[0].FIELD.map((f) => {
    if (f["$"].NAME === "Etat_suit_INTERV") collection.name = "job";
    if (f["$"].NAME === "Date_entree") {
      collection.name = "entry";
      collection.main_field = "entry_id";
    }
    if (f["$"].NAME === "REVENDEUR") {
      collection.name = "prestation";
      collection.main_field = "prestation_id";
    }
    if (f["$"].NAME === "mode de payement") {
      collection.name = "prestationdetails";
      collection.main_field = "prestation_id";
    }
    if (f["$"].NAME === "PERSONNE DE CONTACT") {
      collection.name = "client";
      collection.main_field = "name";
    }
    if (f["$"].NAME === "NUMERO BL") {
      collection.name = "bl";
      collection.main_field = "delivery_id";
    }
    if (f["$"].NAME === "NUMERO BON DE COMMANDE") {
      collection.name = "bc";
      collection.main_field = "order_id";
    }
    const key = Object.keys(MAP_SAV_DB).find((key) => key === f["$"].NAME);
    if (key) return MAP_SAV_DB[key as keyof typeof MAP_SAV_DB];
    else return f["$"].NAME;
  });
  console.log(`> Fields parsed...`);
  return fields;
};

export const parseFMCol = (value: { DATA: any[] }) => {
  let voc: string | (string | undefined)[] | undefined = "";
  if (value.DATA && value.DATA.length === 1) {
    voc = value.DATA[0] ? sanitize(value.DATA[0]).toUpperCase() : undefined;
  }
  // else if (value.DATA && value.DATA.length > 1) {
  //   voc = value.DATA.map((d) => (d ? sanitize(d).toUpperCase() : undefined));
  // }
  else if (!value.DATA || !value.DATA[0]) {
    voc = undefined;
  }
  return voc;
};
