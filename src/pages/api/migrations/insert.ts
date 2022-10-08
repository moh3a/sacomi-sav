import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { readFileSync, writeFile } from "fs";
import getConfig from "next/config";

import { ERROR_MESSAGES } from "../../../../lib/config";
import { MigrationsConfig } from "../../../types";
import prisma from "../../../../lib/prisma";

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

handler.post(async (req, res) => {
  const { migration } = req.body;

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
        console.log("Should not insert data yet.");
        if (migration.collection === "clients") {
          await prisma.client.createMany({ data, skipDuplicates: true });
        } else if (migration.collection === "products") {
          await prisma.product.createMany({ data, skipDuplicates: true });
        } else if (migration.collection === "orders") {
          await prisma.order.createMany({ data, skipDuplicates: true });
        } else if (migration.collection === "entries") {
          let newdata: any[] = [];
          for (const item of data) {
            if (item.client_name) {
              const client = await prisma.client.findUnique({
                where: { name: item.client_name },
                select: { id: true },
              });
              if (client) {
                delete item.client_name;
                newdata.push({ ...item, clientId: client?.id });
              }
            }
          }
          await prisma.entry.createMany({
            data: newdata,
            skipDuplicates: true,
          });
        } else if (
          migration.collection === "deliveries" ||
          migration.collection === "prestations"
        ) {
          let newdata: any[] = [];
          for (const item of data) {
            if (item.name) {
              const client = await prisma.client.findUnique({
                where: { name: item.name },
                select: { id: true },
              });
              if (client) {
                delete item.name;
                if (migration.collection === "prestations") {
                  
                  delete item.client_type;
                }
                newdata.push({ ...item, clientId: client?.id });
              }
            }
          }
          migration.collection === "deliveries"
            ? await prisma.delivery.createMany({
                data: newdata,
                skipDuplicates: true,
              })
            : await prisma.prestation.createMany({
                data: newdata,
                skipDuplicates: true,
              });
        } else if (migration.collection === "prestationdetails") {
          let newdata: any[] = [];
          for (const item of data) {
            if (item.prestation_id) {
              const prestation = await prisma.prestation.findUnique({
                where: { prestation_id: item.prestation_id },
                select: { id: true },
              });
              if (prestation) {
                delete item.name;
                delete item.prestation_id;
                delete item.client_type;
                delete item.client_wilaya;
                delete item.client_phone_number;
                delete item.client_observations;
                delete item.client_blocked;
                delete item.client_status;
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
          for (const item of data) {
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
            delete item.product_model;
            delete item.product_type;
            delete item.product_brand;
            delete item.entry_date;
            delete item.entry_id;
            delete item.client_name;
            delete item.client_type;
            delete item.client_status;
            if (entry && product && client)
              newdata.push({
                entryId: entry.id,
                productId: product.id,
                clientId: client.id,
                ...item,
              });
          }
          await prisma.job.createMany({ data: newdata, skipDuplicates: true });
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
