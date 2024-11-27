import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { getMaxProductionTaskCode } from 'services/TaskService';
import { isNullOrEmpty } from 'utils';
import { SelectedTask, handleRecurringTask, handleSingleTask } from 'services/tasks/moveTasks';

interface TaskRequest {
  selectedTaskList: SelectedTask[];
  ProductionId: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prisma = await getPrismaClient(req);

  try {
    const { selectedTaskList, ProductionId } = req.body as TaskRequest;

    if (!Array.isArray(selectedTaskList) || !ProductionId) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const productionWeeks = await tx.dateBlock.findFirst({
        where: {
          ProductionId,
          Name: 'Production',
        },
        select: { StartDate: true, EndDate: true },
      });

      if (!productionWeeks) {
        throw new Error('Production dates not found');
      }

      const { StartDate: prodStartDate, EndDate: prodEndDate } = productionWeeks;
      const counter = 1;

      // Get the initial max code outside the loop to prevent race conditions
      const baseCode = await getMaxProductionTaskCode(ProductionId, req);

      // Process all tasks sequentially within the transaction
      const results = [];
      for (let i = 0; i < selectedTaskList.length; i++) {
        const task = selectedTaskList[i];

        if (!isNullOrEmpty(task?.MTRId)) {
          const recurringResult = await handleRecurringTask(
            task,
            ProductionId,
            productionWeeks,
            prodStartDate,
            counter,
            req,
            tx,
          );
          results.push(recurringResult);
        } else {
          const singleResult = await handleSingleTask(task, ProductionId, prodStartDate, prodEndDate, i, tx, baseCode);
          results.push(singleResult);
        }
      }

      return results;
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Moving tasks failed:', error);
    return res.status(500).json({
      error: 'Error processing tasks',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export default handler;
