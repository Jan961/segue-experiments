import axios from 'axios'
import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'

/**
 * Get the Latitude and Longitude for a venue
 * @param req
 * @param res
 */
export default  async function handle(req, res) {

    const key = process.env.BING_MAPS_API_KEY

    let Source = await prisma.venue.findFirst({
        where: {
            VenueId: parseInt(req.query.SourceVenueID)
        },
        select: {
            VenueId: true,
            Latitude: true,
            Longitude: true
        }
    })

    let Destination = await prisma.venue.findFirst({
        where: {
            VenueId: parseInt(req.query.DestinationVenueId)
        },
        select: {
            VenueId: true,
            Latitude: true,
            Longitude: true
        }
    })


    let distanceSettings = {
        travelMode: "driving",
        startTime: "2023-06-15T23:00:00",
        timeUnit: "minute",
        distanceUnit: "mile", //can be kilometer
        resolution: 1

    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            "origins": [
                {
                    "latitude": Source.Latitude,
                    "longitude": Source.Longitude
                },
            ],
            "destinations": [
                {
                    "latitude": Destination.Latitude,
                    "longitude": Destination.Longitude
                },
            ],
            "travelMode": distanceSettings.travelMode,
            "startTime": distanceSettings.startTime,
            "resolution": 1,
            "timeUnit": distanceSettings.timeUnit,
            "distanceUnit": distanceSettings.distanceUnit
        })
    };

    const options ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let InitialCallBack = ""
/**
    await fetch(`https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrixAsync?key=${key}`, requestOptions)
        .then(data => data.json())
        .then((data) => {
            InitialCallBack = data.resourceSets[0].resources[0].callbackUrl
            console.log(InitialCallBack)


        })

 */


    axios.get(`https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrixAsync?origins=${Source.Latitude},${Source.Longitude}&destinations=${Destination.Latitude},${Destination.Longitude}&travelMode=${distanceSettings.travelMode}&startTime=${distanceSettings.startTime}&timeUnit=${distanceSettings.timeUnit}&key=${key}`, {})
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

   await axios.get(`https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrixAsync?origins=${Source.Latitude},${Source.Longitude}&deUnit}&key=${key}`, {
    })
        .then( (response => response) )
       .catch(function (error) {
            loggingService.logError(error)
        });

    res.status(200).json()

}


