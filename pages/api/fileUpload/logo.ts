import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  return res.status(501).end();

  /*
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    await saveFile(files.file)
    return res.status(201).send('')
  })
  */
}

/*
const saveFile = async (file) => {
  const data = fs.readFileSync(file.path)
  fs.writeFileSync(`./public/${file.name}`, data)
  await fs.unlinkSync(file.path)
}
*/
