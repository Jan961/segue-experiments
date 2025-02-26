import nextConnect from 'next-connect';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

let filename = uuidv4() + '-' + new Date().getTime();
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/segue/logos', // destination folder
    filename: (req, file, cb) => cb(null, getFileName(file)),
  }),
});

const getFileName = (file) => {
  filename += '.' + file.originalname.substring(file.originalname.lastIndexOf('.') + 1, file.originalname.length);
  return filename;
};

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      // @ts-ignore
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    // @ts-ignore
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array('file')); // attribute name you are sending the file by

apiRoute.post((req, res) => {
  // @ts-ignore
  res.status(200).json({ data: `${filename}` }); // response File name to be saved in db
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
