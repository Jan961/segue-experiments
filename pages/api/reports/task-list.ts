import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import ExcelJS from 'exceljs';
import { convertToPDF } from 'utils/report';
import {
  createUserMap,
  fetchAccountUsers,
  fetchTasksForProduction,
  getColorFormatFromStatus,
  getExportedDate,
  getTaskStatusFromProgress,
} from 'services/reports/tasks';
import { getWeekNumsToDateMap } from 'utils/getDateFromWeekNum';
import { group } from 'radash';
import { makeRowTextBoldAndAllignLeft } from './promoter-holds';
import { formattedDateWithDay } from 'services/dateService';
import { COLOR_HEXCODE, colorTextAndBGCell } from 'services/salesSummaryService';
import { addWidthAsPerContent, applyGradientFillToColumn } from 'services/reportsService';
import { addBorderToAllCells } from 'utils/export';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { format, production, assignee, taskText, startDueDate, endDueDate } = req.body || {};
    const prisma = await getPrismaClient(req);

    const taskList = await fetchTasksForProduction(prisma, { production, assignee, taskText });
    const userIdList = [...new Set(taskList.map((task) => task.TaskAssignedToAccUserId))].filter((x) => x);

    const accountUsers = await fetchAccountUsers(userIdList);
    const usersMap = createUserMap(accountUsers);

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
    worksheet.addRow([`Exported: ${getExportedDate()} - Layout: Standard`]);
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
    const productionRowList = [];
    for (let taskList of ProductionTasks) {
      const progressData = [];
      const task = taskList?.[0];
      const ShowName = `${task?.Production?.Show?.Name}`;
      const fullProductionCode = `${task?.Production?.Show?.Code}${task?.Production?.Code}`;
      const { StartDate, EndDate } =
        task.Production.DateBlock.find((DateBlock) => DateBlock.Name === 'Production') || {};
      const weekNumsList = [
        ...new Set(
          taskList.flatMap((ProductionTask) => [ProductionTask.CompleteByWeekNum, ProductionTask.StartByWeekNum]),
        ),
      ].filter((x) => x);
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
      productionRowList.push(rows - 1);
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
    productionRowList.forEach((row) => {
      makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns, bgColor: COLOR_HEXCODE.TASK_YELLOW });
    });
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
    worksheet.getColumn('C').width = 5;
    worksheet.getColumn('E').width = 5;
    worksheet.getColumn('G').alignment = { horizontal: 'center' };
    addBorderToAllCells({ worksheet });
    worksheet.getCell(1, 1).font = { size: 16, bold: true, color: { argb: COLOR_HEXCODE.WHITE } };
    const filename = `Production Tasks.xlsx`;
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
