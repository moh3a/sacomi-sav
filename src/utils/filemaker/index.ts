import {
  fm_prestation_details_parser,
  fm_general_parser,
  fm_job_parser,
  parseFMDataFields,
} from "./parse";
import { ICollection, IParseFMData } from "./utils";
import { writeFMDataToFile } from "./write";

export const parse_fm_data = async ({
  res,
  fm_data,
  save,
  filePath,
}: IParseFMData) => {
  let collection: ICollection = { name: "", main_field: "" };
  const fields = parseFMDataFields(fm_data, collection);
  if (collection.name) {
    let data: any[] = [];
    let product_data: any[] = [];

    if (collection.name === "job") {
      product_data = fm_general_parser(fm_data, fields, "product_model");
      data = fm_job_parser(fm_data, fields);
    }
    // ! TODO
    else if (collection.name === "prestationdetails")
      data = fm_prestation_details_parser(fm_data, fields);
    else if (collection.name)
      data = fm_general_parser(fm_data, fields, collection.main_field);

    if (save === "file") {
      const fp = filePath.replace(".xml", ".json");
      if (product_data.length > 0)
        writeFMDataToFile(res, fp.replace("tableau", "produits"), product_data);
      writeFMDataToFile(res, fp, data);
    }
  } else {
    res.status(200).json({
      success: false,
      message: `Erreur: Fichier ${filePath} n'est pas valid comme format FileMaker XML.`,
    });
  }
};
