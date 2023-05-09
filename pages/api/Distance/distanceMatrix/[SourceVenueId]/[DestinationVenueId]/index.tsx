import { PrismaClient } from '@prisma/client'
import axios from "axios";
const prisma = new PrismaClient()

export default  function handle(req, res) {

    let SourceVenueId = req.query.SourceVenueId
    let DestinationVenueId = req.query.DestinationVenueId

    console.log(SourceVenueId)
    console.log(DestinationVenueId)

    res.status(200).json()

}


