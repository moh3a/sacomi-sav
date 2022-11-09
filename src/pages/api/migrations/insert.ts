import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { readFileSync, writeFile } from "fs";
import { unstable_getServerSession } from "next-auth/next";

import { ERROR_MESSAGES } from "../../../../lib/config";
import { authOptions } from "../auth/[...nextauth]";
import { ISession, MigrationsConfig } from "../../../types";
import { InsertFMDataToDB } from "../../../utils/filemaker";

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

        const index = migrations_config.findIndex(
          (m) => m.file === migration.file
        );

        try {
          await InsertFMDataToDB(
            {
              name: migration.collection,
              prisma_model: migration.model,
              main_field: "",
            },
            data
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
        } catch (error) {
          migrations_config[index].insertedToDB = false;

          writeFile(
            migrations_config_path,
            JSON.stringify(migrations_config),
            { encoding: "utf8" },
            (err) => {
              res.status(200).json({
                success: false,
                message: `Erreur est survenue lors de la migration.\n${JSON.stringify(
                  error
                )}`,
              });
            }
          );
        }
      } catch (error) {
        res
          .status(200)
          .json({ success: false, message: ERROR_MESSAGES.file_read, error });
      }
    }
  });

export default handler;
