import prisma from 'lib/prisma'

function formatNewValue(val, field){

  if(field === "FollowUp"){
    return new Date(val)
  }
  if(field === "Priority" || field === "Progress" || field === "Assignee"){
    return parseInt(val)
  }
  return val
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { tourTaskIds, fieldToUpdate, newValue } = req.body;

    if (!Array.isArray(tourTaskIds) || tourTaskIds.length === 0) {
      res.status(400).json({ error: "tourTaskIds must be a non-empty array" });
      return;
    }

    if (typeof fieldToUpdate !== "string" || fieldToUpdate.trim() === "") {
      res.status(400).json({ error: "fieldToUpdate must be a non-empty string" });
      return;
    }
    
    const preparedValue = formatNewValue(newValue, fieldToUpdate)
    const updateTasksPromises = tourTaskIds.map((tourTaskId) =>
      prisma.tourTask.update({
        where: { TourTaskId: parseInt(tourTaskId) },
        data: { [fieldToUpdate]: preparedValue},
      })
    );

    const updateResults = await Promise.all(updateTasksPromises);

    res.json(updateResults);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating TourTasks" });
  }
}
