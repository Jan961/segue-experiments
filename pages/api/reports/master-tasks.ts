import ExcelJS from 'exceljs';
import moment from 'moment';
import master from 'lib/prisma_master';
import { addWidthAsPerContent } from 'services/reportsService';
import { makeRowTextBoldAndAllignLeft } from './promoter-holds';
import { objectify } from 'radash';
import { convertToPDF } from 'utils/report';
import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { AccountUser, User } from 'prisma/generated/prisma-master';
import { addBorderToAllCells } from 'utils/export';
import { COLOR_HEXCODE } from 'services/salesSummaryService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { search, format } = req.body || {};

    const prisma = await getPrismaClient(req);
    const taskList = await prisma.masterTask.findMany({
      where: {
        ...(search && {
          Name: {
            contains: search,
          },
        }),
      },
      select: {
        Name: true,
        Code: true,
        StartByWeekNum: true,
        CompleteByWeekNum: true,
        Priority: true,
        TaskAssignedToAccUserId: true,
        Notes: true,
      },
      orderBy: [{ StartByWeekNum: 'asc' }],
    });
    const userIdList = [...new Set(taskList.map((task) => task.TaskAssignedToAccUserId))].filter((x) => x);
    const accountUsers = await master.AccountUser.findMany({
      where: {
        AccUserId: {
          in: userIdList,
        },
      },
      select: {
        AccUserId: true,
        User: {
          select: {
            UserFirstName: true,
            UserLastName: true,
            UserEmail: true,
          },
        },
      },
    });
    const usersMap: Record<number, User> = objectify(
      accountUsers,
      (user: AccountUser & { User: User }) => user.AccUserId,
      (user: AccountUser & { User: User }) => user.User,
    );
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tasks', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      views: [{ state: 'frozen', xSplit: 0, ySplit: 4 }],
    });
    if (!taskList?.length) {
      const filename = `Tasks.xlsx`;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      await workbook.xlsx.write(res).then(() => {
        res.end();
      });
      return;
    }
    worksheet.addRow([`MASTER TASK LIST`]);
    worksheet.addRow([`Exported: ${moment().format('DD/MM/YY [at] HH:mm')} - Layout: Standard`]);
    worksheet.addRow(['', '', '', '', '', '', '']);
    worksheet.addRow(['CODE', 'TASK NAME', 'START BY (wk)', 'DUE (wk)', 'ASSIGNEE', 'PRIORITY', 'NOTES']);
    taskList
      .sort((a, b) => a.StartByWeekNum - b.StartByWeekNum)
      .map(({ Name, Code, StartByWeekNum, CompleteByWeekNum, Priority, Notes, TaskAssignedToAccUserId }) => {
        const User = usersMap[TaskAssignedToAccUserId];
        const { UserFirstName: FirstName, UserLastName: LastName } = User || {};
        const row = worksheet.addRow([
          `${Code}`,
          Name,
          StartByWeekNum,
          CompleteByWeekNum,
          `${FirstName || ''} ${LastName || ''}`,
          Priority,
          Notes,
        ]);
        return row;
      });
    worksheet.getRow(1).font = { bold: true, size: 16 };
    worksheet.getRow(1).alignment = { horizontal: 'left' };
    const numberOfColumns = worksheet.columnCount;
    for (let row = 1; row <= 4; row++) {
      makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns, bgColor: COLOR_HEXCODE.TASK_YELLOW });
    }
    worksheet.mergeCells('C4:D4');
    worksheet.mergeCells('E4:F4');
    worksheet.mergeCells('H3:K3');
    addWidthAsPerContent({
      worksheet,
      fromColNumber: 2,
      toColNumber: numberOfColumns,
      startingColAsCharWIthCapsOn: 'B',
      minColWidth: 10,
      bufferWidth: 0,
      rowsToIgnore: 3,
      maxColWidth: Infinity,
    });
    worksheet.getColumn('A').width = 8;
    worksheet.getColumn('C').width = 5;
    worksheet.getColumn('D').width = 5;
    worksheet.getColumn('G').alignment = { horizontal: 'center' };
    addBorderToAllCells({ worksheet });
    const filename = `Master Tasks.xlsx`;
    if (format === 'pdf') {
      worksheet.pageSetup.printArea = `A1:${worksheet.getColumn(11).letter}${worksheet.rowCount}`;
      worksheet.pageSetup.fitToWidth = 1;
      worksheet.pageSetup.fitToHeight = 1;
      worksheet.pageSetup.orientation = 'landscape';
      worksheet.pageSetup.fitToPage = true;
      worksheet.pageSetup.margins = {
        left: 0.25,
        right: 0.25,
        top: 0.25,
        bottom: 0.25,
        header: 0.3,
        footer: 0.3,
      };
      const pdf = await convertToPDF(workbook);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      res.end(pdf);
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export default handler;
