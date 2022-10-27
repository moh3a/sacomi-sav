import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { readdirSync, readFileSync, writeFile } from "fs";

import { ISession, MigrationsConfig } from "../../../types";
import { authOptions } from "../auth/[...nextauth]";
import { ERROR_MESSAGES } from "../../../../lib/config";

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
  .get((req, res) => {
    const migrations_config_path = PROJECT_ROOT + "/lib/migrations_config.json";
    let migrations_config: MigrationsConfig[] = JSON.parse(
      readFileSync(migrations_config_path, {
        encoding: "utf8",
      })
    );

    const dir_path = PROJECT_ROOT + "/public/uploads";
    try {
      const files = readdirSync(dir_path, {
        withFileTypes: true,
        encoding: "utf8",
      });

      files.forEach((file) => {
        const index = migrations_config.findIndex(
          (migration) => migration.file === file.name
        );
        migrations_config[index].uploaded = true;
      });
    } catch (error) {
      migrations_config = migrations_config.map((migration) => {
        migration.uploaded = false;
        migration.canInsert = false;
        return migration;
      });
    }

    writeFile(
      migrations_config_path,
      JSON.stringify(migrations_config),
      { encoding: "utf8" },
      (err) => {
        if (err)
          res.status(500).json({
            success: false,
            message: ERROR_MESSAGES.file_read,
            error: err,
          });
        else
          res.status(200).json({
            success: true,
            message: "Etat des migrations.",
            migrations_config,
          });
      }
    );
  });

export default handler;
