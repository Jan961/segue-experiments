import prisma from 'lib/prisma';
import ExcelJS from 'exceljs';
import moment from 'moment';
import { addWidthAsPerContent, applyGradientFillToColumn } from 'services/reportsService';
import { makeRowTextBoldAndAllignLeft } from './promoter-holds';
import { dateToSimple } from 'services/dateService';
import { TasksFilterType } from 'state/tasks/tasksFilterState';
import { group } from 'radash';
import { ProductionTask } from 'prisma/generated/prisma-client';
import { getWeekNumsToDateMap } from 'utils/getDateFromWeekNum';
import { convertToPDF } from 'utils/report';

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

const handler = async (req, res) => {
  const { production, assignee, taskText, status, startDueDate, endDueDate, format } = (JSON.parse(req.body) ||
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
  const taskList: any[] = await prisma.ProductionTask.findMany({
    where: {
      ...where,
      ...(production && { ProductionId: production }),
      ...(assignee && { AssignedToUserId: assignee }),
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
      AssignedToUserId: true,
      Notes: true,
      ProductionId: true,
      User: {
        select: {
          FirstName: true,
          LastName: true,
        },
      },
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
  let startingRow = 8;
  const compareProductions = (a: ProductionTask[], b: ProductionTask[]): number => {
    const getStartDate = (production) =>
      production?.[0]?.Production?.DateBlock?.find?.((DateBlock) => DateBlock?.Name === 'Production')?.StartDate || '';
    return getStartDate(b) < getStartDate(a) ? 1 : -1;
  };
  const ProductionTasks = Object.values(ProductionTaskMap).sort(compareProductions);
  for (let taskList of ProductionTasks) {
    const progressData = [];
    const task = taskList?.[0];
    const ShowName = `${task?.Production?.Show?.Name}`;
    const { StartDate, EndDate } = task.Production.DateBlock.find((DateBlock) => DateBlock.Name === 'Production') || {};
    const weekNumsList = taskList.flatMap((ProductionTask) => [
      ProductionTask.CompleteByWeekNum,
      ProductionTask.StartByWeekNum,
    ]);
    const weekNumToDateMap = getWeekNumsToDateMap(StartDate, EndDate, Array.from(new Set(weekNumsList)));
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
    taskList
      .sort((a, b) => a.StartByWeekNum - b.StartByWeekNum)
      .map(({ Name, Code, Progress, StartByWeekNum, CompleteByWeekNum, Priority, Notes, User }) => {
        const { FirstName, LastName } = User || {};
        progressData.push(Progress);
        return worksheet.addRow([
          Code,
          Name,
          StartByWeekNum,
          dateToSimple(weekNumToDateMap[StartByWeekNum]),
          CompleteByWeekNum,
          dateToSimple(weekNumToDateMap[CompleteByWeekNum]),
          Progress,
          getTaskStatusFromProgress(Progress),
          `${FirstName || ''} ${LastName || ''}`,
          Priority,
          Notes,
        ]);
      });
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
    makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns });
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
};

export default handler;
