export interface DetailsProps {
  id: number;
}

export interface MigrationsConfig {
  order: number;
  file: string;
  uploaded: boolean;
  canInsert: boolean;
  insertedToDB: boolean;
}

export interface AuthenticationPageProps {
  csrfToken: string | undefined;
}

export interface Collection {
  name:
    | "clients"
    | "entries"
    | "deliveries"
    | "products"
    | "jobs"
    | "prestations"
    | "users"
    | "orders";
}

export interface PageArchitecture {
  title: string;
  collection?: Collection["name"];
  table_titles: {
    name: string;
    field: string;
  }[];
  table_data: (data: any) => any;
  search_layout?: {
    group_fields: {
      name: string;
      field: string;
    }[];
  }[];
  create_layout?: {
    group_fields: {
      name: string;
      field: string;
    }[];
  }[];
}

export interface IUser {
  fullName: string;
  picture: string;
  username: string;
  role: "TECHNICIAN" | "RECEPTION" | "ADMIN";
  password: string;
}

export interface ISession {
  expires: string;
  user?: {
    email?: string;
    image?: string;
    picture?: string;
    name?: string;
    role?: string;
  };
}

export const MAP_SAV_DB = {
  // bons de commande
  "CONTENU DE LA COMMANDE": "order_content",
  "DATE DE COMMANDE": "order_date",
  "DATE DE RECEPTION": "receipt_date",
  "NUMERO BON DE COMMANDE": "order_id",
  "NUMERO DE BON D'ENTREE DANS SAGE": "sage_entry_id",
  OBSERVATION: "observations",
  QUANTITE: "quantity",
  VIREMENT: "payment",

  // clients
  ADRESSE: "address",
  CLIENT: "name",
  "ETAT CLIENT": "status",
  OBS: "observations",
  "PERSONNE DE CONTACT": "contact",
  "REV OU PART": "type",
  TEL: "phone_number",
  WILAYA: "wilaya",

  // bons de livraison
  "DATE DE LIVRAISON": "delivery_date_1",
  "DATE LIVRAISON": "delivery_date",
  "NUMERO BL": "delivery_id",
  "NUMERO DU BON DE RETOUR": "entry_id",
  "NUMERO DU BON DE SORTIE SACOMI": "sage_exit_id",
  // 'CLIENT':					'client_name',
  // 'OBS'		:			'observations',

  // entrees
  "bon de garantie": "warranty",
  Client: "client_name",
  Date_entree: "entry_date",
  global: "global",
  "heure d'entree": "entry_time",
  No_bon: "entry_id",
  // 'OBS'			:		'observations',

  // prestations
  "A FACTURER": "to_bill",
  "DATE DE RECUP": "recovery_date",
  "DATE ENCAISSEMENT": "payment_date",
  "DATE PREST": "prestation_date",
  FACTURE: "invoice",
  "NUMERO PREST": "prestation_id",
  PAYEE: "is_paid",
  REVENDEUR: "client_type",
  "DETAIL PREST::TOTAL": "total_amount",
  // 'OBS'					:'observations',
  // 'CLIENT'			:		'client_name',

  // prestation details
  "mode de payement": "payment_method",
  "CLIENT::BLOCAGE": "client_blocked",
  "CLIENT::ETAT CLIENT": "client_status",
  "CLIENT::OBS": "client_observations",
  "CLIENT::REV OU PART": "client_type",
  "CLIENT::TEL": "client_phone_number",
  "CLIENT::WILAYA": "client_wilaya",
  "DETAIL PREST::DATE PREST": "prestation_date",
  "DETAIL PREST::DESIGNATION": "designation",
  "DETAIL PREST::PRIX HT": "price_ht",
  "DETAIL PREST::PRIX TTC": "price_ttc",
  "DETAIL PREST::QTE": "quantity",
  "DETAIL PREST::SOUS TOTAL": "subtotal",
  // "A FACTURER":				'to_bill',
  // 'CLIENT':					'client_name',
  // "DATE ENCAISSEMENT"		:	'payment_date',
  // 'FACTURE'				:	'invoice',
  // "NUMERO PREST"		:		'prestation_id',
  // 'PAYEE'			:		'is_paid',
  // 'OBS'			:		'observations',
  // "DETAIL PREST::TOTAL"	:		'total_amount',

  // jobs
  "ATTENTE REPARATION": "awaiting_intervention",
  date_entree: "entry_date",
  Daterepare: "repaired_date",
  Datremiseclient: "exit_date",
  Désignation: "designation",
  diagnostiq: "diagnostic",
  Etat_suit_INTERV: "status",
  LOCALISATION: "localisation",
  Marque: "product_brand",
  "même modele": "product_same_model",
  MODEL: "product_model",
  No_serie: "serial_number",
  "nouveau N°S": "new_serial_number",
  "NUMERO DE PREST": "prestation_id",
  "NUMERO PRODUIT DANS LE BON": "entry_subid",
  "PIECE INSTALLEE SORTIE DE STOCK": "used_parts",
  "piece detachée": "spare_parts",
  "RMA ASUS": "rma_asus",
  technicien: "technician",
  Type: "product_type",
  "Entree::Client": "client_name",
  "Entree::No_bon": "entry_id",
  // "bon de garantie": "warranty",
  // "CLIENT::ETAT CLIENT"		:	'client_status',
  // "CLIENT::REV OU PART"	:		'client_type',
};

export interface IProduct {
  product_brand?: string;
  product_model?: string;
  product_type?: string;
}

export interface IClient {
  address?: string;
  name?: string;
  status?: string;
  observations?: string;
  contact?: string;
  type?: string;
  phone_number?: string;
  wilaya?: string;
}

export interface IEntry {
  warranty?: string;
  client_name?: string;
  entry_date?: string;
  global?: string;
  entry_time?: string;
  entry_id?: string;
  observations?: string;
}

export interface IJob {
  job_id?: number;
  entry_id?: string;
  entry_date?: string;
  client_name?: string;
  client_type?: string;
  client_status?: string;
  product_model?: string;
  product_brand?: string;
  product_type?: string;
  prestation_id?: string;
  awaiting_intervention?: string;
  warranty?: string;
  repaired_date?: string;
  exit_date?: string;
  designation?: string;
  diagnostic?: string;
  status?: string;
  localisation?: string;
  technician?: string;
  entry_subid?: string;
  serial_number?: string;
  product_same_model?: string;
  new_serial_number?: string;
  used_parts?: string;
  spare_parts?: string;
  rma_asus?: string;
}

export interface IPrestation {
  prestation_id?: string;
  prestation_date?: string;
  client_name?: string;
  client_type?: string;
  is_paid?: string;
  to_bill?: string;
  recovery_date?: string;
  payment_date?: string;
  invoice?: string;
  observations?: string;
  prestation_amount?: string;
}

export interface IPrestationDetails {
  prestation_id?: string;
  client_name?: string;
  client_blocked?: string;
  client_status?: string;
  client_observations?: string;
  client_type?: string;
  client_phone_number?: string;
  client_wilaya?: string;
  is_paid?: string;
  to_bill?: string;
  payment_date?: string;
  payment_method?: string;
  invoice?: string;
  prestation_date?: string;
  designation?: string;
  price_ht?: string;
  price_ttc?: string;
  quantity?: string;
  subtotal?: string;
  total_amount?: string;
  observations?: string;
}

export interface IDelivery {
  delivery_id?: string;
  delivery_date?: string;
  client_name?: string;
  entry_id?: string;
  sage_exit_id?: string;
  delivery_date_1?: string;
  observations?: string;
}

export interface IOrder {
  order_content?: string;
  order_date?: string;
  receipt_date?: string;
  order_id?: string;
  sage_entry_id?: string;
  observations?: string;
  quantity?: string;
  payment?: string;
}
