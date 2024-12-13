import { AccountUser, User } from 'prisma/generated/prisma-master';
import { objectify } from 'radash';
import master from 'lib/prisma_master';
import ExcelJS from 'exceljs';
import { addWidthAsPerContent } from 'services/reportsService';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { addBorderToAllCells } from 'utils/export';
import { makeRowTextBoldAndAllignLeft } from 'pages/api/reports/promoter-holds';
import { DateBlock } from 'prisma/generated/prisma-client';
import { formatDate, newDate } from 'services/dateService';

type Task = {
  Name: string;
  Code: string;
  Progress: number;
  StartByWeekNum: number;
  CompleteByWeekNum: number;
  Priority: number;
  TaskAssignedToAccUserId: number;
  Notes: string;
  ProductionId: number;
  Production: {
    Code: string;
    DateBlock: DateBlock[];
    Show: {
      Name: string;
      Code: string;
    };
  };
};

export const getExportedDate = () => formatDate(newDate(), "dd/MM/yy 'at' HH:mm");
export const getTaskStatusFromProgress = (progress: number) => {
  if (progress === 0) {
    return 'To Do';
  } else if (progress > 0 && progress < 100) {
    return 'In Progress';
  } else if (progress === 100) {
    return 'Complete';
  }
  return '';
};

export type CELL_FORMAT = {
  textColor: COLOR_HEXCODE;
  cellColor: COLOR_HEXCODE;
};

/**
 * get the color format for the cell based on the task status and due week number
 * @param status
 * @param dueWeekNum
 * @param currentWeekNum
 * @returns
 */
export const getColorFormatFromStatus = (
  status: string,
  dueWeekNum: number,
  currentWeekNum: number,
): CELL_FORMAT | undefined => {
  if (!status || !dueWeekNum) {
    return;
  }

  const isTaskPending = status === 'To Do' || status === 'In Progress';

  if (status === 'Complete') {
    return {
      textColor: COLOR_HEXCODE.WHITE,
      cellColor: COLOR_HEXCODE.TASK_GREEN,
    };
  }

  if (isTaskPending) {
    if (currentWeekNum > dueWeekNum) {
      return {
        textColor: COLOR_HEXCODE.WHITE,
        cellColor: COLOR_HEXCODE.TASK_RED,
      };
    }
    if (currentWeekNum === dueWeekNum) {
      return {
        textColor: COLOR_HEXCODE.WHITE,
        cellColor: COLOR_HEXCODE.TASK_AMBER,
      };
    }
    return {
      textColor: COLOR_HEXCODE.BLACK,
      cellColor: COLOR_HEXCODE.WHITE,
    };
  }
};

/**
 * fetches production tasks list based on search query, assignee
 * @param prisma
 * @param param1
 * @returns
 */
export const fetchTasksForProduction = async (prisma, { production, assignee, taskText }): Promise<Task[]> => {
  let where = {};

  if (production && production !== -1) {
    where = {
      ...where,
      ProductionId: production,
    };
  }

  if (assignee && assignee !== -1) {
    where = {
      ...where,
      TaskAssignedToAccUserId: assignee,
    };
  }

  if (taskText) {
    where = {
      ...where,
      Name: {
        contains: taskText,
      },
    };
  }

  return prisma.productionTask.findMany({
    where: {
      ...where,
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
};

/**
 * fetches master tasks list based on search query
 * @param prisma
 * @param search
 * @returns
 */
export const fetchTasks = async (prisma, search) => {
  return prisma.masterTask.findMany({
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
};

/**
 * fetch user details for the list of user ids
 * @param userIdList
 * @returns
 */
export const fetchAccountUsers = async (userIdList) => {
  return master.AccountUser.findMany({
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
};

/**
 * create a map of user id to user details for easy access
 * @param accountUsers
 * @returns
 */
export const createUserMap = (accountUsers: (AccountUser & { User: User })[]) => {
  return objectify(
    accountUsers,
    (user) => user.AccUserId,
    (user) => user.User,
  );
};

/**
 * create an excel sheet from the task list and user details
 * @param taskList
 * @param usersMap
 * @param worksheetTitle
 * @returns
 */
export const generateExcelSheet = (taskList, usersMap, worksheetTitle = 'Tasks') => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  // Create a new worksheet with the title
  const worksheet = workbook.addWorksheet(worksheetTitle, {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    views: [{ state: 'frozen', xSplit: 0, ySplit: 4 }],
  });

  // Add the title and exported date to the worksheet
  worksheet.addRow([`${worksheetTitle}`]);
  worksheet.addRow([`Exported: ${getExportedDate()} - Layout: Standard`]);
  // add column headers split into two rows
  worksheet.addRow(['', '', '', '', '', '', '']);
  worksheet.addRow(['CODE', 'TASK NAME', 'START BY (wk)', 'DUE (wk)', 'ASSIGNEE', 'PRIORITY', 'NOTES']);
  // merge the title row cells so that it stretches across the entire row
  worksheet.mergeCells(`A1:C1`);
  // loop through the task list and add rows to the worksheet
  taskList
    .sort((a, b) => a.StartByWeekNum - b.StartByWeekNum)
    .forEach(({ Name, Code, StartByWeekNum, CompleteByWeekNum, Priority, Notes, TaskAssignedToAccUserId }) => {
      // get the user details for the usersmap
      const User = usersMap[TaskAssignedToAccUserId];
      const { UserFirstName: FirstName, UserLastName: LastName } = User || {};
      // add a new row to the worksheet
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

  const numberOfColumns = worksheet.columnCount;
  //  make the first 4 header row bold and allign left
  for (let row = 1; row <= 4; row++) {
    makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns, bgColor: COLOR_HEXCODE.TASK_YELLOW });
  }

  // calculate the width of the columns based on the content and add width to each column
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

  // title row should be 16 font size and bold and left aligned
  worksheet.getCell(1, 1).font = { size: 16, bold: true, color: { argb: COLOR_HEXCODE.WHITE } };
  // add border to all cells which ensures that cells loosing border will regain the border
  addBorderToAllCells({ worksheet });
  return workbook;
};
