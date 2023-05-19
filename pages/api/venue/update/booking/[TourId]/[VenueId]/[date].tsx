export default async function handle(req, res) {

    try {



        res.json("hello")

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}
