import { PrismaClient } from '@prisma/client'
import axios from "axios";
import {da} from "date-fns/locale";
const prisma = new PrismaClient()

const key ="Aiy7xjDKh2qaGhAbWRnVQML0yMIRzghHla9KdBY-wLEXhr5Pb7fOGj3a9XcPrkpU"
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

