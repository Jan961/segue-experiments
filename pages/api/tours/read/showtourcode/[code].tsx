import prisma from 'lib/prisma'

export default async function handle(req, res) {
    /**
     * Get Tour Details for showTour code
     */
    try {

        let ShowTourCode = req.query.code
        const searchResults = await prisma.$queryRaw`SELECT *, concat(\`Show\`.Code, Tour.Code) as A  FROM Tour LEFT JOIN \`Show\` ON Tour.ShowId = \`Show\`.ShowId WHERE concat(\`Show\`.Code, Tour.Code) = ${ShowTourCode};`
        res.json(searchResults)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}
