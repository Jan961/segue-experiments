import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  return res.status(501).end()

  /*
  try {
    const fileId:number = parseInt(req.query.fileId as string)

    const attachedFile = await prisma.attachedFile.findUnique({
      where: {
        FileId: fileId
      }
    })

    if (!attachedFile) {
      return res.status(404).send('AttachedFile not found')
    }
    console.log('File content', attachedFile)
    res.setHeader('Content-disposition', `attachment; filename=${attachedFile.OriginalFilename}`)
    res.setHeader('Content-type', attachedFile.MimeType)
    // res.setHeader("Content-type", 'application/pdf');
    res.send(Buffer.from(attachedFile.FileContent))
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
  */
}
