import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default  async function handle(req, res) {

    let url = req.query.url

    let result = []
    try {
        fetch(`${url}`)
            .then((res) => res.json())
            .then((data) => {
                let url = data.resourceSets[0].resources[0].resultUrl
                res.status(200).json(url)
            })
    } catch (e){
        res.status(400)
    }


}

