import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

function formatNewValue(val, field) {
  if (field === 'FollowUp') {
    return new Date(val);
  }
  if (field === 'Priority' || field === 'Progress' || field === 'Assignee') {
    return parseInt(val);
  }
  return val;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { productionTaskIds, fieldToUpdate, newValue } = req.body;

    const email = await getEmailFromReq(req);
    // Check all Task Ids
    const check = productionTaskIds.map((TaskId) => checkAccess(email, { TaskId }));
    const result = await Promise.all(check);
    if (result.filter((x) => !x).length > 0) return res.status(401).end();

    if (!Array.isArray(productionTaskIds) || productionTaskIds.length === 0) {
      res.status(400).json({ error: 'productionTaskIds must be a non-empty array' });
      return;
    }

    if (typeof fieldToUpdate !== 'string' || fieldToUpdate.trim() === '') {
      res.status(400).json({ error: 'fieldToUpdate must be a non-empty string' });
      return;
    }

    const preparedValue = formatNewValue(newValue, fieldToUpdate);
    const updateTasksPromises = productionTaskIds.map((productionTaskId) =>
      prisma.productionTask.update({
        where: { ProductionTaskId: parseInt(productionTaskId) },
        data: { [fieldToUpdate]: preparedValue },
      }),
    );

    const updateResults = await Promise.all(updateTasksPromises);

    res.json(updateResults);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error updating ProductionTasks' });
  }
}
