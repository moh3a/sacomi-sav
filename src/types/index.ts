export interface MigrationsConfig {
  order: number;
  collection: CollectionsNames;
  model: PrismaCollectionsNames;
  name: string;
  file: string;
  uploaded: boolean;
  canInsert: boolean;
  insertedToDB: boolean;
}

export type PrismaCollectionsNames =
  | "client"
  | "entry"
  | "delivery"
  | "product"
  | "job"
  | "prestation"
  | "prestationDetails"
  | "config"
  | "user"
  | "order"
  | "part"
  | "stock";

export type CollectionsNames =
  | "clients"
  | "entries"
  | "deliveries"
  | "products"
  | "jobs"
  | "prestations"
  | "prestationDetails"
  | "users"
  | "transactions"
  | "orders";

export type CollectionsBaseUnit =
  | "client"
  | "entry"
  | "delivery"
  | "product"
  | "job"
  | "prestation"
  | "user"
  | "transaction"
  | "order";

export type CollectionsWithGeneratedIds =
  | "deliveries"
  | "entries"
  | "jobs"
  | "orders"
  | "prestations";

export type CollectionsCreatedInRows = "jobs" | "prestationDetails";

export interface PageArchitecture {
  title: string;
  collection?: CollectionsNames;
  unit?: CollectionsBaseUnit;
  url?: string;
  table_titles: TableTitle[];
  table_data: (data: any) => any;
  search_layout?: SearchLayout[];
  create_layout?: DataLayout[];
}

export interface TableTitle {
  name: string;
  isImage?: boolean;
  isBadge?: boolean;
  badgeType?: "success" | "warning" | "danger";
}

export interface DataLayout {
  group_title?: string;
  group_fields: Column[];
  findOrCreateClient?: boolean;
  rows?: boolean;
  rows_collection?: CollectionsCreatedInRows;
  row_fields?: Column[][];
}

export interface SearchLayout {
  group_title?: string;
  group_fields: Column[];
}

import { HTMLInputTypeAttribute } from "react";
export interface Column {
  name: string;
  field: string;
  unique?: boolean;
  collection?: CollectionsNames;
  unit?: CollectionsBaseUnit;
  value: any;
  required?: boolean;
  autogenerated?: boolean;
  type?: HTMLInputTypeAttribute;
  autocomplete?: boolean;
  dropdown?: boolean;
  textarea?: boolean;
  readonly?: boolean;
  size?: number;
  index?: boolean;
  options?: {
    name: string;
    value: string;
  }[];
}

export interface ISession {
  expires: string;
  user?: {
    email?: string;
    image?: string;
    picture?: string;
    name?: string;
    role?: "TECHNICIAN" | "RECEPTION" | "ADMIN";
  };
}
