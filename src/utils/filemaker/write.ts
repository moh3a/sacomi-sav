import { writeFile } from "fs";
import { NextApiResponse } from "next";

export const writeFMDataToFile = (
  res: NextApiResponse,
  filePath: string,
  data: any[]
) => {
  console.log(`> Writing file to: ${filePath}`);
  writeFile(filePath, JSON.stringify(data), { encoding: "utf8" }, (err) => {
    if (err) console.log(err.message);
    console.log("> Done !");
    res
      .status(200)
      .json({ success: true, message: "Fichier télécharger avec succés." });
  });
};
