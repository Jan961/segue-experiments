import { TourTaskDTO } from 'interfaces'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const task = req.body as TourTaskDTO

      await prisma.tourTask.update({
        where: { Id: task.Id },
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
        }
      })

      return res.status(200).json({})
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Error updating TourTask' })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
