import { TourTaskDTO } from 'interfaces'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as TourTaskDTO

    /*
    const dueDateObj = task.DueDate ? new Date(task.DueDate) : undefined
    let startByWeekCode = '-'
    let completeByWeekCode = '-'

    if (dueDateObj) {
      const matchedTourWeek = tourWeeks.find((tourWeek) => {
        const mondayDate = new Date(tourWeek.MondayDate)
        const sundayDate = new Date(tourWeek.SundayDate)

        return dueDateObj >= mondayDate && dueDateObj <= sundayDate
      })

      if (matchedTourWeek) {
        startByWeekCode = matchedTourWeek.WeekCode
        completeByWeekCode = matchedTourWeek.WeekCode
      }
    }
    */

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
