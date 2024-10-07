import { AccountUser, User } from 'prisma/generated/prisma-master';
import { objectify } from 'radash';
import master from 'lib/prisma_master';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { addWidthAsPerContent } from 'services/reportsService';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { addBorderToAllCells } from 'utils/export';
import { makeRowTextBoldAndAllignLeft } from 'pages/api/reports/promoter-holds';
import { DateBlock } from 'prisma/generated/prisma-client';

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

export const getExportedDate = () => format(new Date(), "dd/MM/yy 'at' HH:mm");
export const getTaskStatusFromProgress = (progress: number) => {
  if (progress === 0) {
    return 'ToDo';
  } else if (progress > 0 && progress < 100) {
    return 'InProgress';
  } else if (progress === 100) {
    return 'Complete';
  }
  return '';
};

export type CELL_FORMAT = {
  textColor: COLOR_HEXCODE;
  cellColor: COLOR_HEXCODE;
};

export const getColorFormatFromStatus = (status: string): CELL_FORMAT => {
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

export const createUserMap = (accountUsers: (AccountUser & { User: User })[]) => {
  return objectify(
    accountUsers,
    (user) => user.AccUserId,
    (user) => user.User,
  );
};

export const generateExcelSheet = (taskList, usersMap, worksheetTitle = 'Tasks') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(worksheetTitle, {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    views: [{ state: 'frozen', xSplit: 0, ySplit: 4 }],
  });

  worksheet.addRow([`${worksheetTitle}`]);
  worksheet.addRow([`Exported: ${getExportedDate()} - Layout: Standard`]);
  worksheet.addRow(['', '', '', '', '', '', '']);
  worksheet.addRow(['CODE', 'TASK NAME', 'START BY (wk)', 'DUE (wk)', 'ASSIGNEE', 'PRIORITY', 'NOTES']);

  taskList
    .sort((a, b) => a.StartByWeekNum - b.StartByWeekNum)
    .forEach(({ Name, Code, StartByWeekNum, CompleteByWeekNum, Priority, Notes, TaskAssignedToAccUserId }) => {
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
  addBorderToAllCells({ worksheet });
  worksheet.getCell(1, 1).font = { size: 16, bold: true };
  return workbook;
};
