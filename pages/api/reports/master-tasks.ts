import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { convertToPDF } from 'utils/report';
import { createUserMap, fetchAccountUsers, fetchTasks, generateExcelSheet } from 'services/reports/tasks';
import { formatDate } from 'services/dateService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { search, format } = req.body || {};
    const prisma = await getPrismaClient(req);

    const taskList = await fetchTasks(prisma, search);
    const userIdList = [...new Set(taskList.map((task) => task.TaskAssignedToAccUserId))].filter((x) => x);

    const accountUsers = await fetchAccountUsers(userIdList);
    const usersMap = createUserMap(accountUsers);
    const title = `Master Tasks ${formatDate(new Date(), 'dd.MM.yy')}`;
    const workbook = generateExcelSheet(taskList, usersMap, title);
    const filename = `${title}.xlsx`;
    if (format === 'pdf') {
      const pdf = await convertToPDF(workbook);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      res.end(pdf);
    } else {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      workbook.xlsx.write(res).then(() => {
        res.end();
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export default handler;
