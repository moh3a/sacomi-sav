import nc from "next-connect";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import { ERROR_MESSAGES } from "../../../lib/config";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

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

handler.use(upload.array("sav_uploads"));

handler.post((req, res) => {
  const destinations = (req as any).files?.map(
    (file: any) => file.destination + "/" + file.filename
  );
  res.status(200).json({
    success: true,
    message: "Fichiers téléchargés avec succées.",
    destinations,
  });
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
