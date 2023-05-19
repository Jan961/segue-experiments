import prisma from 'lib/prisma'

export default  async function handle(req, res) {

    let url = req.query.url
    let count = 0
    let limit = parseInt(req.query.url)
    let result = []
    try {

        /**
         *
         * Get all the venues that do not have Lat Long set
         *
         */
        const venues = await prisma.venue.findMany({
            where: {
                AND: [
                    {
                        Latitude: null,
                        Longitude: null,
                    }]
            },
        })

        for (let venue of venues){

           //console.log(JSON.stringify(venue))
            let postcode = venue.Postcode.replace(" ", "")
            fetch(`http://127.0.0.1:3000/api/Distance/country/${postcode}`)
                .then((latlong) => latlong.json())
                .then((data) => {
                    //console.log(JSON.stringify((data)))
                        //[55.86948933321057,-3.0453811998693046,55.87721476835193,-3.0270227079065744]
                    let latLongCode = data.substring(1, data.indexOf(","));
                    latLongCode = latLongCode.replace("[", "")
                    console.log(latLongCode)
                    const updateUser =  prisma.venue.update({
                        where: {
                            VenueId: venue.VenueId
                        },
                        data: {
                            Latitude:  latLongCode.substring(0, latLongCode.indexOf(",")),
                            Longitude: latLongCode.substring(1, latLongCode.indexOf(",")),
                        },
                    })


                })
         }

        res.status(200)
    } catch (e){
        res.status(400)
    }


}

