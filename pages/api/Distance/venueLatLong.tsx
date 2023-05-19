export default  function handle(req, res) {

    let postcode = req.query.postcode

    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const key ="Aiy7xjDKh2qaGhAbWRnVQML0yMIRzghHla9KdBY-wLEXhr5Pb7fOGj3a9XcPrkpU"
    let result = []
    // @ts-ignore
    fetch(`http://dev.virtualearth.net/REST/v1/Locations?key=${key}&postalCode=${postcode}`, requestOptions)
        .then((res) => res.json())
        .then((data) => {
            result =data
        })
        .catch(error => console.log('error', error));

    res.status(200).json(result)

}



