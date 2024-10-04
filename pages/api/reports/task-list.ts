import ExcelJS from 'exceljs';
import moment from 'moment';
import master from 'lib/prisma_master';
import { addWidthAsPerContent, applyGradientFillToColumn } from 'services/reportsService';
import { makeRowTextBoldAndAllignLeft } from './promoter-holds';
import { formattedDateWithDay } from 'services/dateService';
import { TasksFilterType } from 'state/tasks/tasksFilterState';
import { group, objectify } from 'radash';
import { getWeekNumsToDateMap } from 'utils/getDateFromWeekNum';
import { convertToPDF } from 'utils/report';
import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { AccountUser, User } from 'prisma/generated/prisma-master';
import { addBorderToAllCells } from 'utils/export';
import { COLOR_HEXCODE, colorTextAndBGCell } from 'services/salesSummaryService';

const getTaskStatusFromProgress = (progress: number) => {
  if (progress === 0) {
    return 'ToDo';
  } else if (progress > 0 && progress < 100) {
    return 'InProgress';
  } else if (progress === 100) {
    return 'Complete';
  }
  return '';
};

type CELL_FORMAT = {
  textColor: COLOR_HEXCODE;
  cellColor: COLOR_HEXCODE;
};

const getColorFormatFromStatus = (status: string): CELL_FORMAT => {
  if (status === 'Complete') {
    return {
      textColor: COLOR_HEXCODE.WHITE,
      cellColor: COLOR_HEXCODE.TASK_GREEN,
    };
  } else if (status === 'ToDo') {
    return {
      textColor: COLOR_HEXCODE.WHITE,
      cellColor: COLOR_HEXCODE.TASK_RED,
    };
  }
  return {
    textColor: COLOR_HEXCODE.BLACK,
    cellColor: COLOR_HEXCODE.WHITE,
  };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { production, assignee, taskText, status, startDueDate, endDueDate, format } = (req.body ||
      {}) as TasksFilterType & { format?: string };
    let where = {};
    if (status) {
      if (status === 'todo') {
        where = {
          ...where,
          Progress: 0,
        };
      } else if (status === 'progress') {
        where = {
          ...where,
          AND: [
            {
              Progress: {
                gt: 0,
              },
            },
            {
              Progress: {
                lt: 100,
              },
            },
          ],
        };
      } else if (status === 'complete') {
        where = {
          ...where,
          Progress: 100,
        };
      }
    }
    const prisma = await getPrismaClient(req);
    const taskList = await prisma.productionTask.findMany({
      where: {
        ...where,
        ...(production && production !== -1 && { ProductionId: production }),
        ...(assignee && assignee !== -1 && { TaskAssignedToAccUserId: assignee }),
        ...(taskText && {
          Name: {
            contains: taskText,
          },
        }),
        Production: {
          is: {
            IsArchived: false,
          },
        },
      },
      select: {
        Name: true,
        Code: true,
        Progress: true,
        StartByWeekNum: true,
        CompleteByWeekNum: true,
        Priority: true,
        TaskAssignedToAccUserId: true,
        Notes: true,
        ProductionId: true,
        Production: {
          select: {
            Code: true,
            DateBlock: true,
            Show: {
              select: {
                Name: true,
                Code: true,
              },
            },
          },
        },
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
    const ProductionTaskMap = group(taskList, (task) => task.ProductionId);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tasks', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      views: [{ state: 'frozen', xSplit: 0, ySplit: 5 }],
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
    worksheet.addRow([`PRODUCTION TASK LIST`]);
    worksheet.addRow([`Exported: ${moment().format('DD/MM/YY [at] HH:mm')} - Layout: Standard`]);
    worksheet.addRow(['', '', '', '', '', '', '', '', '', '', '']);
    worksheet.addRow([
      'CODE',
      'TASK NAME',
      'START BY (wk)',
      'START BY',
      'DUE (wk)',
      'DUE',
      'PROGRESS',
      'STATUS',
      'ASSIGNEE',
      'PRIORITY',
      'NOTES',
    ]);
    let rows = 4;
    let startingRow = 8;
    const compareProductions = (a, b): number => {
      const getStartDate = (production) =>
        production?.[0]?.Production?.DateBlock?.find?.((DateBlock) => DateBlock?.Name === 'Production')?.StartDate ||
        '';
      return getStartDate(b) < getStartDate(a) ? 1 : -1;
    };
    const ProductionTasks = Object.values(ProductionTaskMap).sort(compareProductions);
    for (let taskList of ProductionTasks) {
      const progressData = [];
      const task = taskList?.[0];
      const ShowName = `${task?.Production?.Show?.Name}`;
      const fullProductionCode = `${task?.Production?.Show?.Code}${task?.Production?.Code}`;
      const { StartDate, EndDate } =
        task.Production.DateBlock.find((DateBlock) => DateBlock.Name === 'Production') || {};
      const weekNumsList = taskList.flatMap((ProductionTask) => [
        ProductionTask.CompleteByWeekNum,
        ProductionTask.StartByWeekNum,
      ]);
      const weekNumToDateMap = getWeekNumsToDateMap(
        StartDate.toISOString?.(),
        EndDate?.toISOString?.(),
        Array.from(new Set(weekNumsList)),
      );
      taskList = taskList.filter((task) => {
        const taskDueDate = weekNumToDateMap?.[task.CompleteByWeekNum];
        return !(
          (startDueDate && new Date(taskDueDate) < new Date(startDueDate)) ||
          (endDueDate && new Date(taskDueDate) > new Date(endDueDate))
        );
      });
      if (!taskList.length) continue;
      worksheet.addRow([]);
      worksheet.addRow([ShowName]);
      worksheet.addRow([]);
      rows += 3;
      makeRowTextBoldAndAllignLeft({
        worksheet,
        row: rows - 1,
        numberOfColumns: 11,
        bgColor: COLOR_HEXCODE.TASK_YELLOW,
      });
      taskList
        .sort((a, b) => a.StartByWeekNum - b.StartByWeekNum)
        .map(
          ({ Name, Code, Progress, StartByWeekNum, CompleteByWeekNum, Priority, Notes, TaskAssignedToAccUserId }) => {
            const User = usersMap[TaskAssignedToAccUserId];
            const { UserFirstName: FirstName, UserLastName: LastName } = User || {};
            progressData.push(Progress);
            const status = getTaskStatusFromProgress(Progress);
            const row = worksheet.addRow([
              `${fullProductionCode}-${Code}`,
              Name,
              StartByWeekNum,
              formattedDateWithDay(weekNumToDateMap[StartByWeekNum]),
              CompleteByWeekNum,
              formattedDateWithDay(weekNumToDateMap[CompleteByWeekNum]),
              Progress,
              status,
              `${FirstName || ''} ${LastName || ''}`,
              Priority,
              Notes,
            ]);
            rows++;
            const cellFormat = getColorFormatFromStatus(status);
            colorTextAndBGCell({ worksheet, row: rows, col: 1, ...cellFormat });
            colorTextAndBGCell({ worksheet, row: rows, col: 2, ...cellFormat });
            return row;
          },
        );
      worksheet.mergeCells(`A${startingRow - 2}:C${startingRow - 2}`);
      worksheet.getRow(startingRow - 2).font = { bold: true, size: 14 };
      worksheet.getRow(startingRow - 2).alignment = { horizontal: 'left' };
      applyGradientFillToColumn({ worksheet, columnIndex: 6, progressData, startingRow });
      startingRow = startingRow + 3 + taskList.length;
    }
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
      rowsToIgnore: 4,
      maxColWidth: Infinity,
    });
    worksheet.getColumn('A').width = 8;
    worksheet.getColumn('C').width = 5;
    worksheet.getColumn('E').width = 5;
    worksheet.getColumn('G').alignment = { horizontal: 'center' };
    addBorderToAllCells({ worksheet });
    const filename = `Tasks.xlsx`;
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
