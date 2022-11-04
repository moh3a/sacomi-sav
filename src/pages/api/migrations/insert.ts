import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { readFileSync, writeFile } from "fs";
import { unstable_getServerSession } from "next-auth/next";

import prisma from "../../../../lib/prisma";
import { ERROR_MESSAGES } from "../../../../lib/config";
import { authOptions } from "../auth/[...nextauth]";
import { ISession, MigrationsConfig } from "../../../types";

import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
const { PROJECT_ROOT } = serverRuntimeConfig;

const handler = nc({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res.status(501).json({
      success: false,
      message: ERROR_MESSAGES.unknown_server_error,
      error,
    });
  },
  onNoMatch(req, res) {
    res.status(405).json({
      success: false,
      message: ERROR_MESSAGES.method_not_allowed(req.method),
    });
  },
});

handler
  .use(async (req: NextApiRequest, res: NextApiResponse, next) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (session && (session as ISession).user?.role === "ADMIN") {
      next();
    } else res.status(403).json({ message: ERROR_MESSAGES.unauthorized_error });
  })
  .post(async (req, res) => {
    const { migration }: { migration: MigrationsConfig } = req.body;

    const migrations_config_path = PROJECT_ROOT + "/lib/migrations_config.json";
    let migrations_config: MigrationsConfig[] = JSON.parse(
      readFileSync(migrations_config_path, {
        encoding: "utf8",
      })
    );

    if (migration) {
      try {
        const data = JSON.parse(
          readFileSync(
            `${PROJECT_ROOT}/public/uploads/${migration.file}`
          ) as unknown as string
        );

        const insertDb = async () => {
          if (migration.collection === "clients") {
            await prisma.client.createMany({ data, skipDuplicates: true });
          } else if (migration.collection === "products") {
            let ndata = [];
            for (let item of data) {
              if (item.product_model) {
                item = {
                  product_model: item.product_model,
                  product_brand: item.product_brand,
                  product_type: item.product_type,
                };
                ndata.push(item);
              }
            }
            await prisma.product.createMany({
              data: ndata,
              skipDuplicates: true,
            });
          } else if (migration.collection === "orders") {
            let ndata = [];
            for (let item of data) {
              item.order_date = new Date(item.order_date) ?? undefined;
              item.receipt_date = new Date(item.receipt_date) ?? undefined;
              ndata.push(item);
            }
            await prisma.order.createMany({ data, skipDuplicates: true });
          } else if (
            migration.collection === "entries" ||
            migration.collection === "deliveries" ||
            migration.collection === "prestations"
          ) {
            let newdata: any[] = [];
            for (const item of data) {
              if (item.client_name) {
                const client = await prisma.client.findUnique({
                  where: { name: item.client_name },
                  select: { id: true },
                });
                if (client) {
                  delete item.client_name;
                  if (migration.collection === "prestations") {
                    delete item.client_type;
                    item.prestation_date =
                      new Date(item.prestation_date) ?? undefined;
                    item.recovery_date =
                      new Date(item.recovery_date) ?? undefined;
                    item.payment_date =
                      new Date(item.payment_date) ?? undefined;
                  }
                  if (migration.collection === "entries") {
                    item.entry_date = new Date(item.entry_date) ?? undefined;
                  }
                  if (migration.collection === "deliveries") {
                    item.delivery_date =
                      new Date(item.delivery_date) ?? undefined;
                    item.date_delivered =
                      new Date(item.date_delivered) ?? undefined;
                  }
                  newdata.push({ ...item, clientId: client?.id });
                }
              }
            }
            if (migration.collection === "entries")
              await prisma.entry.createMany({
                data: newdata,
                skipDuplicates: true,
              });
            if (migration.collection === "deliveries")
              await prisma.delivery.createMany({
                data: newdata,
                skipDuplicates: true,
              });
            if (migration.collection === "prestations")
              await prisma.prestation.createMany({
                data: newdata,
                skipDuplicates: true,
              });
          } else if (migration.collection === "prestationDetails") {
            let newdata: any[] = [];
            for (let item of data) {
              if (item.prestation_id) {
                const prestation = await prisma.prestation.findUnique({
                  where: { prestation_id: item.prestation_id },
                  select: { id: true },
                });
                if (prestation) {
                  delete item.name;
                  delete item.prestation_id;
                  delete item.prestation_date;
                  delete item.client_type;
                  delete item.client_wilaya;
                  delete item.client_phone_number;
                  delete item.client_observations;
                  delete item.client_blocked;
                  delete item.client_status;
                  item.quantity = item.quantity
                    ? parseInt(item.quantity)
                    : undefined;
                  newdata.push({ prestationId: prestation.id, ...item });
                }
              }
            }
            await prisma.prestationDetails.createMany({
              data: newdata,
              skipDuplicates: true,
            });
          } else if (migration.collection === "jobs") {
            let newdata: any[] = [];
            for (let item of data) {
              let entry, product, client;
              if (item.entry_id)
                entry = await prisma.entry.findUnique({
                  where: { entry_id: item.entry_id },
                  select: { id: true },
                });
              if (item.product_model)
                product = await prisma.product.findUnique({
                  where: { product_model: item.product_model },
                  select: { id: true },
                });
              if (item.client_name)
                client = await prisma.client.findUnique({
                  where: { name: item.client_name },
                  select: { id: true },
                });
              if (entry && product && client) {
                delete item.product_model;
                delete item.product_type;
                delete item.product_brand;
                delete item.entry_date;
                delete item.entry_id;
                delete item.client_name;
                delete item.client_type;
                delete item.client_status;
                item.entryId = entry.id;
                item.productId = product.id;
                item.clientId = client.id;
                item.repaired_date = new Date(item.repaired_date) ?? undefined;
                item.exit_date = new Date(item.exit_date) ?? undefined;
                newdata.push(item);
              }
            }
            await prisma.job.createMany({
              data: newdata,
              skipDuplicates: true,
            });
          } else {
            console.log("wtf are u doing here!");
          }
        };

        insertDb().then(() => {
          const index = migrations_config.findIndex(
            (m) => m.file === migration.file
          );

          migrations_config[index].insertedToDB = true;
          if (index + 1 < migrations_config.length)
            migrations_config[index + 1].canInsert = true;

          writeFile(
            migrations_config_path,
            JSON.stringify(migrations_config),
            { encoding: "utf8" },
            (err) => {
              res.status(200).json({
                success: true,
                message: `Données insérées dans ${migration.collection} avec succés.`,
              });
            }
          );
        });
      } catch (error) {
        res
          .status(200)
          .json({ success: false, message: ERROR_MESSAGES.file_read, error });
      }
    }
  });

export default handler;
