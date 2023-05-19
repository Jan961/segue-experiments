import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {

    const {
      taskTitle,
      dueDate,
    
      progress,
      assignee,
      assignedBy,
      status,
      priority,
      followUp,
      tourId,
      notes
    } = req.body;

      // Fetch tour weeks
      const tourWeeks = await prisma.tourWeek.findMany({
        where: {
          TourId: parseInt(tourId),
        },
      });
  
      const dueDateObj = dueDate ? new Date(dueDate) : undefined;
      let startByWeekCode = "-";
      let completeByWeekCode = "-";
  
      if (dueDateObj) {
        const matchedTourWeek = tourWeeks.find((tourWeek) => {
          const mondayDate = new Date(tourWeek.MondayDate);
          const sundayDate = new Date(tourWeek.SundayDate);
  
          return dueDateObj >= mondayDate && dueDateObj <= sundayDate;
        });
  
        if (matchedTourWeek) {
          startByWeekCode = matchedTourWeek.WeekCode;
          completeByWeekCode = matchedTourWeek.WeekCode;
        }
      }

    const createResult = await prisma.tourTask.create({
      data: {
        TourId: parseInt(tourId),
        TaskCode: parseInt('0'),
        TaskName: taskTitle,
        StartByWeekCode: startByWeekCode,
        CompleteByWeekCode: completeByWeekCode,
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
        Status: status,
      },
    });

    
    res.json(createResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating TourTask" });
  }
}
