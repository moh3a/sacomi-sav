import {
  Client,
  Delivery,
  Entry,
  Job,
  Order,
  Prestation,
  Prisma,
  Product,
  User,
} from "@prisma/client";
import { PageArchitecture } from "../src/types";
import { formatFMDate, formatFMTime } from "../src/utils/filemaker/utils";

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
  { name: "Prestations", url: "/services" },
  { name: "Caisse", url: "/movements" },
  { name: "Livraisons", url: "/deliveries" },
  { name: "Commandes", url: "/orders" },
  { name: "Produits", url: "/products" },
  { name: "Stock", url: "/stock" },
  { name: "Clients", url: "/clients" },
  { name: "Personnel", url: "/staff" },
  { name: "Paramètres", url: "/settings" },
];

export const PAGE_ARCHITECTURE = {
  // ENTREES
  entries: {
    title: "Entrées",
    collection: "entries",
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
            formatFMDate(entry.entry_date) || "",
            entry.entry_id || "",
            entry.client?.name || "",
            entry.client?.phone_number || "",
            formatFMTime(entry.entry_time) || "",
          ];
        }
      ),
    search_layout: [
      {
        group_title: "Entrée",
        group_fields: [
          { name: "ID Entrée", field: "entry_id" },
          { name: "Date d'entrée", field: "entry_date" },
        ],
      },
      {
        group_title: "Client",
        group_fields: [{ name: "Nom du client", field: "name" }],
      },
    ],
  },
  // CLIENTS
  clients: {
    title: "Clients",
    collection: "clients",
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
          { name: "Nom du client", field: "name" },
          { name: "Type du client", field: "type" },
        ],
      },
    ],
    create_layout: [
      {
        group_title: "Infos",
        group_fields: [
          { name: "Nom du client", field: "name" },
          { name: "Revendeur / Particulier", field: "type" },
          { name: "Etat du client", field: "status" },
        ],
      },
      {
        group_title: "Contact",
        group_fields: [
          { name: "Numéro du téléphone", field: "phone_number" },
          { name: "Contact", field: "contact" },
          { name: "Addresse", field: "address" },
          { name: "Wilaya", field: "wilaya" },
        ],
      },
    ],
  },
  // PRODUITS
  products: {
    title: "Produits",
    collection: "products",
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
          { name: "Type du produit", field: "product_type" },
          { name: "Marque du produit", field: "product_brand" },
          { name: "Modèle du produit", field: "product_model" },
        ],
      },
    ],
    create_layout: [
      {
        group_fields: [
          { name: "Type du produit", field: "product_type" },
          { name: "Marque du produit", field: "product_brand" },
          { name: "Modèle du produit", field: "product_model" },
        ],
      },
    ],
  },
  // BONS DE LIVRAISONS
  deliveries: {
    title: "Bons de livraisons",
    collection: "deliveries",
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
            formatFMDate(delivery.delivery_date) || "",
            delivery.delivery_id || "",
            delivery.client?.name || "",
            delivery.entry_id || "",
            formatFMDate(delivery.delivery_date_1) || "",
            delivery.sage_exit_id || "",
          ];
        }
      ),
    search_layout: [
      {
        group_title: "BL",
        group_fields: [
          { name: "ID du BL", field: "delivery_id" },
          { name: "Date du BL", field: "delivery_date" },
        ],
      },
      {
        group_title: "Client",
        group_fields: [{ name: "Nom du client", field: "name" }],
      },
    ],
  },
  // BONS DE COMMANDES
  orders: {
    title: "Bons de commandes",
    collection: "orders",
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
          formatFMDate(order.order_date) || "",
          order.order_content || "",
          order.quantity || "",
          order.payment || "",
          formatFMDate(order.receipt_date) || "",
        ];
      }),
    search_layout: [
      {
        group_fields: [
          { name: "ID de la commande", field: "order_id" },
          { name: "Date de la commande", field: "order_date" },
          { name: "Contenu de la commande", field: "order_content" },
        ],
      },
    ],
    create_layout: [
      {
        group_fields: [
          { name: "ID de la commande", field: "order_id", autogenerated: true },
          { name: "Date de la commande", field: "order_date" },
          { name: "Contenu de la commande", field: "order_content" },
        ],
      },
    ],
  },
  // PRESTATIONS
  prestations: {
    title: "Prestations",
    collection: "prestations",
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
            formatFMDate(prestation.prestation_date) || "",
            prestation.prestation_id || "",
            prestation.client?.name || "",
            prestation.total_amount,
            prestation.is_paid || "",
            formatFMDate(prestation.payment_date) || "",
            prestation.to_bill || "",
            prestation.invoice || "",
            formatFMDate(prestation.recovery_date) || "",
          ];
        }
      ),
    search_layout: [
      {
        group_fields: [
          { name: "ID Prestation", field: "prestation_id" },
          { name: "Date de la prestation", field: "prestation_date" },
          { name: "Nom du client", field: "name" },
          { name: "Prestation payée", field: "is_paid" },
          { name: "Date du paiement", field: "payment_date" },
        ],
      },
    ],
  },
  // INTERVENTIONS
  jobs: {
    title: "Tableau SAV",
    collection: "jobs",
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
      { name: "Etat", field: "job_status" },
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
            formatFMDate(job.entry?.entry_date) || "",
            job.entry?.entry_id || "",
            job.client?.name || "",
            job.product?.product_brand || "",
            job.product?.product_model || "",
            job.serial_number || "",
            job.designation || "",
            job.diagnostic || "",
            job.technician || "",
            job.status || "",
            formatFMDate(job.exit_date) || "",
          ];
        }
      ),
    search_layout: [
      {
        group_title: "Entrée",
        group_fields: [
          { name: "Date d'entrée", field: "entry_date" },
          { name: "ID d'entrée", field: "entry_id" },
        ],
      },
      {
        group_title: "Client",
        group_fields: [{ name: "Nom du client", field: "name" }],
      },
      {
        group_title: "Produit",
        group_fields: [{ name: "Modèle du produit", field: "product_model" }],
      },
      {
        group_title: "Intervention",
        group_fields: [
          { name: "Numéro de série", field: "serial_number" },
          { name: "Diagnostique", field: "diagnostics" },
          { name: "Technicien", field: "technician" },
          { name: "Etat", field: "status" },
          { name: "Date de sortie", field: "exit_date" },
        ],
      },
    ],
  },
  // STAFF
  staff: {
    title: "Personnel SAV",
    collection: "users",
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
          user.picture || "",
          user.username || "",
          user.fullName || "",
          user.role || "",
        ];
      }),
  },
  // CAISSE
  caisse: {
    title: "Caisse",
    table_titles: [
      { name: "Date", field: "balance_detail.date" },
      { name: "ID Prest", field: "balance_detail.prestation.prestation_id" },
      { name: "Client", field: "balance_detail.prestation.client_name" },
      { name: "Chèque", field: "balance_detail.check" },
      { name: "Recette", field: "balance_detail.cash.income" },
      { name: "Dépense", field: "balance_detail.cash.expense" },
      { name: "Solde", field: "balance_detail.balance" },
    ],
    table_data: (data: any) => data,
  },
};