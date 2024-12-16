import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { createUserMap, fetchAccountUsers, fetchTasks, generateExcelSheet } from 'services/reports/tasks';
import { formatDate, newDate } from 'services/dateService';
import { exportWorkbook } from 'utils/report';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { search, format } = req.body || {};
    const prisma = await getPrismaClient(req);

    // fetches master tasks list based on search query
    const taskList = await fetchTasks(prisma, search);
    // create a list of unique user ids
    const userIdList = [...new Set(taskList.map((task) => task.TaskAssignedToAccUserId))].filter((x) => x);

    // fetch user details for the list of user ids
    const accountUsers = await fetchAccountUsers(userIdList);
    // create a map of user id to user details for easy access
    const usersMap = createUserMap(accountUsers);
    // create title for the master tasks report
    const title = `Master Tasks ${formatDate(newDate(), 'dd.MM.yy')}`;
    // create the excel report from tasklist, user details and title
    const workbook = generateExcelSheet(taskList, usersMap, title);
    // export the workbook in the requested format
    await exportWorkbook(res, workbook, title, format);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export default handler;
