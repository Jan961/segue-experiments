


import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  if (req.method === "PUT") {
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

      const taskId = parseInt(req.query.taskId)

      const updateResult = await prisma.tourTask.update({
        where: { TourTaskId: taskId },
        data: {
          TaskName: taskTitle,
          DueDate:  new Date(dueDate),
          Interval: interval,
          Progress: parseInt(progress),
        //   Assignee: assignee ? parseInt(req.body.assignee) : undefined,
        //   AssignedBy: assignedBy ? parseInt(assignedBy) : undefined,
          Status: status,
          Priority: parseInt(priority),
          FollowUp: new Date(followUp),
          Notes: notes,
          DeptRCK: req.body.DeptRCK === "true",
          DeptMarketing: req.body.DeptMarketing === "true",
          DeptProduction: req.body.DeptProduction === "true",
          DeptAccounts: req.body.DeptAccounts === "true",
        },
      });

      res.json(updateResult);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error updating TourTask" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
