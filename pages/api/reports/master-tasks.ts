import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { createUserMap, fetchAccountUsers, fetchTasks, generateExcelSheet } from 'services/reports/tasks';
import { formatDate, newDate } from 'services/dateService';
import { exportWorkbook } from 'utils/report';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { search, format } = req.body || {};
    const prisma = await getPrismaClient(req);

    const taskList = await fetchTasks(prisma, search);
    const userIdList = [...new Set(taskList.map((task) => task.TaskAssignedToAccUserId))].filter((x) => x);

    const accountUsers = await fetchAccountUsers(userIdList);
    const usersMap = createUserMap(accountUsers);
    const title = `Master Tasks ${formatDate(newDate(), 'dd.MM.yy')}`;
    const workbook = generateExcelSheet(taskList, usersMap, title);

    await exportWorkbook(res, workbook, title, format);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export default handler;
