import { writeFile } from "fs";
import { NextApiResponse } from "next";

import { geenrate_random_string, sanitize } from ".";
import { Collection } from "../types";
import { FileMakerXML } from "../types/sav-xml-data";

interface XMLConverter {
  xml_field: string;
  converted_name: string;
  type: "string" | "number" | "date" | "time" | "boolean";
  required?: boolean;
}

interface FMConverter {
  collection: Collection["name"];
  field_to_select: string;
  main_field?: string;
  mapping: XMLConverter[];
}

export const CONVERT_FM_DATA: FMConverter[] = [
  {
    collection: "jobs",
    field_to_select: "Etat_suit_INTERV",
    main_field: "job_id",
    mapping: [
      {
        xml_field: "ATTENTE REPARATION",
        converted_name: "awaiting_intervention",
        type: "string",
      },
      {
        xml_field: "bon de garantie",
        converted_name: "warranty",
        type: "date",
      },
      { xml_field: "date_entree", converted_name: "entry_date", type: "date" },
      {
        xml_field: "Daterepare",
        converted_name: "repaired_date",
        type: "date",
      },
      {
        xml_field: "Datremiseclient",
        converted_name: "exit_date",
        type: "date",
      },
      {
        xml_field: "Désignation",
        converted_name: "designation",
        type: "string",
      },
      {
        xml_field: "diagnostiq",
        converted_name: "diagnostics",
        type: "string",
      },
      {
        xml_field: "Etat_suit_INTERV",
        converted_name: "status",
        type: "string",
      },
      {
        xml_field: "LOCALISATION",
        converted_name: "localisation",
        type: "string",
      },
      {
        xml_field: "même modele",
        converted_name: "product_same_model",
        type: "string",
      },
      {
        xml_field: "No_serie",
        converted_name: "serial_number",
        type: "string",
      },
      {
        xml_field: "nouveau N°S",
        converted_name: "new_serial_number",
        type: "string",
      },
      {
        xml_field: "NUMERO DE PREST",
        converted_name: "prestation_id",
        type: "string",
      },
      {
        xml_field: "NUMERO PRODUIT DANS LE BON",
        converted_name: "entry_subid",
        type: "number",
      },
      {
        xml_field: "piece detachée",
        converted_name: "spare_parts",
        type: "string",
      },
      {
        xml_field: "PIECE INSTALLEE SORTIE DE STOCK",
        converted_name: "used_parts",
        type: "string",
      },
      { xml_field: "RMA ASUS", converted_name: "rma_asus", type: "string" },
      { xml_field: "technicien", converted_name: "technician", type: "string" },
      {
        xml_field: "CLIENT::ETAT CLIENT",
        converted_name: "client_status",
        type: "string",
      },
      {
        xml_field: "CLIENT::REV OU PART",
        converted_name: "client_type",
        type: "string",
      },
      {
        xml_field: "Entree::Client",
        converted_name: "client_name",
        type: "string",
      },
      {
        xml_field: "Entree::No_bon",
        converted_name: "entry_id",
        type: "string",
      },
      { xml_field: "Type", converted_name: "product_type", type: "string" },
      { xml_field: "Marque", converted_name: "product_brand", type: "string" },
      { xml_field: "MODEL", converted_name: "product_model", type: "string" },
    ],
  },
  {
    collection: "entries",
    field_to_select: "Date_entree",
    main_field: "entry_id",
    mapping: [
      { xml_field: "Client", converted_name: "client_name", type: "string" },
      { xml_field: "Date_entree", converted_name: "entry_date", type: "date" },
      {
        xml_field: "heure d'entree",
        converted_name: "entry_time",
        type: "time",
      },
      { xml_field: "No_bon", converted_name: "entry_id", type: "string" },
      { xml_field: "OBS", converted_name: "observations", type: "string" },
    ],
  },
  {
    collection: "prestations",
    field_to_select: "REVENDEUR",
    main_field: "prestation_id",
    mapping: [
      { xml_field: "A FACTURER", converted_name: "to_bill", type: "string" },
      { xml_field: "CLIENT", converted_name: "client_name", type: "string" },
      {
        xml_field: "DATE DE RECUP",
        converted_name: "recovery_date",
        type: "date",
      },
      {
        xml_field: "DATE ENCAISSEMENT",
        converted_name: "payment_date",
        type: "date",
      },
      {
        xml_field: "DATE PREST",
        converted_name: "prestation_date",
        type: "date",
      },
      { xml_field: "FACTURE", converted_name: "invoice", type: "string" },
      {
        xml_field: "NUMERO PREST",
        converted_name: "prestation_id",
        type: "string",
      },
      { xml_field: "OBS", converted_name: "observations", type: "string" },
      { xml_field: "REVENDEUR", converted_name: "client_type", type: "string" },
      { xml_field: "PAYEE", converted_name: "is_paid", type: "boolean" },
    ],
  },
  {
    collection: "prestationDetails",
    field_to_select: "DETAIL PREST::QTE",
    main_field: "prestation_id",
    mapping: [
      {
        xml_field: "DETAIL PREST::TOTAL",
        converted_name: "total_amount",
        type: "number",
      },
      {
        xml_field: "DETAIL PREST::SOUS TOTAL",
        converted_name: "subtotal",
        type: "number",
      },
      {
        xml_field: "DETAIL PREST::QTE",
        converted_name: "quantity",
        type: "number",
      },
      {
        xml_field: "DETAIL PREST::PRIX TTC",
        converted_name: "price_ttc",
        type: "number",
      },
      {
        xml_field: "DETAIL PREST::PRIX HT",
        converted_name: "price_ht",
        type: "number",
      },
      {
        xml_field: "DETAIL PREST::DESIGNATION",
        converted_name: "designation",
        type: "string",
      },
      {
        xml_field: "DETAIL PREST::DATE PREST",
        converted_name: "prestation_date",
        type: "date",
      },
      {
        xml_field: "NUMERO PREST",
        converted_name: "prestation_id",
        type: "string",
      },
    ],
  },
  {
    collection: "clients",
    field_to_select: "PERSONNE DE CONTACT",
    main_field: "name",
    mapping: [
      { xml_field: "ADRESSE", converted_name: "address", type: "string" },
      { xml_field: "CLIENT", converted_name: "name", type: "string" },
      { xml_field: "ETAT CLIENT", converted_name: "status", type: "string" },
      { xml_field: "OBS", converted_name: "observations", type: "string" },
      {
        xml_field: "PERSONNE DE CONTACT",
        converted_name: "contact",
        type: "string",
      },
      { xml_field: "REV OU PART", converted_name: "type", type: "string" },
      { xml_field: "TEL", converted_name: "phone_number", type: "string" },
      { xml_field: "WILAYA", converted_name: "wilaya", type: "string" },
    ],
  },
  {
    collection: "deliveries",
    field_to_select: "NUMERO BL",
    main_field: "delivery_id",
    mapping: [
      { xml_field: "CLIENT", converted_name: "client_name", type: "string" },
      {
        xml_field: "CONTENU LIVRAISON",
        converted_name: "delivery_content",
        type: "string",
      },
      {
        xml_field: "DATE DE LIVRAISON",
        converted_name: "date_delivered",
        type: "string",
      },
      {
        xml_field: "DATE LIVRAISON",
        converted_name: "delivery_date",
        type: "date",
      },
      { xml_field: "NUMERO BL", converted_name: "delivery_id", type: "string" },
      {
        xml_field: "NUMERO DU BON DE RETOUR",
        converted_name: "entry_id",
        type: "string",
      },
      {
        xml_field: "NUMERO DU BON DE SORTIE SACOMI",
        converted_name: "sage_exit_id",
        type: "string",
      },
      { xml_field: "OBS", converted_name: "observations", type: "string" },
    ],
  },
  {
    collection: "orders",
    field_to_select: "NUMERO BON DE COMMANDE",
    main_field: "order_id",
    mapping: [
      {
        xml_field: "CONTENU DE LA COMMANDE",
        converted_name: "order_content",
        type: "string",
      },
      {
        xml_field: "DATE DE COMMANDE",
        converted_name: "order_date",
        type: "date",
      },
      {
        xml_field: "DATE DE RECEPTION",
        converted_name: "receipt_date",
        type: "date",
      },
      {
        xml_field: "NUMERO BON DE COMMANDE",
        converted_name: "order_id",
        type: "string",
      },
      {
        xml_field: "NUMERO DE BON D'ENTREE DANS SAGE",
        converted_name: "sage_entry_id",
        type: "string",
      },
      {
        xml_field: "OBSERVATION",
        converted_name: "observations",
        type: "string",
      },
      { xml_field: "QUANTITE", converted_name: "quantity", type: "number" },
      { xml_field: "VIREMENT", converted_name: "payment", type: "string" },
    ],
  },
];

export interface ICollection {
  name: Collection["name"] | string;
  main_field: string;
}

export interface IParseFMData {
  res: NextApiResponse;
  fm_data: FileMakerXML;
  save: "file" | "db";
  filePath: string;
}

export const assignToObject = (
  field_object: {},
  field_name: string,
  field_value: any
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

export const FormatFMDate = (d: string | undefined | null) => {
  if (d)
    return (
      d.substring(4, 8) + "/" + d.substring(2, 4) + "/" + d.substring(0, 2)
    );
};

export const FormatFMTime = (t: string | undefined | null) => {
  if (t) {
    if (t.length === 5) {
      return "0" + t.substring(0, 1) + ":" + t.substring(1, 3);
    } else {
      return t.substring(0, 2) + ":" + t.substring(2, 4);
    }
  }
};

export const ParseFMFields = (
  fm_data: FileMakerXML,
  collection: ICollection
) => {
  let selected: FMConverter | undefined;
  fm_data.FMPXMLRESULT.METADATA[0].FIELD.forEach((f) => {
    let desired = CONVERT_FM_DATA.find(
      (model) => model.field_to_select === f["$"].NAME
    );
    if (desired) {
      selected = desired;
      return;
    }
  });

  if (selected) {
    const fields = fm_data.FMPXMLRESULT.METADATA[0].FIELD.map((f) => {
      collection.name = selected?.collection ?? "";
      collection.main_field = selected?.main_field ?? "";
      const key = selected?.mapping.find(
        (field) => field.xml_field === f["$"].NAME
      );
      return key;
    });
    console.log(`> Fields parsed...`);
    return fields;
  } else return undefined;
};

export const SanitizeValue = (
  value: any,
  type: "string" | "number" | "date" | "time" | "boolean"
) => {
  if (type === "number") {
    return Number(value);
  } else if (type === "date") {
    return FormatFMDate(sanitize(value).toUpperCase());
  } else if (type === "time") {
    return FormatFMTime(sanitize(value).toUpperCase());
  } else if (type === "boolean") {
    return sanitize(value).toUpperCase() === "NON" ? false : true;
  } else return sanitize(value).toUpperCase();
};

export const ParseFMColumns = (
  value: { DATA: any[] },
  type: "string" | "number" | "date" | "time" | "boolean"
) => {
  if (value.DATA && value.DATA.length === 1) {
    return value.DATA[0] ? SanitizeValue(value.DATA[0], type) : undefined;
  } else if (value.DATA && value.DATA.length > 1) {
    return value.DATA.map((d) => (d ? SanitizeValue(d, type) : undefined));
  } else if (!value.DATA || !value.DATA[0]) {
    return undefined;
  }
};

export const DataParser = (
  fm_data: FileMakerXML,
  main_field: string,
  fields?: (XMLConverter | undefined)[]
) => {
  let data: any[] = [];
  if (fields)
    fm_data.FMPXMLRESULT.RESULTSET[0].ROW.map((row) => {
      let max_length = 0;
      let temp: any = {};
      let temp_arr: any[] = [];
      const id = Number(row.$.RECORDID);
      row.COL.forEach((value) => {
        max_length =
          value.DATA && value.DATA.length > max_length
            ? value.DATA.length
            : max_length;
      });
      if (max_length === 1) {
        row.COL.map((value, i) => {
          if (fields[i]?.converted_name === "client_name")
            temp.client_name =
              value.DATA && value.DATA[0]
                ? SanitizeValue(value.DATA[0], fields[i]?.type ?? "string")
                : undefined;
          if (main_field === "job_id") temp.job_id = id;
          if (
            (main_field === "product_model" &&
              (fields[i]?.converted_name === "product_type" ||
                fields[i]?.converted_name === "product_brand" ||
                fields[i]?.converted_name === "product_model")) ||
            main_field !== "product_model"
          ) {
            assignToObject(
              temp,
              fields[i]?.converted_name ?? "",
              ParseFMColumns(value, fields[i]?.type ?? "string")
            );
          }
        });
      } else {
        for (let i = 0; i < max_length; i++) {
          row.COL.forEach((value, index) => {
            if (value.DATA && value.DATA.length === 1) {
              assignToObject(
                temp,
                fields[index]?.converted_name ?? "",
                value.DATA[0]
                  ? SanitizeValue(
                      value.DATA[0],
                      fields[index]?.type ?? "string"
                    )
                  : undefined
              );
            } else if (value.DATA && value.DATA.length > 1) {
              assignToObject(
                temp,
                fields[index]?.converted_name ?? "",
                value.DATA[i]
                  ? SanitizeValue(
                      value.DATA[i],
                      fields[index]?.type ?? "string"
                    )
                  : undefined
              );
            }
          });
          temp_arr.push(temp);
          temp = {};
        }
      }
      const index_exist = data.findIndex(
        (v) =>
          (v[main_field] &&
            typeof v[main_field] === "string" &&
            v[main_field] === temp[main_field]) ||
          (Array.isArray(v[main_field]) &&
            arrayEquals(v[main_field], temp[main_field]))
      );

      if (index_exist === -1) {
        if (Object.keys(temp).length > 0) {
          if (main_field === "product_model") delete temp.client_name;
          if (!temp[main_field]) temp[main_field] = geenrate_random_string(7);
          data.push(temp);
        } else if (temp_arr.length > 0) {
          data.push(...temp_arr);
        }
      }
    });
  return data;
};

export const WriteToFile = (
  res: NextApiResponse,
  filePath: string,
  data: any[]
) => {
  console.log(`> Writing file to: ${filePath}`);
  writeFile(filePath, JSON.stringify(data), { encoding: "utf8" }, (err) => {
    if (err) console.log(err.message);
    console.log("> Done !");
    res
      .status(200)
      .json({ success: true, message: "Fichier télécharger avec succés." });
  });
};

export const WriteData = async ({
  res,
  fm_data,
  save,
  filePath,
}: IParseFMData) => {
  let collection: ICollection = { name: "", main_field: "" };
  const fields = ParseFMFields(fm_data, collection);

  if (fields && collection.name) {
    let data: any[] = [];
    let product_data: any[] = [];

    data = DataParser(fm_data, collection.main_field, fields);
    if (collection.name === "jobs") {
      product_data = DataParser(fm_data, "product_model", fields);
    }

    if (save === "file") {
      const fp = filePath.replace(".xml", ".json");
      if (product_data.length > 0)
        WriteToFile(res, fp.replace("tableau", "produits"), product_data);
      WriteToFile(res, fp, data);
    }
  } else {
    res.status(200).json({
      success: false,
      message: `Erreur: Fichier ${filePath} n'est pas valid comme format FileMaker XML.`,
    });
  }
};
