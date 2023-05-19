const key ="Aiy7xjDKh2qaGhAbWRnVQML0yMIRzghHla9KdBY-wLEXhr5Pb7fOGj3a9XcPrkpU"
export default  async function handle(req, res) {

    let origin = req.query.origin
    let destination = req.query.destination

    // Documntation:  https://learn.microsoft.com/en-us/bingmaps/rest-services/routes/calculate-a-distance-matrix

    let distanceSettings = {
        travelMode: "driving",
        startTime: "2023-06-15T23:00:00",
        timeUnit: "minute",
        distanceUnit: "mile", //can be kilometer
        resolution: 1 //

    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': 'insertLengthOfHTTPBody'
        },
        body: JSON.stringify({
            "origins": [
                {
                    "latitude": 55.86948933321057,
                    "longitude": -3.0453811998693046
                },
            ],
            "destinations": [
                {
                    "latitude": 56.1473404379469,
                    "longitude": -3.938103541731842
                },
            ],
            "travelMode": distanceSettings.travelMode,
            "startTime": distanceSettings.startTime,
            "resolution": 1,
            "timeUnit": distanceSettings.timeUnit,
            "distanceUnit": distanceSettings.distanceUnit
        })
    };

    let result = []
    try {
        fetch(`https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrixAsync?key=${key}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                let url = data.resourceSets[0].resources[0].callbackUrl
                res.status(200).json(url)
            })
    } catch (e){
        res.status(400)
    }


}

