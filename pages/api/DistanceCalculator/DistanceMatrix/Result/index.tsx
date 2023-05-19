/**
 * Get the Latitude and Longitude for a venue
 * @param req
 * @param res
 */
export default  async function handle(req, res) {

    let url =  req.body.data.CallBackUrl.replace("\/", "/")
    console.log(url)

    fetch(`${url}`)
        .then(res=>res.json())
        .then(res=>{
            console.log(JSON.stringify(res))
        })

}
