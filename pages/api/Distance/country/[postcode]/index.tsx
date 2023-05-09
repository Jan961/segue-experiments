import { PrismaClient } from '@prisma/client'
import axios from "axios";
const prisma = new PrismaClient()

export default  function handle(req, res) {

    let postcode = req.query.postcode
    let key = "Aiy7xjDKh2qaGhAbWRnVQML0yMIRzghHla9KdBY-wLEXhr5Pb7fOGj3a9XcPrkpU"

    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    let result = []
    // @ts-ignore
    let latLong = {
        latitude: null,
        longitude: null
    }
    try {
        // @ts-ignore
        fetch(`https://dev.virtualearth.net/REST/v1/Locations?key=${key}&postalCode=${postcode}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if(data.resourceSets[0].resources[0] !== undefined) {
                    latLong = {
                        latitude: data.resourceSets[0].resources[0].bbox[0],
                        longitude: data.resourceSets[0].resources[0].bbox[1]
                    }
                }
            })
            .then(()=>{
                //console.log(JSON.stringify(latLong))
                res.status(200).json(latLong)
                }
            )
    } catch (e){
        res.status(400)
    }

}



