import { TourTask } from '@prisma/client';
import prisma from 'lib/prisma';
import ExcelJS from 'exceljs';
import moment from 'moment';
import { addWidthAsPerContent } from 'services/reportsService';
import { makeRowTextBoldAndAllignLeft } from './promoter-holds';

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
      Tour: {
        select: {
          Code: true,
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
  console.table(taskList);
  const task = taskList?.[0];
  const FullTourCode = `${task?.Tour?.Show?.Code}${task?.Tour?.Code}`;
  const ShowName = `${task?.Tour?.Show?.Name}`;
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

  worksheet.addRow([`TOUR TASK LIST`]);
  worksheet.addRow([`Exported: ${moment().format('DD/MM/YY [at] HH:mm')} - Layout: Standard`]);
  worksheet.addRow(['', '', '', '', '', '', '', 'DEPARTMENTS', '', '', '', '%']);
  worksheet.addRow([
    'CODE',
    'TASK NAME',
    'START BY',
    '',
    'COMPLETE BY',
    '',
    'P!',
    'RCK',
    'MKT',
    'PRD',
    'ACC',
    'PROGRESS',
  ]);
  worksheet.addRow([]);
  taskList.map(({ Name, Progress, StartByWeekNum, CompleteByWeekNum, Priority }) => {
    return worksheet.addRow([
      FullTourCode,
      Name,
      StartByWeekNum,
      '',
      CompleteByWeekNum,
      '',
      Priority,
      '',
      '',
      '',
      '',
      Progress,
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
  const filename = `${FullTourCode} Tasks.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  workbook.xlsx.write(res).then(() => {
    res.end();
  });
};

export default handler;
