import {
  Client,
  Delivery,
  Entry,
  Job,
  Order,
  Prestation,
  Prisma,
  Product,
  Transaction,
  User,
} from "@prisma/client";
import { Collection, Column, PageArchitecture } from "../src/types";

export const ENTREPRISE_NAME = "Sacomi";
export const SERVICE_NAME = "Service après-vente";
export const BRANDS = ["Thomson", "Vidéale"];

export const APP_TITLE = `${SERVICE_NAME} ${BRANDS[0]} | ${ENTREPRISE_NAME}`;
export const PAGE_TITLE = `| ${ENTREPRISE_NAME} ${SERVICE_NAME}`;
export const ITEMS_PER_PAGE = 10;

export const ERROR_MESSAGES = {
  unknown_server_error: "Erreur serveur inconnue.",
  method_not_allowed: (method: string | undefined) =>
    `Erreur: Méthode ${(method || "").toUpperCase()} non acceptée.`,
  session_error:
    "Erreur: Impossible d'effectuer la requête. Vous devez être connectés.",
  unauthorized_error: `Vous n'êtes pas autorisés à faire cette action.`,
  file_format: (format: string | undefined) =>
    `Erreur: Format fichier non supporté pour ${format}.`,
  file_read: "Erreur: Impossible de lire ce fichier.",
  cash_register_not_found: "Erreur: Caisse introuvable.",
};

export const PAGES = [
  { name: "Interventions", url: "/jobs" },
  { name: "Entrées", url: "/entries" },
  { name: "Prestations", url: "/prestations" },
  { name: "Caisse", url: "/transactions" },
  { name: "Livraisons", url: "/deliveries" },
  { name: "Commandes", url: "/orders" },
  { name: "Produits", url: "/products" },
  { name: "Stock", url: "/stock" },
  { name: "Clients", url: "/clients" },
  { name: "Personnel", url: "/staff" },
  { name: "Paramètres", url: "/settings" },
];

const BASIC_ENTRY_PRODUCTS: Column[] = [
  {
    name: "N°",
    field: "entry_subid",
    value: "",
    index: true,
  },
  {
    name: "Modèle du produit",
    field: "product_model",
    collection: "products",
    unit: "product",
    value: "",
    autocomplete: true,
  },
  {
    name: "Désignation",
    field: "designation",
    value: "",
  },
  {
    name: "Garantie",
    field: "warranty",
    value: "",
  },
];

const BASIC_PRESTATION_SERVICES: Column[] = [
  {
    name: "Désignation",
    field: "designation",
    value: "",
    type: "text",
    required: true,
  },
  {
    name: "Quantité",
    field: "quantity",
    value: "",
    size: 4,
    type: "number",
  },
  {
    name: "HT",
    field: "price_ht",
    value: "",
    type: "number",
  },
  {
    name: "TTC",
    field: "price_ttc",
    value: "",
    type: "number",
  },
  {
    name: "Sous-total",
    field: "subtotal",
    value: "",
    type: "number",
  },
];

type PageEntry<T extends {}> = { [K in Collection["name"]]: T };

export const PAGE_ARCHITECTURE: PageEntry<PageArchitecture> = {
  // ENTREES
  entries: {
    title: "Entrées",
    collection: "entries",
    unit: "entry",
    url: "/entries",
    table_titles: [
      { name: "Date", field: "entry_date" },
      { name: "ID", field: "entry_id" },
      { name: "Client", field: "client_name" },
      { name: "Numéro de téléphone", field: "client_phone_number" },
      { name: "Heure", field: "entry_time" },
    ],
    table_data: (data: any) =>
      data.map(
        (
          entry: Entry & {
            client: Client;
            _count: Prisma.EntryCountOutputType;
          }
        ) => {
          return [
            entry.id,
            entry.entry_date || "",
            entry.entry_id || "",
            entry.client?.name || "",
            entry.client?.phone_number || "",
            entry.entry_time || "",
          ];
        }
      ),
    search_layout: [
      {
        group_title: "Entrée",
        group_fields: [
          { name: "ID Entrée", field: "entry_id", value: "" },
          { name: "Date d'entrée", field: "entry_date", value: "" },
        ],
      },
      {
        group_title: "Client",
        group_fields: [{ name: "Nom du client", field: "name", value: "" }],
      },
    ],
    create_layout: [
      {
        group_fields: [
          {
            name: "ID d'entrée",
            field: "entry_id",
            value: "",
            autogenerated: true,
            required: true,
          },
        ],
      },
      { group_title: "Client", findOrCreateClient: true, group_fields: [] },
      {
        group_title: "Entrées",
        group_fields: BASIC_ENTRY_PRODUCTS,
        row_fields: [BASIC_ENTRY_PRODUCTS],
        rows: true,
        rows_collection: "jobs",
      },
    ],
  },
  // CLIENTS
  clients: {
    title: "Clients",
    collection: "clients",
    unit: "client",
    url: "/clients",
    table_titles: [
      { name: "Nom", field: "client_name" },
      { name: "Type", field: "client_type" },
      { name: "Numéro de téléphone", field: "client_phone_number" },
      { name: "Etat", field: "client_status" },
    ],
    table_data: (data: any) =>
      data.map((client: Client) => {
        return [
          client.id,
          client.name || "",
          client.type || "",
          client.phone_number || "",
          client.status || "",
        ];
      }),
    search_layout: [
      {
        group_fields: [
          { name: "Nom du client", field: "name", value: "" },
          { name: "Type du client", field: "type", value: "" },
        ],
      },
    ],
    create_layout: [
      {
        group_title: "Infos",
        group_fields: [
          {
            name: "Nom du client",
            field: "name",
            value: "",
            unique: true,
            required: true,
          },
          {
            name: "Revendeur / Particulier",
            field: "type",
            value: "",
            type: "radio",
            options: [
              { name: "Revendeur", value: "REVENDEUR" },
              { name: "Particulier", value: "PARTICULIER" },
            ],
          },
          { name: "Etat du client", field: "status", value: "" },
        ],
      },
      {
        group_title: "Contact",
        group_fields: [
          { name: "Numéro du téléphone", field: "phone_number", value: "" },
          { name: "Contact", field: "contact", value: "" },
          { name: "Addresse", field: "address", value: "" },
          { name: "Wilaya", field: "wilaya", value: "" },
        ],
      },
    ],
  },
  // PRODUITS
  products: {
    title: "Produits",
    collection: "products",
    unit: "product",
    url: "/products",
    table_titles: [
      { name: "Type", field: "product_type" },
      { name: "Marque", field: "product_brand" },
      { name: "Modèle", field: "product_model" },
    ],
    table_data: (data: any) =>
      data.map((product: Product) => {
        return [
          product.id,
          product.product_type || "",
          product.product_brand || "",
          product.product_model || "",
        ];
      }),
    search_layout: [
      {
        group_fields: [
          { name: "Type du produit", field: "product_type", value: "" },
          { name: "Marque du produit", field: "product_brand", value: "" },
          { name: "Modèle du produit", field: "product_model", value: "" },
        ],
      },
    ],
    create_layout: [
      {
        group_fields: [
          { name: "Type du produit", field: "product_type", value: "" },
          { name: "Marque du produit", field: "product_brand", value: "" },
          {
            name: "Modèle du produit",
            field: "product_model",
            value: "",
            unique: true,
            required: true,
          },
        ],
      },
    ],
  },
  // BONS DE LIVRAISONS
  deliveries: {
    title: "Bons de livraisons",
    collection: "deliveries",
    unit: "delivery",
    url: "/deliveries",
    table_titles: [
      { name: "Date", field: "bl_date" },
      { name: "ID", field: "bl_id" },
      { name: "Client", field: "bl_client_name" },
      { name: "ID entrée", field: "bl_entry_id" },
      { name: "Date de livraison", field: "bl_shipping_date" },
      { name: "Bon de sortie", field: "bl_sacomi_exit_id" },
    ],
    table_data: (data: any) =>
      data.map(
        (
          delivery: Delivery & {
            client: Client;
          }
        ) => {
          return [
            delivery.id,
            delivery.delivery_date || "",
            delivery.delivery_id || "",
            delivery.client?.name || "",
            delivery.entry_id || "",
            delivery.date_delivered || "",
            delivery.sage_exit_id || "",
          ];
        }
      ),
    search_layout: [
      {
        group_title: "BL",
        group_fields: [
          { name: "ID du BL", field: "delivery_id", value: "" },
          { name: "Date du BL", field: "delivery_date", value: "" },
        ],
      },
      {
        group_title: "Client",
        group_fields: [{ name: "Nom du client", field: "name", value: "" }],
      },
    ],
    create_layout: [
      {
        group_fields: [
          {
            name: "ID du bon de livraison",
            field: "delivery_id",
            value: "",
            autogenerated: true,
            required: true,
          },
        ],
      },
      { group_title: "Client", findOrCreateClient: true, group_fields: [] },
      {
        group_title: "BL Infos",
        group_fields: [
          {
            name: "ID de l'entrée",
            field: "entry_id",
            value: "",
          },
          {
            name: "Contenu",
            field: "content",
            value: "",
            textarea: true,
          },
          {
            name: "Date de livraison",
            field: "delivery_date_1",
            value: "",
            type: "date",
          },
          {
            name: "ID de sortie SAGE",
            field: "sage_exit_id",
            value: "",
          },
          {
            name: "Observations",
            field: "observations",
            value: "",
            textarea: true,
          },
        ],
      },
    ],
  },
  // BONS DE COMMANDES
  orders: {
    title: "Bons de commandes",
    collection: "orders",
    unit: "order",
    url: "/orders",
    table_titles: [
      { name: "Date", field: "date" },
      { name: "ID", field: "id" },
      { name: "Contenu", field: "bl_client_name" },
      { name: "Quantité", field: "bl_entry_id" },
      { name: "Paiement", field: "bl_shipping_date" },
      { name: "Date de reception", field: "bl_sacomi_exit_id" },
    ],
    table_data: (data: any) =>
      data.map((order: Order) => {
        return [
          order.id,
          order.order_id || "",
          order.order_date || "",
          order.order_content || "",
          order.quantity || "",
          order.payment || "",
          order.receipt_date || "",
        ];
      }),
    search_layout: [
      {
        group_fields: [
          { name: "ID de la commande", field: "order_id", value: "" },
          { name: "Date de la commande", field: "order_date", value: "" },
          { name: "Contenu de la commande", field: "order_content", value: "" },
        ],
      },
    ],
    create_layout: [
      {
        group_fields: [
          {
            name: "ID de la commande",
            field: "order_id",
            value: "",
            autogenerated: true,
            unique: true,
            required: true,
          },
          {
            name: "Date de la commande",
            field: "order_date",
            value: "",
            required: true,
          },
          {
            name: "Contenu de la commande",
            field: "order_content",
            value: "",
            textarea: true,
            required: true,
          },
        ],
      },
    ],
  },
  // PRESTATIONS
  prestations: {
    title: "Prestations",
    collection: "prestations",
    unit: "prestation",
    url: "/prestations",
    table_titles: [
      { name: "Date", field: "prestation_date" },
      { name: "ID", field: "prestation_id" },
      { name: "Client", field: "prestation_client_name" },
      { name: "Montant", field: "prestation_total_value" },
      { name: "Payé", field: "prestation_is_paid" },
      { name: "Encaissement", field: "prestation_payment_date" },
      { name: "A facturer", field: "prestation_billing" },
      { name: "Facture", field: "prestation_invoice" },
      { name: "Date de récupération", field: "prestation_recovery_date" },
    ],
    table_data: (data: any) =>
      data.map(
        (
          prestation: Prestation & {
            client: Client;
            _count: Prisma.PrestationCountOutputType;
          }
        ) => {
          return [
            prestation.id,
            prestation.prestation_date || "",
            prestation.prestation_id || "",
            prestation.client?.name || "",
            prestation.is_paid || "",
            prestation.payment_date || "",
            prestation.to_bill || "",
            prestation.invoice || "",
            prestation.recovery_date || "",
          ];
        }
      ),
    search_layout: [
      {
        group_fields: [
          { name: "ID Prestation", field: "prestation_id", value: "" },
          {
            name: "Date de la prestation",
            field: "prestation_date",
            value: "",
          },
          { name: "Nom du client", field: "name", value: "" },
          { name: "Prestation payée", field: "is_paid", value: "" },
          { name: "Date du paiement", field: "payment_date", value: "" },
        ],
      },
    ],
    create_layout: [
      {
        group_fields: [
          {
            name: "ID de la prestation",
            field: "prestation_id",
            value: "",
            autogenerated: true,
            required: true,
          },
        ],
      },
      { group_title: "Client", findOrCreateClient: true, group_fields: [] },
      {
        group_title: "Services",
        group_fields: BASIC_PRESTATION_SERVICES,
        row_fields: [BASIC_PRESTATION_SERVICES],
        rows: true,
        rows_collection: "prestationDetails",
      },
      {
        group_title: "Infos",
        group_fields: [
          {
            name: "Payé",
            field: "is_paid",
            value: "",
            type: "checkbox",
          },
          {
            name: "A facturer",
            field: "to_bill",
            value: "",
            type: "checkbox",
          },
          {
            name: "Date d'encaissement",
            field: "payment_date",
            value: "",
            type: "date",
          },
          {
            name: "Date de récupération",
            field: "recovery_date",
            value: "",
            type: "date",
          },
          {
            name: "Facture",
            field: "invoice",
            value: "",
          },
        ],
      },
    ],
  },
  // INTERVENTIONS
  jobs: {
    title: "Tableau SAV",
    collection: "jobs",
    unit: "job",
    url: "/jobs",
    table_titles: [
      { name: "Date", field: "entry_date" },
      { name: "ID", field: "entry_id" },
      { name: "Client", field: "client_name" },
      { name: "Marque", field: "product_brand" },
      { name: "Modèle", field: "product_model" },
      { name: "N de série", field: "product_serial_number" },
      { name: "Désignation", field: "job_designation" },
      { name: "Diagnostique", field: "job_diagnostics" },
      { name: "Technicien", field: "job_technician" },
      { name: "Etat", field: "job_status", isBadge: true },
      { name: "Date de sortie", field: "job_exit_date" },
    ],
    table_data: (data: any) =>
      data.map(
        (
          job: Job & {
            client: Client;
            entry: Entry;
            product: Product;
          }
        ) => {
          return [
            job.id,
            job.entry?.entry_date || "",
            job.entry?.entry_id || "",
            job.client?.name || "",
            job.product?.product_brand || "",
            job.product?.product_model || "",
            job.serial_number || "",
            job.designation || "",
            job.diagnostics || "",
            job.technician || "",
            job.status || "",
            job.exit_date || "",
          ];
        }
      ),
    search_layout: [
      {
        group_title: "Entrée",
        group_fields: [
          { name: "Date d'entrée", field: "entry_date", value: "" },
          { name: "ID d'entrée", field: "entry_id", value: "" },
        ],
      },
      {
        group_title: "Client",
        group_fields: [{ name: "Nom du client", field: "name", value: "" }],
      },
      {
        group_title: "Produit",
        group_fields: [
          { name: "Modèle du produit", field: "product_model", value: "" },
        ],
      },
      {
        group_title: "Intervention",
        group_fields: [
          { name: "Numéro de série", field: "serial_number", value: "" },
          { name: "Diagnostique", field: "diagnostics", value: "" },
          { name: "Technicien", field: "technician", value: "" },
          {
            name: "Etat",
            field: "status",
            value: "",
          },
          { name: "Date de sortie", field: "exit_date", value: "" },
        ],
      },
    ],
    create_layout: [
      {
        group_title: "Entrée",
        group_fields: [
          {
            name: "ID d'entrée",
            field: "entry_id",
            value: "",
            collection: "entries",
            unit: "entry",
            readonly: true,
            required: true,
            unique: true,
          },
          {
            name: "Date d'entrée",
            field: "entry_date",
            value: "",
            collection: "entries",
            unit: "entry",
            readonly: true,
            required: true,
          },
        ],
      },
      {
        group_title: "Client",
        group_fields: [
          {
            name: "Nom du client",
            field: "name",
            value: "",
            collection: "clients",
            unit: "client",
            autocomplete: true,
            required: true,
            unique: true,
          },
          {
            name: "Numéro du téléphone",
            field: "phone_number",
            value: "",
            collection: "clients",
            unit: "client",
            readonly: true,
          },
        ],
      },
      {
        group_title: "Produit",
        group_fields: [
          {
            name: "Modèle du produit",
            field: "product_model",
            value: "",
            autocomplete: true,
            collection: "products",
            unit: "product",
            required: true,
            unique: true,
          },
          {
            name: "Marque du produit",
            field: "product_brand",
            value: "",
            collection: "products",
            unit: "product",
            readonly: true,
          },
        ],
      },
      {
        group_title: "Intervention",
        group_fields: [
          { name: "Numéro de série", field: "serial_number", value: "" },
          { name: "Technicien", field: "technician", value: "" },
          {
            name: "Etat",
            field: "status",
            value: "",
            dropdown: true,
            options: [
              { name: "EN ATTENTE", value: "EN ATTENTE" },
              { name: "REPARE", value: "REPARE" },
              { name: "DEVIS", value: "DEVIS" },
              { name: "A CHANGER", value: "A CHANGER" },
              { name: "ECHANGE", value: "ECHANGE" },
              { name: "ATTENTE DE PIECES", value: "ATTENTE DE PIECES" },
              { name: "RETOUR AU CLIENT", value: "RETOUR AU CLIENT" },
            ],
          },
          {
            name: "Date de sortie",
            field: "exit_date",
            value: "",
            type: "date",
          },
          {
            name: "Diagnostique",
            field: "diagnostic",
            value: "",
            textarea: true,
          },
        ],
      },
    ],
  },
  // STAFF
  users: {
    title: "Personnel SAV",
    collection: "users",
    unit: "user",
    url: "/staff",
    table_titles: [
      { name: "Avatar", field: "picture", isImage: true },
      { name: "Pseudo", field: "username" },
      { name: "Nom/prénom", field: "fullName" },
      { name: "Rôle", field: "role" },
    ],
    table_data: (data: any) =>
      data.map((user: User) => {
        return [
          user.id,
          user.image || "",
          user.username || "",
          user.name || "",
          user.role || "",
        ];
      }),
    create_layout: [
      {
        group_fields: [
          { name: "Email", field: "email", value: "", type: "text" },
          { name: "Nom complet", field: "name", value: "", type: "text" },
          {
            name: "Pseudo",
            field: "username",
            value: "",
            type: "text",
            required: true,
            unique: true,
          },
          {
            name: "Rôle",
            field: "role",
            value: "",
            type: "radio",
            options: [
              { name: "Admin", value: "ADMIN" },
              { name: "Réception", value: "RECEPTION" },
              { name: "Technicien", value: "TECHNICIAN" },
            ],
            required: true,
          },
          {
            name: "Mot de passe",
            field: "password",
            value: "",
            type: "password",
            required: true,
          },
        ],
      },
    ],
  },
  // CAISSE
  transactions: {
    title: "Transactions",
    collection: "transactions",
    unit: "transaction",
    url: "/transactions",
    table_titles: [
      { name: "Date", field: "date" },
      { name: "ID Prest", field: "prestation_id" },
      { name: "Client / Titre", field: "client_name" },
      { name: "Chèque", field: "check" },
      { name: "Recette", field: "income" },
      { name: "Dépense", field: "expense" },
      { name: "Solde [DZD]", field: "balance" },
    ],
    table_data: (data: any) =>
      data.map(
        (
          transaction: Transaction & {
            prestation: Prestation & { client: Client };
          }
        ) => {
          return [
            transaction.id,
            transaction.date.toISOString().substring(0, 10),
            (transaction.prestation && transaction.prestation.prestation_id) ||
              "",
            (transaction.prestation && transaction.prestation.client.name) ||
              transaction.title,
            transaction.type === "CHEQUE" ? true : false,
            transaction.type === "INCOME" ? true : false,
            transaction.type === "EXPENSE" ? true : false,
            transaction.amount,
          ];
        }
      ),
    create_layout: [
      {
        group_title: "Infos",
        group_fields: [
          {
            name: "ID de la Prestation",
            field: "prestation_id",
            value: "",
            collection: "prestations",
            unit: "prestation",
            unique: true,
          },
          { name: "Titre", field: "title", value: "" },
        ],
      },
      {
        group_title: "Montant",
        group_fields: [
          {
            name: "Type",
            field: "type",
            value: "",
            type: "radio",
            options: [
              { name: "Recette", value: "INCOME" },
              { name: "Chèque", value: "CHEQUE" },
              { name: "Dépense", value: "EXPENSE" },
            ],
            required: true,
          },
          {
            name: "Montant HT [DZD]",
            field: "amount",
            value: 0,
            type: "number",
            required: true,
          },
        ],
      },
    ],
  },
  prestationDetails: {
    // ! should not be needed for now
    title: "",
    collection: "prestationDetails",
    url: "/services",
    table_titles: [{ name: "Date", field: "date" }],
    table_data: (data: any) =>
      data.map((data: any) => {
        return [data];
      }),
  },
};
