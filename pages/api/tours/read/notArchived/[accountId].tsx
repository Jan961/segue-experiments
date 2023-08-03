import prisma from 'lib/prisma'

const generateSearchResults = async (options) => {
  return await prisma.tour.findMany({
    where: {
      ...options.where,
      Archived: false
    },
    include: {
      Show: true,
      TourTask: {
        where: {
          ...options.tourTaskWhere
        },
        include: {
          User_TourTask_AssignedByToUser: true,
          User_TourTask_AssigneeToUser: true
        },
        orderBy: {
          DueDate: 'desc'
        }
      }
    }
  })
}

export default async function handle (req, res) {
  try {
    if (req.method === 'POST') {
      // To be changed back to headers once ssl cert is placed
      const { segue_admin, account_admin, user_id } = await req.body
      const accountId = req.query.accountId

      const options:any = {}

      if (segue_admin) {
      // No additional options needed
      } else if (account_admin) {
        options.where = { TourOwner: parseInt(accountId) }
      } else if (user_id) {
        options.where = { TourOwner: parseInt(accountId) }
        options.tourTaskWhere = { Assignee: parseInt(user_id) }
      } else {
        options.where = { TourOwner: parseInt(accountId) }
        options.tourTaskWhere = { Assignee: parseInt(user_id) }
      }

      const searchResults = await generateSearchResults(options)
      res.json(searchResults)
    } else if (req.method === 'GET') {
      const result = await prisma.tour.findMany({
        where: {
          Archived: false
        },
        include: {
          Show: true
        }
      })

      res.json(result)
    }
  } catch (err) {
    console.log(err)
    res
      .status(400)
      .json({ err: 'Error occurred while generating search results. ' + err })
  }
}
