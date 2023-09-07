import { TourTaskDTO } from 'interfaces'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getEmailFromReq, checkAccess } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as TourTaskDTO
    const { TourId } = task

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { TourId })
    console.log(TourId)
    console.log(access)
    if (!access) return res.status(401).end()

    const createResult = await prisma.tourTask.create({
      data: {
        TourId: task.TourId,
        Code: 0,
        Name: task.Name,
        Priority: task.Priority,
        Notes: task.Notes,
        Progress: task.Progress,
        DueDate: task.DueDate ? new Date(task.DueDate) : undefined,
        FollowUp: task.FollowUp ? new Date(task.FollowUp) : undefined,
        CreatedDate: new Date(),
        Status: task.Status,
        Interval: 'once',
        AssignedBy: task.AssignedBy,
        AssignedTo: task.AssignedTo
        // StartByWeekNum: undefined, // place your own logic here
        // CompleteByWeekNum: undefined, // place your own logic here
        // CompleteByPostTour: false, // place your own logic here
        // StartByPostTour: false // place your own logic here
      }
    })

    res.json(createResult)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error creating TourTask' })
  }
}
