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

export interface IParsedBL {
  client_name?: string;
  bl_id?: string[] | string;
  bl_date?: string[] | string;
  bl_client_name?: string[] | string;
  bl_entry_id?: string[] | string;
  bl_shipment_content?: string[] | string;
  bl_shipping_date?: string[] | string;
  bl_sacomi_exit_id?: string[] | string;
  bl_observations?: string[] | string;
}

export interface IParsedClient {
  client_name?: string;
  client_type?: string;
  client_transporter?: string;
  client_phone_number?: string;
  client_state?: string;
  client_status?: string;
  client_contact?: string;
  client_address?: string;
  client_wilaya?: string;
  client_observations?: string;
  client_blocking?: string;
  job_ids: number[];
}

export interface IParsedEntry {
  id?: number;
  entry_id?: string;
  entry_client_name?: string;
  entry_observations?: string;
  entry_date?: string;
  entry_time?: string;
  entry_warranty?: string;
  entry_global?: string;
}

export interface IParsedJob {
  id: number;
  entry_client_name?: string;
  client_type?: string;
  client_status?: string;
  entry_id?: string;
  job_entry_subid?: string;
  job_entry_date?: string;
  product_type?: string;
  product_brand?: string;
  product_model?: string;
  job_product_serial_number?: string;
  job_repaired_date?: string;
  job_exit_date?: string;
  job_warranty?: string;
  job_designation?: string;
  job_diagnostics?: string;
  job_status?: string;
  job_localisation?: string;
  job_technician?: string;
  job_prestation_id?: string;
  job_stock_parts?: string;
  job_same_model?: string;
  job_new_serial_number?: string;
  job_used_parts?: string;
  job_awaiting_diagnostics?: string;
  job_rma_asus?: string;
}

export interface IParsedPrestation {
  client_name?: string;
  prestation_id?: string[] | string;
  prestation_client_name?: string[] | string;
  prestation_client_type?: string[] | string;
  prestation_date?: string[] | string;
  prestation_billing?: string[] | string;
  prestation_blocking?: string[] | string;
  prestation_is_paid?: string[] | string;
  prestation_payment_date?: string[] | string;
  prestation_invoice?: string[] | string;
  prestation_recovery_date?: string[] | string;
  prestation_payment_mode?: string[] | string;
  prestation_observations?: string[] | string;
  prestation_total_value?: string[] | string;
  prestation_samsung_accessories?: string[] | string;
}
export interface IParsedPrestationDetail {
  client_name?: string;
  prestationdetail_id?: string[] | string;
  prestationdetail_client_name?: string[] | string;
  prestationdetail_date?: string[] | string;
  prestationdetail_designation?: string[] | string;
  prestationdetail_quantity?: string[] | string;
  prestationdetail_ht?: string[] | string;
  prestationdetail_ttc?: string[] | string;
  prestationdetail_subtotal?: string[] | string;
  prestationdetail_total?: string[] | string;
  prestationdetail_final_value?: string[] | string;
}

export interface IParsedProduct {
  product_brand?: string;
  product_model?: string;
  product_type?: string;
  job_ids: number[];
}
