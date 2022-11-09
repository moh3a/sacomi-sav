import { writeFile } from "fs";
import { NextApiResponse } from "next";

import { geenrate_random_string, sanitize } from ".";
import { CollectionsNames, PrismaCollectionsNames } from "../types";
import { FileMakerXML } from "../types/sav-xml-data";

interface XMLConverter {
  xml_field: string;
  converted_name: string;
  type: "string" | "number" | "date" | "time" | "boolean";
  required?: boolean;
}

interface FMConverter {
  collection: CollectionsNames;
  prisma_model: PrismaCollectionsNames;
  field_to_select: string;
  main_field?: string;
  mapping: XMLConverter[];
}

export const CONVERT_FM_DATA: FMConverter[] = [
  {
    collection: "jobs",
    prisma_model: "job",
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
    prisma_model: "entry",
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
    prisma_model: "prestation",
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
    prisma_model: "prestationDetails",
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
    prisma_model: "client",
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
    prisma_model: "delivery",
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
        type: "date",
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
    prisma_model: "order",
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

interface ICollection {
  name: CollectionsNames;
  prisma_model: PrismaCollectionsNames;
  main_field: string;
}

interface IParseFMData {
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
  let fields: (XMLConverter | undefined)[] = [];
  fm_data.FMPXMLRESULT.METADATA[0].FIELD.forEach((f) => {
    let desired = CONVERT_FM_DATA.find(
      (model) => model.field_to_select === f["$"].NAME
    );
    if (desired) {
      fields = fm_data.FMPXMLRESULT.METADATA[0].FIELD.map((f) => {
        if (desired) {
          collection.name = desired.collection;
          collection.prisma_model = desired.prisma_model;
        }
        collection.main_field = desired?.main_field ?? "";
        const key = desired?.mapping.find(
          (field) => field.xml_field === f["$"].NAME
        );
        return key;
      });
      return;
    }
  });

  if (fields.length > 0) {
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
  collection: ICollection,
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
          if (collection.main_field === "job_id") temp.job_id = id;
          if (
            (collection.main_field === "product_model" &&
              (fields[i]?.converted_name === "product_type" ||
                fields[i]?.converted_name === "product_brand" ||
                fields[i]?.converted_name === "product_model")) ||
            collection.main_field !== "product_model"
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
          (v[collection.main_field] &&
            typeof v[collection.main_field] === "string" &&
            v[collection.main_field] === temp[collection.main_field]) ||
          (Array.isArray(v[collection.main_field]) &&
            arrayEquals(v[collection.main_field], temp[collection.main_field]))
      );

      if (index_exist === -1) {
        if (Object.keys(temp).length > 0) {
          if (collection.main_field === "product_model")
            delete temp.client_name;
          if (
            !temp[collection.main_field] &&
            collection.main_field !== "product_model"
          )
            temp[collection.main_field] = geenrate_random_string(8);
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
  });
};

export const WriteData = async ({
  res,
  fm_data,
  save,
  filePath,
}: IParseFMData) => {
  let collection: ICollection = {
    name: "users",
    prisma_model: "user",
    main_field: "",
  };
  const fields = ParseFMFields(fm_data, collection);

  if (fields && collection.name) {
    let data: any[] = [];
    let product_data: any[] = [];

    data = DataParser(fm_data, collection, fields);
    if (collection.name === "jobs") {
      product_data = DataParser(
        fm_data,
        {
          name: "products",
          prisma_model: "product",
          main_field: "product_model",
        },
        fields
      );
    }

    if (save === "file") {
      const fp = filePath.replace(".xml", ".json");
      if (product_data.length > 0)
        WriteToFile(res, fp.replace("tableau", "produits"), product_data);
      WriteToFile(res, fp, data);
      res
        .status(200)
        .json({ success: true, message: "Fichier télécharger avec succés." });
    } else if (save === "db") {
      if (product_data.length > 0)
        await InsertFMDataToDB(
          {
            name: "products",
            prisma_model: "product",
            main_field: "product_model",
          },
          product_data
        );
      await InsertFMDataToDB(collection, data);
    }
  } else {
    res.status(200).json({
      success: false,
      message: `Erreur: Fichier ${filePath} n'est pas valid comme format FileMaker XML.`,
    });
  }
};

const Products2insert = (data: any[]) => {
  return data
    .map((item: any) => {
      if (item.product_model) {
        item = {
          product_model: item.product_model,
          product_brand: item.product_brand,
          product_type: item.product_type,
        };
        return item;
      } else return undefined;
    })
    .filter((e: any) => typeof e !== "undefined");
};

const Orders2insert = (data: any[]) => {
  return data
    .map((item: any) => {
      item.order_date = new Date(item.order_date) ?? undefined;
      item.receipt_date = new Date(item.receipt_date) ?? undefined;
      return item;
    })
    .filter((e: any) => typeof e !== "undefined");
};

const Entries2insert = async (data: any[]) => {
  return await Promise.all(
    data
      .map(async (item: any) => {
        if (item.client_name) {
          const client = await prisma.client.findUnique({
            where: { name: item.client_name },
            select: { id: true },
          });
          if (client) {
            delete item.client_name;
            item.entry_date = new Date(item.entry_date) ?? undefined;

            return { ...item, clientId: client?.id };
          } else return undefined;
        } else return undefined;
      })
      .filter((e: any) => typeof e !== "undefined")
  );
};

const Deliveries2insert = async (data: any[]) => {
  return await Promise.all(
    data
      .map(async (item: any) => {
        if (item.client_name) {
          const client = await prisma.client.findUnique({
            where: { name: item.client_name },
            select: { id: true },
          });
          if (client) {
            delete item.client_name;
            item.delivery_date = new Date(item.delivery_date) ?? undefined;
            item.date_delivered = new Date(item.date_delivered) ?? undefined;

            return { ...item, clientId: client?.id };
          } else return undefined;
        } else return undefined;
      })
      .filter((e: any) => typeof e !== "undefined")
  );
};

const Prestations2insert = async (data: any[]) => {
  return await Promise.all(
    data
      .map(async (item: any) => {
        if (item.client_name) {
          const client = await prisma.client.findUnique({
            where: { name: item.client_name },
            select: { id: true },
          });
          if (client) {
            delete item.client_name;
            delete item.client_type;
            item.prestation_date = new Date(item.prestation_date) ?? undefined;
            item.recovery_date = new Date(item.recovery_date) ?? undefined;
            item.payment_date = new Date(item.payment_date) ?? undefined;

            return { ...item, clientId: client?.id };
          } else return undefined;
        } else return undefined;
      })
      .filter((e: any) => typeof e !== "undefined")
  );
};

const PrestationDetails2insert = async (data: any[]) => {
  return await Promise.all(
    data
      .map(async (item: any) => {
        if (item.prestation_id) {
          const prestation = await prisma.prestation.findUnique({
            where: { prestation_id: item.prestation_id },
            select: { id: true },
          });
          if (prestation) {
            delete item.prestation_id;
            item.quantity = item.quantity ? parseInt(item.quantity) : undefined;
            return { prestationId: prestation.id, ...item };
          } else return undefined;
        } else return undefined;
      })
      .filter((e: any) => typeof e !== "undefined")
  );
};

const Jobs2insert = async (data: any[]) => {
  return await Promise.all(
    data
      .map(async (item: any) => {
        let entry, product;
        if (item.entry_id)
          entry = await prisma.entry.findUnique({
            where: { entry_id: item.entry_id },
            include: { client: true },
          });
        if (item.product_model)
          product = await prisma.product.findUnique({
            where: { product_model: item.product_model },
          });
        if (entry && product) {
          delete item.product_model;
          delete item.product_type;
          delete item.product_brand;
          delete item.entry_id;
          item.entryId = entry?.id;
          item.clientId = entry?.client.id;
          item.productId = product?.id;
          item.repaired_date = item.repaired_date
            ? new Date(item.repaired_date)
            : undefined;
          item.exit_date = item.exit_date
            ? new Date(item.exit_date)
            : undefined;
          return item;
        } else return undefined;
      })
      .filter((e: any) => typeof e !== "undefined")
  );
};

import prisma from "../../lib/prisma";
export const InsertFMDataToDB = async (collection: ICollection, data: any) => {
  let data2insert: any[] = [];
  if (collection.name === "clients") data2insert = data;
  else if (collection.name === "products") data2insert = Products2insert(data);
  else if (collection.name === "orders") data2insert = Orders2insert(data);
  else if (collection.name === "entries")
    data2insert = await Entries2insert(data);
  else if (collection.name === "deliveries")
    data2insert = await Deliveries2insert(data);
  else if (collection.name === "prestations")
    data2insert = await Prestations2insert(data);
  else if (collection.name === "prestationDetails")
    data2insert = await PrestationDetails2insert(data);
  else if (collection.name === "jobs") data2insert = await Jobs2insert(data);
  else throw new Error("Cette collection n'existe pas.");

  // @ts-ignore
  await prisma[collection.prisma_model].createMany({
    data: data2insert,
    skipDuplicates: true,
  });
};
