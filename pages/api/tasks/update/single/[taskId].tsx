import prisma from 'lib/prisma'

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
      // Check for reassignment of task
      const assignedConfig:any = {}
      if(assignee && assignee !== 0){
        assignedConfig.Assignee = parseInt(req.body.assignee)
        assignedConfig.AssignedBy = parseInt(assignedBy)
      }


      const updateResult = await prisma.tourTask.update({
        where: { TourTaskId: taskId },
        data: {
          TaskName: taskTitle,
          DueDate:  new Date(dueDate),
          Interval: interval,
          Progress: parseInt(progress),
          ...assignedConfig,
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
