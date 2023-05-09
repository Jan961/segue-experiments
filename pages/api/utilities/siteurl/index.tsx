export default (req, res) => {
    console.log(req)
    const siteUrl = "hello "//JSON.stringify(req)  //` ${req.protocol}://${req.host}`;
    res.status(200).json({ siteUrl });
};