import { readFileSync, rmSync } from "fs";
import { Parser } from "xml2js";
import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

import { WriteData, FileMakerXML } from "../../../utils/filemaker";
import { ERROR_MESSAGES } from "../../../../lib/config";

const parser = new Parser();
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
  const { filePaths }: { filePaths: string[] } = req.body;

  filePaths.forEach(async (filePath) => {
    let data = readFileSync(filePath, { encoding: "utf8" });
    if (data) {
      try {
        const result: FileMakerXML = await parser.parseStringPromise(data);
        if (result.FMPXMLRESULT.PRODUCT[0]["$"].NAME === "FileMaker") {
          await WriteData({
            res,
            fm_data: result,
            save: "db",
            filePath,
          });
        } else {
          res.status(200).json({
            success: false,
            message: ERROR_MESSAGES.file_format(filePath),
          });
        }
      } catch (error) {
        res.status(200).json({
          success: false,
          error,
        });
      }
    }
    rmSync(filePath);
  });
});

export default handler;
