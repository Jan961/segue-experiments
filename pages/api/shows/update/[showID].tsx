
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handle (req, res) {
  try {
    await prisma.show.update({
      where: {
        ShowId: req.body.ShowId
      },
      data: {
        Code: req.body.Code,
        Name: req.body.Name,
        ShowType: req.body.ShowType,
        Logo: req.body.Logo
      }
    })
    res.status(200).end()
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
  return res
}
