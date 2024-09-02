import ExcelJS from 'exceljs';
import { VenueMinimalDTO } from 'interfaces';
import { simpleToDateDMY, dateToSimple } from 'services/dateService';

interface SpreadsheetRow {
  productionCode: string;
  venueCode: string;
  bookingDate: string;
  salesDate: string;
  salesType: string;
  seats: number;
  value: string;
  isFinal: string;
  ignoreWarning: string;
  response: string;
  details: string;
  rowNumber: number;
}

interface SpreadsheetData {
  venues: {
    venueCode: string;
    bookings: {
      bookingDate: Date;
      finalSalesDate: Date;
      bookingFirstRow: any;
      sales: {
        salesDate: Date;
        salesType: string;
        seats: number;
        value: string;
        isFinal: string;
        ignoreWarning: string;
        rowNumber: number;
        salesRow: any;
      }[];
    }[];
  }[];
}

enum SalesType {
  'General Sales',
  'General Reservations',
  'School Sales',
  'School Reservations',
}

enum isFinalType {
  'Y',
  'y',
  'N',
  'n',
  '',
}

enum ignoreWarningType {
  'Y',
  'y',
  'N',
  'n',
  '',
}

interface SpreadsheetIssues {
  spreadsheetErrorOccurred: boolean;
  spreadsheetWarningOccurred: boolean;
}

export const validateSpreadsheetFile = async (file, prodCode, venueList, prodDateRange) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file[0].file);

  const currentRow: SpreadsheetRow = {
    productionCode: '',
    venueCode: '',
    bookingDate: '',
    salesDate: '',
    salesType: '',
    seats: null,
    value: '',
    isFinal: '',
    ignoreWarning: '',
    response: '',
    details: '',
    rowNumber: null,
  };
  let previousRow: SpreadsheetRow = {
    productionCode: '',
    venueCode: '',
    bookingDate: '',
    salesDate: '',
    salesType: '',
    seats: null,
    value: '',
    isFinal: '',
    ignoreWarning: '',
    response: '',
    details: '',
    rowNumber: null,
  };
  const spreadsheetIssues: SpreadsheetIssues = {
    spreadsheetErrorOccurred: false,
    spreadsheetWarningOccurred: false,
  };
  const spreadsheetData: SpreadsheetData = {
    venues: [],
  };
  let currentVenue = '';
  let currentBookingDate = '';

  workbook.eachSheet((worksheet) => {
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        currentRow.productionCode = row.getCell(1).value as string;
        currentRow.venueCode = row.getCell(2).value as string;
        if (currentRow.venueCode) currentVenue = currentRow.venueCode; // allows for blank rows implying carrying on of venueCode from above
        currentRow.bookingDate = row.getCell(3).value as string;
        if (currentRow.bookingDate) currentBookingDate = currentRow.bookingDate; // allows for blank rows implying carrying on of booking date from above
        currentRow.salesDate = row.getCell(4).value as string;
        currentRow.salesType = row.getCell(5).value as string;
        currentRow.seats = row.getCell(6).value as number;
        currentRow.value = row.getCell(7).value as string;
        currentRow.isFinal = (row.getCell(8).value as string) ?? '';
        currentRow.ignoreWarning = (row.getCell(9).value as string) ?? '';
        currentRow.response = row.getCell(10).value as string;
        currentRow.details = row.getCell(11).value as string;
        currentRow.rowNumber = rowNumber;

        const { detailsMessage, rowErrorOccurred, rowWarningOccured } = validateRow(
          currentRow,
          previousRow,
          prodCode,
          venueList,
          prodDateRange,
          spreadsheetData,
          currentVenue,
          currentBookingDate,
          row,
        );

        updateDetailsAndResponseCells(row, detailsMessage, rowErrorOccurred, rowWarningOccured, spreadsheetIssues);

        previousRow = { ...currentRow };
      }
    });
  });

  postValidationChecks(spreadsheetData, spreadsheetIssues);
  convertWorkbookToFile(workbook, file);

  return { file, spreadsheetIssues };
};

const validateRow = (
  currentRow: SpreadsheetRow,
  previousRow: SpreadsheetRow,
  prodCode,
  venueList: Record<number, VenueMinimalDTO>,
  prodDateRange,
  spreadsheetData,
  currentVenue,
  currentBookingDate,
  row,
) => {
  let detailsMessage = '';
  let rowErrorOccurred = false;
  let rowWarningOccured = false;

  const { returnString, errorOccurred, warningOccurred } = updateValidateSpreadsheedData(
    spreadsheetData,
    currentRow,
    currentVenue,
    currentBookingDate,
    prodCode,
    venueList,
    prodDateRange,
    row,
  );

  detailsMessage += returnString;
  if (errorOccurred) rowErrorOccurred = true;
  if (warningOccurred) rowWarningOccured = true;

  return { detailsMessage, rowErrorOccurred, rowWarningOccured };
};

// Update SpreadsheetData var with the new row data and return any Warnings/Errors raised in the process
const updateValidateSpreadsheedData = (
  spreadsheetData: SpreadsheetData,
  currentRow: SpreadsheetRow,
  currentVenue: string,
  currentBookingDate: string,
  prodCode,
  venueList: Record<number, VenueMinimalDTO>,
  prodDateRange,
  row,
) => {
  let returnString = '';
  let warningOccurred = false;
  let errorOccurred = false;

  const createNewSale = () => {
    return {
      salesDate: new Date(currentRow.salesDate),
      salesType: currentRow.salesType,
      seats: currentRow.seats,
      value: currentRow.value,
      isFinal: currentRow.isFinal,
      ignoreWarning: currentRow.ignoreWarning,
      rowNumber: currentRow.rowNumber,
      salesRow: row,
    };
  };

  const createNewBooking = () => {
    return {
      bookingDate: new Date(currentRow.bookingDate),
      finalSalesDate: currentRow.isFinal.toUpperCase() === 'Y' ? new Date(currentRow.salesDate) : null,
      bookingFirstRow: row,
      sales: [createNewSale()],
    };
  };

  const venue = spreadsheetData.venues.find((v) => v.venueCode === currentVenue);

  if (!venue) {
    spreadsheetData.venues.push({
      venueCode: currentRow.venueCode,
      bookings: [createNewBooking()],
    });
    return { returnString, warningOccurred, errorOccurred };
  }

  const booking = venue.bookings.find((b) => b.bookingDate.getTime() === new Date(currentBookingDate).getTime());

  if (!booking) {
    venue.bookings.push(createNewBooking());
    return { returnString, warningOccurred, errorOccurred };
  }

  const sale = booking.sales.find((s) => s.salesDate.getTime() === new Date(currentRow.salesDate).getTime());

  if (sale) {
    const isMismatch =
      sale.seats !== currentRow.seats ||
      sale.value !== currentRow.value ||
      sale.salesType !== currentRow.salesType ||
      sale.isFinal.toUpperCase() !== currentRow.isFinal.toUpperCase() ||
      sale.ignoreWarning.toUpperCase() !== currentRow.ignoreWarning.toUpperCase();

    if (isMismatch) {
      returnString += ` | ERROR - Mismatch in information for Booking at Venue ${currentVenue} on ${dateToSimple(
        currentBookingDate,
      )}, on Sales Date ${dateToSimple(currentRow.salesDate)} (Row ${sale.rowNumber})`;
      errorOccurred = true;
    }
  } else {
    booking.sales.push(createNewSale());
  }

  const validations = [
    validateProductionCode(currentRow, prodCode),
    validateVenueCode(currentRow, venueList),
    validateBookingDate(currentRow, prodDateRange, prodCode),
    validateSalesDate(currentRow),
    validateSalesType(currentRow),
    validateSeats(currentRow),
    validateValue(currentRow),
    validateIsFinal(currentRow, booking),
    validateIgnoreWarning(currentRow),
  ];

  validations.forEach((validation) => {
    returnString += validation.returnString;
    if (validation.errorOccurred) errorOccurred = true;
    if (validation.warningOccured) warningOccurred = true;
  });

  return { returnString, warningOccurred, errorOccurred };
};

const validateProductionCode = (currentRow: SpreadsheetRow, prodCode) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccured = false;

  if (currentRow.rowNumber === 2 && !currentRow.productionCode) {
    returnString += '| ERROR - Must include at least 1 ProdCode at start of file';
    errorOccurred = true;
  }
  if (currentRow.productionCode && currentRow.productionCode !== prodCode) {
    returnString += '| ERROR - ProdCode does not match selected production (' + prodCode + ')';
    errorOccurred = true;
  }
  return { returnString, warningOccured, errorOccurred };
};

const validateVenueCode = (currentRow: SpreadsheetRow, venueList: Record<number, VenueMinimalDTO>) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccured = false;

  if (currentRow.productionCode && !currentRow.venueCode) {
    returnString += '| ERROR - must include at least one venue code for a given production';
    errorOccurred = true;
  }
  if (currentRow.venueCode && !Object.values(venueList).some((venue) => venue.Code === currentRow.venueCode)) {
    returnString += '| ERROR - Venue Code ' + currentRow.venueCode + ' not found';
    errorOccurred = true;
  }

  return { returnString, warningOccured, errorOccurred };
};

const validateBookingDate = (currentRow: SpreadsheetRow, prodDateRange, prodCode) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccured = false;

  const productionDates = prodDateRange.split('-');
  const prodStartDate = simpleToDateDMY(productionDates[0]);
  const prodEndDate = simpleToDateDMY(productionDates[1]);
  const rowDate = new Date(currentRow.bookingDate);

  if (!currentRow.bookingDate && currentRow.venueCode) {
    returnString += '| ERROR - Must specify a Booking Date for a new Venue Code';
    errorOccurred = true;
    return { returnString, warningOccured, errorOccurred };
  }

  if (currentRow.bookingDate && isNaN(rowDate.getTime())) {
    returnString += '| ERROR - Booking Date is not valid. Please use DD/MM/YYYY format';
    errorOccurred = true;
    return { returnString, warningOccured, errorOccurred };
  }

  if ((rowDate < prodStartDate || rowDate > prodEndDate) && currentRow.bookingDate) {
    returnString += '| ERROR - Booking Date is outside range of ' + prodCode + ' start/end date';
    errorOccurred = true;
  }

  return { returnString, warningOccured, errorOccurred };
};

const validateSalesDate = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccured = false;
  const rowDate = new Date(currentRow.salesDate);

  if (!currentRow.salesDate) {
    returnString += '| ERROR - Must include a date for the sale';
    errorOccurred = true;
    return { returnString, warningOccured, errorOccurred };
  }

  if (currentRow.salesDate && isNaN(rowDate.getTime())) {
    returnString += '| ERROR - Sales Date is not valid. Please use DD/MM/YYYY format';
    errorOccurred = true;
    return { returnString, warningOccured, errorOccurred };
  }

  return { returnString, warningOccured, errorOccurred };
};

const validateSalesType = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccured = false;

  if (!Object.values(SalesType).includes(currentRow.salesType)) {
    returnString +=
      "| ERROR - Sales type must be either 'General Sales', 'General Reservations', 'School Sales', 'School Reservations'";
    errorOccurred = true;
  }

  return { returnString, warningOccured, errorOccurred };
};

const validateSeats = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccured = false;

  if (!currentRow.seats) {
    returnString += '| ERROR - Must specify a value for Seats';
    errorOccurred = true;
    return { returnString, errorOccurred, warningOccured };
  }

  return { returnString, warningOccured, errorOccurred };
};

const validateValue = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccured = false;

  if (!currentRow.value) {
    returnString += '| ERROR - Must specify a value for Value';
    errorOccurred = true;
    return { returnString, errorOccurred, warningOccured };
  }

  return { returnString, warningOccured, errorOccurred };
};

const validateIsFinal = (currentRow: SpreadsheetRow, booking) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccured = false;

  if (!Object.values(isFinalType).includes(currentRow.isFinal)) {
    returnString += "| ERROR - Is Final must either be 'Y', 'N', or blank";
    errorOccurred = true;
  }

  if (
    currentRow.isFinal.toUpperCase() === 'Y' &&
    booking.finalSalesDate &&
    booking.finalSalesDate.getTime() !== new Date(currentRow.salesDate).getTime()
  ) {
    returnString += ' | ERROR - Cannot have more than one Is Final Date for a Booking';
    errorOccurred = true;
  } else if (currentRow.isFinal.toUpperCase() === 'Y') {
    booking.finalSalesDate = new Date(currentRow.salesDate);
  }

  return { returnString, warningOccured, errorOccurred };
};

const validateIgnoreWarning = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccured = false;

  if (!Object.values(ignoreWarningType).includes(currentRow.ignoreWarning)) {
    returnString += "| ERROR - Ignore Warning must either be 'Y', 'N', or blank";
    errorOccurred = true;
  }

  return { returnString, warningOccured, errorOccurred };
};

const formatDetailsMessage = (detailsMessage: string) => {
  const parts = detailsMessage.split('|').map((part) => part.trim());
  const errors = parts.filter((part) => part.startsWith('ERROR -')).join('| ');
  const warnings = parts.filter((part) => part.startsWith('WARNING -')).join(' | ');

  let returnString = '';
  if (errors) returnString += '| ' + errors;
  if (warnings) returnString += '| ' + warnings;

  return returnString;
};

const updateDetailsAndResponseCells = (
  row,
  detailsMessage,
  rowErrorOccurred,
  rowWarningOccured,
  spreadsheetIssues: SpreadsheetIssues,
) => {
  const formattedDetailsMessage = formatDetailsMessage(detailsMessage);
  writeDetailsResponse(row, formattedDetailsMessage, rowErrorOccurred, rowWarningOccured, spreadsheetIssues);
};

const convertWorkbookToFile = async (workbook, file) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: file[0].file.type });
  const newFile = new File([blob], file[0].file.name, {
    type: file[0].file.type,
  });
  file[0].file = newFile;
};

const postValidationChecks = (spreadsheetData: SpreadsheetData, spreadsheetIssues) => {
  for (const venue of spreadsheetData.venues) {
    for (const booking of venue.bookings) {
      if (!booking.finalSalesDate) {
        const errorMessage = '| ERROR - A VenueCode/BookingDate combination must have a specified final sales dates';
        const currentDetailsMessage = booking.bookingFirstRow.getCell(11).value;
        const formattedDetailsMessage = formatDetailsMessage(currentDetailsMessage + errorMessage);

        writeErrorCell(
          booking.bookingFirstRow.getCell(11),
          booking.bookingFirstRow.getCell(10),
          spreadsheetIssues,
          formattedDetailsMessage,
        );
      }

      let previousSale = null;
      for (const sale of booking.sales.sort((a, b) => a.salesDate.getTime() - b.salesDate.getTime())) {
        if (!previousSale) {
          previousSale = sale;
          continue;
        }

        let detailsMessage = '';
        let warningOccured = sale.salesRow.getCell(10).value === 'WARNING';
        const errorOccurred = sale.salesRow.getCell(10).value === 'ERROR';
        if (sale.seats > previousSale.seats * 1.15) {
          detailsMessage += '| WARNING - Seats increased by more than 15% from previous sale';
          warningOccured = true;
        }
        if (sale.seats < previousSale.seats) {
          detailsMessage += '| WARNING - Seats decreased from previous sale';
          warningOccured = true;
        }
        if (parseFloat(sale.value) > parseFloat(previousSale.value) * 1.15) {
          detailsMessage += '| WARNING - Value increased by more than 15% from previous sale';
          warningOccured = true;
        }
        if (parseFloat(sale.value) < parseFloat(previousSale.value)) {
          detailsMessage += '| WARNING - Value decreased from previous sale';
          warningOccured = true;
        }

        const formattedDetailsMessage = formatDetailsMessage((sale.salesRow.getCell(11).value += detailsMessage));
        writeDetailsResponse(sale.salesRow, formattedDetailsMessage, errorOccurred, warningOccured, spreadsheetIssues);

        previousSale = sale;
      }
    }
  }
};

const writeDetailsResponse = (row, message, errorOccurred, warningOccurred, spreadsheetIssues) => {
  const responseCell = row.getCell(10);
  const detailsCell = row.getCell(11);

  if (errorOccurred) {
    writeErrorCell(detailsCell, responseCell, spreadsheetIssues, message);
  } else if (warningOccurred) {
    const ignoreWarning = (row.getCell(8).value?.toUpperCase() ?? 'N') === 'Y';
    writeWarningCell(detailsCell, responseCell, spreadsheetIssues, message, ignoreWarning);
  } else {
    writeOKCell(detailsCell, responseCell);
  }
};

const writeErrorCell = (detailsCell, responseCell, spreadsheetIssues: SpreadsheetIssues, detailsMessage) => {
  responseCell.value = 'ERROR';

  responseCell.style = { ...responseCell.style }; // strange workaround to prevent styles from being wrongly applied to other cells, believe to be bug in exceljs
  responseCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'ffc7ce' },
  };
  responseCell.font = {
    color: { argb: '9C0006' },
    bold: true,
  };

  detailsCell.value = detailsMessage.toString();

  spreadsheetIssues.spreadsheetErrorOccurred = true;
};

const writeWarningCell = (
  detailsCell,
  responseCell,
  spreadsheetIssues: SpreadsheetIssues,
  detailsMessage,
  ignoreWarning,
) => {
  responseCell.value = 'WARNING';

  responseCell.style = { ...responseCell.style };
  responseCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEB9C' },
  };
  responseCell.font = {
    color: { argb: '9C5700' },
  };

  detailsCell.value = detailsMessage;

  if (!ignoreWarning) spreadsheetIssues.spreadsheetWarningOccurred = true; // don't raise a warning when ignore flag
};

const writeOKCell = (detailsCell, responseCell) => {
  responseCell.value = 'OK';

  responseCell.style = { ...responseCell.style };
  responseCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'C6EFCE' },
  };
  responseCell.font = {
    color: { argb: '006100' },
  };

  detailsCell.value = '';
};

export default validateSpreadsheetFile;
