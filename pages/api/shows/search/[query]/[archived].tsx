import { Show } from 'interfaces'
import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {
        let owner = 1
        let status = false
        let search = " "
        if ( req.query.query !== null || req.query.query !== undefined) {
            search =  req.query.query
        }

        if(req.query.archived == "true"){
            status = true
        }
        let searchResults: Show[]
        if(search  == " ") {

            // @ts-ignore
            searchResults = await prisma.show.findMany({
                where: {
                    Archived: status,
                    Deleted: false,
                    AccountId: owner
                }

            })
        } else {
             // @ts-ignore
            searchResults = await prisma.show.findMany({
                where: {
                    OR: [
                        {
                            Name: {
                                contains: search,
                            },
                        },
                        {
                            Code:
                                {
                                    contains: search,
                                }
                        },
                    ],
                    AND: [
                        {
                            Archived: status,
                            Deleted: false,
                            AccountId: owner
                        }
                    ],


                }

            })
        }
        //console.log(searchResults)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ searchResults }))

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

/**
    const results = req.query.q ?
        posts.filter(post => post.title.toLowerCase().includes(req.query.q.toLowerCase())) : []
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ results }))
 **/
}


