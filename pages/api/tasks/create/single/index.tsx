import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export type TaskCreateParams = {
  Id: number | undefined,
  TourId: number,
  Title: string,
  DueDate: string,
  Interval: string,
  Progress: number,
  AssignedTo: string,
  AssignedBy: string,
  Status: string,
  Priority: number,
  FollowUp: string,
  Notes: string,
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as TaskCreateParams

    // Fetch tour weeks
    const tourWeeks = await prisma.tourWeek.findMany({
      where: {
        TourId: task.TourId
      }
    })

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

    const createResult = await prisma.tourTask.create({
      data: {
        TourId: task.TourId,
        TaskCode: 0,
        TaskName: task.Title,
        StartByWeekCode: startByWeekCode,
        CompleteByWeekCode: completeByWeekCode,
        Priority: task.Priority,
        Notes: task.Notes,
        DeptRCK: 0,
        DeptMarketing: 0,
        DeptProduction: 0,
        DeptAccounts: 0,
        Progress: task.Progress,
        DueDate: task.DueDate ? new Date(task.DueDate) : undefined,
        FollowUp: task.FollowUp ? new Date(task.FollowUp) : undefined,
        AssignedTo: task.AssignedBy,
        AssignedBy: task.AssignedTo,
        CreatedDate: new Date(),
        Status: task.Status
      }
    })

    res.json(createResult)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error creating TourTask' })
  }
}
