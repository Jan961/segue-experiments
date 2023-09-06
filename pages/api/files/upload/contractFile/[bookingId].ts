import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import getMimeType from 'utils/getMimeType'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const bookingId:number = parseInt(req.query.bookingId as string)
      // get the file data from the request body
      const fileData = req.body
      // convert the file data to byte format
      const byteArray = Buffer.from(Uint8Array.from(fileData.fileContent))
      // create a new AttachedFile using Prisma
      const newFile = await prisma.attachedFile.create({
        data: {
          OriginalFilename: fileData.originalFilename,
          MimeType: getMimeType(fileData.originalFilename),
          FileContent: byteArray,
          Description: '',
          UploadedDT: new Date(),
          FileDT: new Date(),
          OwnerId: 0
        }
      })
      const foundContract = await prisma.contract.findFirst({
        where: {
          BookingId: bookingId
        }
      })

      const contractId:number = foundContract.ContractId

      // insert the new FileId primary key into the ContractArtifacts table
      const newArtifact = await prisma.contractArtifacts.create({
        data: {
          ContractId: contractId,
          FileId: newFile.FileId
        }
      })

      // return the new ArtifactId to the client
      res.status(200).json({ success: true, artifactId: newArtifact.FileId })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Server Error' })
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' })
  }
}
