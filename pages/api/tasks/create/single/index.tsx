import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {

    const {
      taskTitle,
      dueDate,
      interval,
      progress,
      assignee,
      assignedBy,
      status,
      priority,
      followUp,
      tourId,
      notes
    } = req.body;

    const createResult = await prisma.tourTask.create({
      data: {
        TourId: parseInt(tourId),
        TaskCode: parseInt('0'),
        TaskName: taskTitle,
        StartByWeekCode: '1:-52',
        CompleteByWeekCode: '1:-48',
        Priority: parseInt(priority),
        Notes: notes,
        DeptRCK: req.body.DeptRCK === "true",
        DeptMarketing: req.body.DeptMarketing === "true",
        DeptProduction: req.body.DeptProduction === "true",
        DeptAccounts: req.body.DeptAccounts === "true",
        Progress: parseInt(progress),
        DueDate: dueDate ? new Date(dueDate) : undefined,
        FollowUp: followUp ? new Date(followUp) : undefined,
        Assignee: assignee ? parseInt(req.body.assignee) : undefined,
        AssignedBy: assignedBy ? parseInt(assignedBy) : undefined,
        CreatedDate: new Date(),
        Interval: interval,
        Status: status,
      },
    });

    res.json(createResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating TourTask" });
  }
}