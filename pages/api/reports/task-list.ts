import prisma from 'lib/prisma';
import ExcelJS from 'exceljs';
import moment from 'moment';
import { addWidthAsPerContent, applyGradientFillToColumn } from 'services/reportsService';
import { makeRowTextBoldAndAllignLeft } from './promoter-holds';
import { dateToSimple, getWeekNumsToDateMap } from 'services/dateService';

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
  const { TourId } = JSON.parse(req.body) || {};
  const taskList: any[] = await prisma.TourTask.findMany({
    where: {
      TourId,
    },
    select: {
      Name: true,
      Progress: true,
      StartByWeekNum: true,
      CompleteByWeekNum: true,
      Priority: true,
      AssignedToUserId: true,
      Notes: true,
      User: {
        select: {
          FirstName: true,
          LastName: true,
        },
      },
      Tour: {
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
  });
  const task = taskList?.[0];
  const FullTourCode = `${task?.Tour?.Show?.Code}${task?.Tour?.Code}`;
  // const ShowName = `${task?.Tour?.Show?.Name}`;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Tasks', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    views: [{ state: 'frozen', xSplit: 0, ySplit: 5 }],
  });

  if (!taskList?.length) {
    const filename = `${FullTourCode} Tasks.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res).then(() => {
      res.end();
    });
    return;
  }
  const { StartDate, EndDate } = task.Tour.DateBlock.find((DateBlock) => DateBlock.Name === 'Tour') || {};
  const weekNumsList = taskList.map((TourTask) => [TourTask.CompleteByWeekNum, TourTask.StartByWeekNum]).flat();
  const weekNumToDateMap = getWeekNumsToDateMap(StartDate, EndDate, Array.from(new Set(weekNumsList)));

  worksheet.addRow([`TOUR TASK LIST`]);
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
  worksheet.addRow([]);
  const progressData = [];
  taskList.map(({ Name, Progress, StartByWeekNum, CompleteByWeekNum, Priority, Notes, User }) => {
    const { FirstName, LastName } = User || {};
    progressData.push(Progress);
    return worksheet.addRow([
      FullTourCode,
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
  const numberOfColumns = worksheet.columnCount;
  worksheet.getRow(1).font = { bold: true, size: 16 };
  worksheet.getRow(1).alignment = { horizontal: 'left' };
  for (let row = 1; row <= 4; row++) {
    makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns });
  }
  worksheet.mergeCells('C4:D4');
  worksheet.mergeCells('E4:F4');
  worksheet.mergeCells('H3:K3');
  addWidthAsPerContent({
    worksheet,
    fromColNumber: 1,
    toColNumber: numberOfColumns,
    startingColAsCharWIthCapsOn: 'A',
    minColWidth: 10,
    bufferWidth: 0,
    rowsToIgnore: 4,
    maxColWidth: Infinity,
  });
  applyGradientFillToColumn({ worksheet, columnIndex: 6, progressData, startingRow: 6 });
  const filename = `${FullTourCode} Tasks.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  workbook.xlsx.write(res).then(() => {
    res.end();
  });
};

export default handler;
