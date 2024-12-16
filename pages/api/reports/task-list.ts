import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import ExcelJS from 'exceljs';
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
import { calculateWeekNumber, formatDate, formattedDateWithWeekDay, newDate } from 'services/dateService';
import { COLOR_HEXCODE, colorTextAndBGCell } from 'services/salesSummaryService';
import { addWidthAsPerContent, applyGradientFillToColumn } from 'services/reportsService';
import { addBorderToAllCells } from 'utils/export';
import { exportWorkbook } from 'utils/report';

/**
 * API handler for generating promoter holds report
 * Supports both Excel and PDF formats
 * @param req
 * @param res
 * @returns
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { format, production, assignee, taskText, startDueDate, endDueDate } = req.body || {};
    const prisma = await getPrismaClient(req);

    // fetches production tasks list based on search query, assignee
    const taskList = await fetchTasksForProduction(prisma, { production, assignee, taskText });
    // create a list of unique user ids from the task list
    const userIdList = [...new Set(taskList.map((task) => task.TaskAssignedToAccUserId))].filter((x) => x);

    // fetch user details for the list of user ids
    const accountUsers = await fetchAccountUsers(userIdList);
    // create a map of user id to user details for easy access
    const usersMap = createUserMap(accountUsers);

    // group tasks by production id for easy access
    const ProductionTaskMap = group(taskList, (task) => task.ProductionId);
    // create a new excel workbook
    const workbook = new ExcelJS.Workbook();
    // create a new worksheet in the workbook with the title 'Tasks'
    const worksheet = workbook.addWorksheet('Tasks', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      views: [{ state: 'frozen', xSplit: 0, ySplit: 5 }],
    });

    // create title for the production tasks report in the format 'Production Tasks dd.MM.yy'
    const title = `Production Tasks ${formatDate(newDate(), 'dd.MM.yy')}`;
    if (!taskList?.length) {
      // if no tasks are found, export the workbook as is
      await exportWorkbook(res, workbook, title, format);
      return;
    }

    worksheet.addRow([title]);
    worksheet.addRow([`Exported: ${getExportedDate()} - Layout: Standard`]);
    // add header columns spread into two columns
    worksheet.addRow(['', '', '', '', '', '', '', '', '', '', '']);
    worksheet.addRow([
      'CODE',
      'TASK NAME',
      'START BY (wk)',
      'START BY',
      'DUE BY (wk)',
      'DUE',
      'PROGRESS',
      'STATUS',
      'ASSIGNEE',
      'PRIORITY',
      'NOTES',
    ]);

    let rows = 4;
    let startingRow = 8;

    /**
     * compare two productions based on their start date. this is used for sorting the productions
     * @param a
     * @param b
     * @returns
     */
    const compareProductions = (a, b): number => {
      const getStartDate = (production) =>
        production?.[0]?.Production?.DateBlock?.find?.((DateBlock) => DateBlock?.Name === 'Production')?.StartDate ||
        '';
      return getStartDate(b) < getStartDate(a) ? 1 : -1;
    };

    const ProductionTasks = Object.values(ProductionTaskMap).sort(compareProductions);
    const productionRowList = [];

    // loop through each production and and add tasks for each production to the worksheet grouped by production
    for (let taskList of ProductionTasks) {
      const progressData = [];
      const task = taskList?.[0];
      const ShowName = `${task?.Production?.Show?.Name}`;
      const fullProductionCode = `${task?.Production?.Show?.Code}${task?.Production?.Code}`;
      const { StartDate, EndDate } =
        task.Production.DateBlock.find((DateBlock) => DateBlock.Name === 'Production') || {};
      // create a list of unique week numbers from the task list for the production
      const weekNumsList = [
        ...new Set(
          taskList.flatMap((ProductionTask) => [ProductionTask.CompleteByWeekNum, ProductionTask.StartByWeekNum]),
        ),
      ].filter((x) => x);

      // create a map of week numbers to dates for easy access for all weeknums in a production
      const weekNumToDateMap = getWeekNumsToDateMap(
        StartDate.toISOString?.(),
        EndDate?.toISOString?.(),
        Array.from(new Set(weekNumsList)),
      );

      // filter tasks based on start and end due dates
      taskList = taskList.filter((task) => {
        const taskDueDate = weekNumToDateMap?.[task.CompleteByWeekNum] || '';
        return !(
          (startDueDate && newDate(taskDueDate) < newDate(startDueDate)) ||
          (endDueDate && newDate(taskDueDate) > newDate(endDueDate))
        );
      });
      // skip the production if no tasks are found
      if (!taskList.length) continue;

      // add the production name to the worksheet before adding tasks
      worksheet.addRow([]);
      worksheet.addRow([ShowName]);
      worksheet.addRow([]);
      rows += 3;
      productionRowList.push(rows - 1);
      // calculate the current week number which is difference between production start date and current date
      const currentWeekNum = calculateWeekNumber(StartDate.getTime(), newDate());

      // loop through each task in the production and add it to the worksheet
      taskList
        .sort((a, b) => a.StartByWeekNum - b.StartByWeekNum)
        .forEach(
          ({ Name, Code, Progress, StartByWeekNum, CompleteByWeekNum, Priority, Notes, TaskAssignedToAccUserId }) => {
            const User = usersMap[TaskAssignedToAccUserId];
            const { UserFirstName: FirstName, UserLastName: LastName } = User || {};
            progressData.push(Progress);
            // get the status of the task based on the progress. converts progress % to status
            const status = getTaskStatusFromProgress(Progress);
            const startWeek = weekNumToDateMap[StartByWeekNum] ? StartByWeekNum : null;
            const dueWeek = weekNumToDateMap[CompleteByWeekNum] ? CompleteByWeekNum : null;
            const row = worksheet.addRow([
              `${fullProductionCode}-${Code}`,
              Name,
              startWeek || '',
              formattedDateWithWeekDay(weekNumToDateMap[StartByWeekNum], 'Short'),
              dueWeek || '',
              formattedDateWithWeekDay(weekNumToDateMap[CompleteByWeekNum], 'Short'),
              Progress,
              status,
              `${FirstName || ''} ${LastName || ''}`,
              Priority,
              Notes,
            ]);
            rows++;
            // apply color to the cells based on the status of the task
            const cellFormat = getColorFormatFromStatus(status, dueWeek, currentWeekNum);
            colorTextAndBGCell({ worksheet, row: rows, col: 1, ...cellFormat });
            colorTextAndBGCell({ worksheet, row: rows, col: 2, ...cellFormat });
            return row;
          },
        );
      worksheet.mergeCells(`A${startingRow - 2}:C${startingRow - 2}`);
      worksheet.getRow(startingRow - 2).font = { bold: true, size: 14 };
      worksheet.getRow(startingRow - 2).alignment = { horizontal: 'left' };
      // apply gradient fill to the progress column
      applyGradientFillToColumn({ worksheet, columnIndex: 6, progressData, startingRow });
      startingRow = startingRow + 3 + taskList.length;
    }

    worksheet.getRow(1).font = { bold: true, size: 16 };
    worksheet.getRow(1).alignment = { horizontal: 'left' };
    const numberOfColumns = worksheet.columnCount;

    // make the first 4 header rows bold and align left
    for (let row = 1; row <= 4; row++) {
      makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns, bgColor: COLOR_HEXCODE.TASK_YELLOW });
    }

    // for each production row, make the row bold and align left
    productionRowList.forEach((row) => {
      makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns, bgColor: COLOR_HEXCODE.TASK_YELLOW });
    });

    // calculate the width of the columns based on the content and add width to each column
    addWidthAsPerContent({
      worksheet,
      fromColNumber: 1,
      toColNumber: numberOfColumns,
      startingColAsCharWIthCapsOn: 'A',
      minColWidth: 7,
      bufferWidth: 0,
      rowsToIgnore: 4,
      maxColWidth: Infinity,
    });

    worksheet.getColumn('A').width = 12;
    worksheet.getColumn('C').width = 14;
    worksheet.getColumn('D').width = 10;
    worksheet.getColumn('E').width = 12;
    worksheet.getColumn('F').width = 12;
    worksheet.getColumn('G').width = 10;
    worksheet.getColumn('J').width = 10;
    if (worksheet.getColumn('K').width < 35) {
      worksheet.getColumn('K').width = 35;
    }
    worksheet.getColumn('G').alignment = { horizontal: 'center' };

    // add border to all cells which ensures that cells loosing border will regain the border
    addBorderToAllCells({ worksheet });
    worksheet.getCell(1, 1).font = { size: 16, bold: true, color: { argb: COLOR_HEXCODE.WHITE } };

    // export the workbook in the requested format
    await exportWorkbook(res, workbook, title, format);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export default handler;
