import ExcelJS from 'exceljs';
import { VenueMinimalDTO } from 'interfaces';
import { dateToSimple, newDate, simpleToDateDMY } from 'services/dateService';
import {
  SpreadsheetRow,
  SpreadsheetIssues,
  SpreadsheetData,
  SalesType,
  isFinalType,
  ignoreWarningType,
  tableColMaps,
  expectedHeaders,
  SpreadsheetDataCleaned,
  MismatchRowData,
} from 'types/SpreadsheetValidationTypes';

let currentRow: SpreadsheetRow;
let spreadsheetIssues: SpreadsheetIssues;
let spreadsheetData: SpreadsheetData;
let errorRows = new Set();
let warningRows = new Set();
let mismatchedRows = new Map<number, MismatchRowData>();

export const validateSpreadsheetFile = async (file, prodShowCode, venueList, prodDateRange) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file[0].file);

  currentRow = {
    productionCode: '',
    venueCode: '',
    bookingDate: '',
    salesDate: null,
    salesType: '',
    seats: null,
    value: '',
    isFinal: '',
    ignoreWarning: '',
    response: '',
    details: '',
    rowNumber: null,
    row: null,
  };
  spreadsheetIssues = {
    spreadsheetErrorOccurred: false,
    spreadsheetWarningOccurred: false,
    spreadsheetFormatIssue: false,
  };
  spreadsheetData = {
    venues: [],
  };
  errorRows = new Set();
  warningRows = new Set();
  mismatchedRows = new Map<number, MismatchRowData>();
  let currentVenue = '';
  let currentBookingDate = '';

  validateHeaders(workbook);
  if (spreadsheetIssues.spreadsheetFormatIssue) {
    const cleanedSpreadsheetData = cleanSpreadsheetData(spreadsheetData);
    return { file, spreadsheetIssues, spreadsheetData: cleanedSpreadsheetData };
  }

  const salesWorksheet = workbook.getWorksheet('Sales');
  if (!salesWorksheet) {
    spreadsheetIssues.spreadsheetFormatIssue = true;
    const cleanedSpreadsheetData = cleanSpreadsheetData(spreadsheetData);
    return { file, spreadsheetIssues, spreadsheetData: cleanedSpreadsheetData };
  }

  salesWorksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip the first row (titles)

    currentRow.productionCode = row.getCell(tableColMaps.ProdCode).value as string;
    currentRow.venueCode = row.getCell(tableColMaps.VenueCode).value as string;
    if (currentRow.venueCode && currentRow.venueCode !== currentVenue) {
      // allows for blank rows implying carrying on of venueCode from above
      currentVenue = currentRow.venueCode;
      currentBookingDate = null;
    }
    currentRow.bookingDate =
      typeof row.getCell(tableColMaps.BookingDate).value === 'object'
        ? (row.getCell(tableColMaps.BookingDate).value as string)
        : '';
    if (currentRow.bookingDate) currentBookingDate = currentRow.bookingDate; // allows for blank rows implying carrying on of booking date from above
    currentRow.salesDate =
      typeof row.getCell(tableColMaps.SalesDate).value === 'object' &&
      row.getCell(tableColMaps.SalesDate).value !== null
        ? row.getCell(tableColMaps.SalesDate).value.toString()
        : '';
    currentRow.salesType = row.getCell(tableColMaps.SalesType).value as string;
    currentRow.seats = row.getCell(tableColMaps.Seats).value as number;
    currentRow.value = row.getCell(tableColMaps.Value).value as string;
    currentRow.isFinal = (row.getCell(tableColMaps.isFinal).value as string) ?? '';
    currentRow.ignoreWarning = (row.getCell(tableColMaps.ignoreWarning).value as string) ?? '';
    currentRow.response = row.getCell(tableColMaps.Response).value as string;
    currentRow.details = row.getCell(tableColMaps.Details).value as string;
    currentRow.rowNumber = rowNumber;
    currentRow.row = row;

    const isBlankRow = checkForBlankRow(currentRow);
    if (isBlankRow) return;

    const { detailsColumnMessage, rowErrorOccurred, rowWarningOccurred } = validateRow(
      currentRow,
      prodShowCode,
      venueList,
      prodDateRange,
      currentVenue,
      currentBookingDate,
      row,
    );

    if (rowErrorOccurred) errorRows.add(row);
    if (rowWarningOccurred) warningRows.add(row);

    const formattedDetailsMessage = formatDetailsMessage(detailsColumnMessage);
    updateResponseDetailsCells(row, formattedDetailsMessage, rowErrorOccurred, rowWarningOccurred);
  });

  postValidationChecks();
  const detailsColumn = salesWorksheet.getColumn(tableColMaps.Details);
  widenColumn(detailsColumn);
  createSummaryWorksheet(workbook);
  convertWorkbookToFile(workbook, file);
  const cleanedSpreadsheetData = cleanSpreadsheetData(spreadsheetData);

  return { file, spreadsheetIssues, spreadsheetData: cleanedSpreadsheetData };
};

const validateRow = (
  currentRow: SpreadsheetRow,
  prodShowCode,
  venueList: Record<number, VenueMinimalDTO>,
  prodDateRange,
  currentVenue,
  currentBookingDate,
  row,
) => {
  let detailsColumnMessage = '';
  let rowWarningOccurred = false;
  let rowErrorOccurred = false;

  const {
    detailsColumnMessage: returnString,
    rowErrorOccurred: errorOccurred,
    rowWarningOccurred: warningOccurred,
    currentRowBooking,
  } = updateValidateSpreadsheetData(currentRow, currentVenue, currentBookingDate, row);

  detailsColumnMessage += returnString;
  if (errorOccurred) rowErrorOccurred = true;
  if (warningOccurred) rowWarningOccurred = true;

  const validations = [
    validateProductionCode(currentRow, prodShowCode),
    validateVenueCode(currentRow, venueList),
    validateBookingDate(currentRow, currentBookingDate, prodDateRange, prodShowCode),
    validateSalesDate(currentRow),
    validateSalesType(currentRow),
    validateSeats(currentRow),
    validateValue(currentRow),
    validateIsFinal(currentRow, currentRowBooking),
    validateIgnoreWarning(currentRow),
  ];

  validations.forEach((validation) => {
    detailsColumnMessage += validation.returnString;
    if (validation.errorOccurred) rowErrorOccurred = true;
    if (validation.warningOccurred) rowWarningOccurred = true;
  });

  return { detailsColumnMessage, rowErrorOccurred, rowWarningOccurred };
};

// Update SpreadsheetData object with new row data and return any Warnings/Errors raised in the process
const updateValidateSpreadsheetData = (
  currentRow: SpreadsheetRow,
  currentVenue: string,
  currentBookingDate: string,
  row,
) => {
  let detailsColumnMessage = '';
  const rowWarningOccurred = false;
  let rowErrorOccurred = false;

  const createNewSale = () => {
    return {
      salesDate: newDate(currentRow.salesDate),
      salesType: currentRow.salesType,
      seats: currentRow.seats,
      value: currentRow.value,
      isFinal: typeof currentRow.isFinal === 'string' ? currentRow.isFinal : '',
      ignoreWarning: currentRow.ignoreWarning,
      rowNumber: currentRow.rowNumber,
      salesRow: row,
    };
  };

  const createNewBooking = () => {
    return {
      bookingDate: newDate(currentRow.bookingDate),
      finalSalesDate:
        typeof currentRow.isFinal === 'string' && currentRow.isFinal.toUpperCase() === 'Y'
          ? newDate(currentRow.salesDate)
          : null,
      bookingFirstRow: row,
      sales: [createNewSale()],
    };
  };

  const venue = spreadsheetData.venues.find((v) => v.venueCode === currentVenue);

  if (!venue) {
    if (currentBookingDate) {
      spreadsheetData.venues.push({
        venueCode: currentRow.venueCode,
        bookings: [createNewBooking()],
      });
    } else {
      detailsColumnMessage += '| ERROR - Cannot add a new Sale without a Booking Date';
      rowErrorOccurred = true;
    }

    return { detailsColumnMessage, rowWarningOccurred, rowErrorOccurred, currentRowBooking: null };
  }

  const booking = venue.bookings.find((b) => b.bookingDate.getTime() === newDate(currentBookingDate).getTime());

  if (!booking) {
    if (currentBookingDate) {
      venue.bookings.push(createNewBooking());
    }
    return { detailsColumnMessage, rowWarningOccurred, rowErrorOccurred, currentRowBooking: null };
  }

  const sale = booking.sales.find(
    (s) => s.salesDate.getTime() === newDate(currentRow.salesDate).getTime() && s.salesType === currentRow.salesType,
  );

  if (sale) {
    // If there is already an identical VenueCode/BookingDate/SaleDate in SpreadsheetData, ensure they don't have conflicting data
    const isMismatch =
      sale.seats !== currentRow.seats ||
      sale.value !== currentRow.value ||
      String(sale.isFinal).toUpperCase() !== currentRow.isFinal.toUpperCase() ||
      sale.ignoreWarning.toUpperCase() !== currentRow.ignoreWarning.toUpperCase();

    if (isMismatch) {
      mismatchedRows.set(sale.salesRow.number, {
        row: sale.salesRow,
        bookingDate: currentBookingDate,
        salesDate: sale.salesDate,
        venueCode: currentVenue,
      });
      mismatchedRows.set(currentRow.row.number, {
        row: currentRow.row,
        bookingDate: currentBookingDate,
        salesDate: sale.salesDate,
        venueCode: currentVenue,
      });
    }
  } else {
    booking.sales.push(createNewSale());
  }

  return { detailsColumnMessage, rowWarningOccurred, rowErrorOccurred, currentRowBooking: booking };
};

const validateProductionCode = (currentRow: SpreadsheetRow, prodShowCode) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccurred = false;

  if (currentRow.rowNumber === 2 && !currentRow.productionCode) {
    returnString += '| ERROR - Must include at least 1 ProdCode at start of file';
    errorOccurred = true;
  }
  if (currentRow.productionCode && currentRow.productionCode !== prodShowCode) {
    returnString += '| ERROR - ProdCode does not match selected production (' + prodShowCode + ')';
    errorOccurred = true;
  }
  return { returnString, warningOccurred, errorOccurred };
};

const validateVenueCode = (currentRow: SpreadsheetRow, venueList: Record<number, VenueMinimalDTO>) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccurred = false;

  if (currentRow.productionCode && !currentRow.venueCode) {
    returnString += '| ERROR - must include at least one venue code for a given production';
    errorOccurred = true;
  }
  if (currentRow.venueCode && !Object.values(venueList).some((venue) => venue.Code === currentRow.venueCode)) {
    returnString += '| ERROR - Venue Code ' + currentRow.venueCode + ' not found';
    errorOccurred = true;
  }

  return { returnString, warningOccurred, errorOccurred };
};

const validateBookingDate = (currentRow: SpreadsheetRow, currentBookingDate, prodDateRange, prodShowCode) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccurred = false;

  const productionDates = prodDateRange.split('-');
  const prodStartDate = simpleToDateDMY(productionDates[0]);
  const prodEndDate = simpleToDateDMY(productionDates[1]);
  const rowDate = newDate(currentRow.bookingDate);

  if (!currentBookingDate && currentRow.venueCode) {
    returnString += '| ERROR - Must specify a valid Booking Date for a Venue Code';
    errorOccurred = true;
    return { returnString, warningOccurred, errorOccurred };
  }

  if (currentRow.bookingDate && isNaN(rowDate.getTime())) {
    returnString += '| ERROR - Booking Date is not valid. Please use DD/MM/YYYY format';
    errorOccurred = true;
    return { returnString, warningOccurred, errorOccurred };
  }

  if ((rowDate < prodStartDate || rowDate > prodEndDate) && currentRow.bookingDate) {
    returnString += '| ERROR - Booking Date is outside range of ' + prodShowCode + ' start/end Production Dates';
    errorOccurred = true;
  }

  return { returnString, warningOccurred, errorOccurred };
};

const validateSalesDate = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccurred = false;

  if (!currentRow.salesDate) {
    returnString += '| ERROR - Must include a valid date for the sale';
    errorOccurred = true;
    return { returnString, warningOccurred, errorOccurred };
  }

  return { returnString, warningOccurred, errorOccurred };
};

const validateSalesType = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccurred = false;

  if (!Object.values(SalesType).includes(currentRow.salesType)) {
    returnString +=
      "| ERROR - Sales type must be either 'General Sales', 'General Reservations', 'School Sales', 'School Reservations'";
    errorOccurred = true;
  }

  return { returnString, warningOccurred, errorOccurred };
};

const validateSeats = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccurred = false;

  if (currentRow.seats === null) {
    returnString += '| ERROR - Must specify a value for seats';
    errorOccurred = true;
    return { returnString, errorOccurred, warningOccurred };
  }

  if (typeof currentRow.seats !== 'number') {
    returnString += '| ERROR - Value for Seats must be a number';
    errorOccurred = true;
    return { returnString, errorOccurred, warningOccurred };
  }

  return { returnString, warningOccurred, errorOccurred };
};

const validateValue = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccurred = false;

  if (currentRow.value === null) {
    returnString += '| ERROR - Must specify a value for value';
    errorOccurred = true;
    return { returnString, errorOccurred, warningOccurred };
  }

  if (Number.isNaN(parseInt(currentRow.value))) {
    returnString += '| ERROR - Value for Value must be a number';
    errorOccurred = true;
    return { returnString, errorOccurred, warningOccurred };
  }

  return { returnString, warningOccurred, errorOccurred };
};

const validateIsFinal = (currentRow: SpreadsheetRow, booking) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccurred = false;

  if (!Object.values(isFinalType).includes(currentRow.isFinal)) {
    returnString += "| ERROR - Is Final must either be 'Y', 'N', or blank";
    errorOccurred = true;
  }

  if (booking) {
    if (
      currentRow.isFinal.toUpperCase() === 'Y' &&
      booking.finalSalesDate &&
      booking.finalSalesDate.getTime() !== newDate(currentRow.salesDate).getTime()
    ) {
      returnString += ' | ERROR - Cannot have more than one Is Final Date for a Booking';
      errorOccurred = true;
    } else if (currentRow.isFinal.toUpperCase() === 'Y') {
      booking.finalSalesDate = newDate(currentRow.salesDate);
    }
  }

  return { returnString, warningOccurred, errorOccurred };
};

const validateIgnoreWarning = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccurred = false;

  if (!Object.values(ignoreWarningType).includes(currentRow.ignoreWarning)) {
    returnString += "| ERROR - Ignore Warning must either be 'Y' or blank";
    errorOccurred = true;
  }

  return { returnString, warningOccurred, errorOccurred };
};

const validateHeaders = (workbook) => {
  const actualHeaders = [];
  const row = workbook.getWorksheet(1).getRow(1);
  row.eachCell((cell) => {
    actualHeaders.push(cell.value);
  });

  const headersMatch = expectedHeaders.every((header, index) => header === actualHeaders[index]);
  if (!headersMatch) {
    spreadsheetIssues.spreadsheetFormatIssue = true;
  }
};

// Formats Details Message to place all ERRORS infront of WARNINGS
const formatDetailsMessage = (detailsMessage: string) => {
  const parts = detailsMessage.split('|').map((part) => part.trim());
  const errors = parts.filter((part) => part.startsWith('ERROR -')).join('| ');
  const warnings = parts.filter((part) => part.startsWith('WARNING -')).join(' | ');

  let returnString = '';
  if (errors) returnString += '| ' + errors;
  if (warnings) returnString += '| ' + warnings;

  return returnString;
};

const convertWorkbookToFile = async (workbook, file) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: file[0].file.type });
  const newFile = new File([blob], file[0].file.name, {
    type: file[0].file.type,
  });
  file[0].file = newFile;
};

// Performs checks that can only be done after entire spreadsheet has been parsed
const postValidationChecks = () => {
  for (const venue of spreadsheetData.venues) {
    for (const booking of venue.bookings) {
      if (!booking.finalSalesDate) {
        const errorMessage = '| ERROR - A VenueCode/BookingDate combination must have a specified final sales dates';
        const currentDetailsMessage = booking.bookingFirstRow.getCell(11).value;
        const formattedDetailsMessage = formatDetailsMessage(currentDetailsMessage + errorMessage);

        writeErrorCell(
          booking.bookingFirstRow.getCell(11),
          booking.bookingFirstRow.getCell(10),
          formattedDetailsMessage,
        );
        errorRows.add(booking.bookingFirstRow);
      }

      const validSales = booking.sales.filter((sale) => !isNaN(sale.salesDate.getTime()));
      for (const sale of validSales.sort((a, b) => a.salesDate.getTime() - b.salesDate.getTime())) {
        let detailsColumnMessage = '';
        const warningOccurred = sale.salesRow.getCell(10).value === 'WARNING';
        let errorOccurred = sale.salesRow.getCell(10).value === 'ERROR';

        if (booking.finalSalesDate && booking.finalSalesDate < sale.salesDate) {
          detailsColumnMessage += '| ERROR - Cannot have additional sales after specified Final Sales Date';
          errorOccurred = true;
        }

        if (errorOccurred) errorRows.add(sale.salesRow);
        if (warningOccurred) warningRows.add(sale.salesRow);
        const formattedDetailsMessage = formatDetailsMessage((sale.salesRow.getCell(11).value += detailsColumnMessage));
        updateResponseDetailsCells(sale.salesRow, formattedDetailsMessage, errorOccurred, warningOccurred);
      }

      checkSeatsValueWarnings(validSales, 'General Sales');
      checkSeatsValueWarnings(validSales, 'General Reservations');
      checkSeatsValueWarnings(validSales, 'School Sales');
      checkSeatsValueWarnings(validSales, 'School Reservations');
    }
  }

  const rowNums: number[] = [...mismatchedRows.keys()];
  const rowString = '(Row: ' + rowNums.join(', ') + ')';
  mismatchedRows.forEach((item) => {
    const newErrorMessage = `| ERROR - Mismatch in information for Booking at Venue ${item.venueCode} on ${dateToSimple(
      item.bookingDate.toString(),
    )}, on Sales Date ${dateToSimple(item.salesDate.toString()) + ' ' + rowString}`;
    const currentDetailsMessage = item.row.getCell(11).value;
    const formattedDetailsMessage = formatDetailsMessage(currentDetailsMessage + newErrorMessage);

    updateResponseDetailsCells(item.row, formattedDetailsMessage, true, false);

    errorRows.add(item.row);
  });
};

const checkSeatsValueWarnings = (salesArray, salesType: string) => {
  let previousSale = null;
  for (const sale of salesArray
    .filter((sale) => sale.salesType === salesType)
    .sort((a, b) => a.salesDate.getTime() - b.salesDate.getTime())) {
    let detailsColumnMessage = '';
    let warningOccurred = sale.salesRow.getCell(10).value === 'WARNING';
    const errorOccurred = sale.salesRow.getCell(10).value === 'ERROR';

    if (previousSale) {
      if (sale.seats > previousSale.seats * 1.15) {
        detailsColumnMessage +=
          '| WARNING - Seats increased by more than 15% from previous sale (Row ' + previousSale.rowNumber + ')';
        warningOccurred = true;
      }
      if (sale.seats < previousSale.seats) {
        detailsColumnMessage += '| WARNING - Seats decreased from previous sale (Row ' + previousSale.rowNumber + ')';
        warningOccurred = true;
      }
      if (parseFloat(sale.value) > parseFloat(previousSale.value) * 1.15) {
        detailsColumnMessage +=
          '| WARNING - Value increased by more than 15% from previous sale (Row ' + previousSale.rowNumber + ')';
        warningOccurred = true;
      }
      if (parseFloat(sale.value) < parseFloat(previousSale.value)) {
        detailsColumnMessage += '| WARNING - Value decreased from previous sale (Row ' + previousSale.rowNumber + ')';
        warningOccurred = true;
      }
    }

    if (errorOccurred) errorRows.add(sale.salesRow);
    if (warningOccurred) warningRows.add(sale.salesRow);
    const formattedDetailsMessage = formatDetailsMessage((sale.salesRow.getCell(11).value += detailsColumnMessage));
    updateResponseDetailsCells(sale.salesRow, formattedDetailsMessage, errorOccurred, warningOccurred);

    previousSale = sale;
  }
};

const updateResponseDetailsCells = (row, message, rowErrorOccurred, rowWarningOccurred) => {
  const responseCell = row.getCell(tableColMaps.Response);
  const detailsCell = row.getCell(tableColMaps.Details);

  if (rowErrorOccurred) {
    writeErrorCell(detailsCell, responseCell, message);
  } else if (rowWarningOccurred) {
    const ignoreWarning = (row.getCell(tableColMaps.ignoreWarning).value?.toUpperCase() ?? 'N') === 'Y';
    writeWarningCell(detailsCell, responseCell, message, ignoreWarning);
  } else {
    writeOKCell(detailsCell, responseCell);
  }
};

const writeErrorCell = (detailsCell, responseCell, detailsMessage) => {
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

const writeWarningCell = (detailsCell, responseCell, detailsMessage, ignoreWarning) => {
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

const createSummaryWorksheet = (workbook) => {
  const addSummaryStyling = () => {
    if (errorRows.size > 0 || warningRows.size > 0) {
      summaryWorksheet.getCell('A1').value = 'The uploaded Sales data contained Errors / Warnings -';
      summaryWorksheet.getCell('A1').font = { bold: true, size: 13 };
      summaryWorksheet.getCell('B3').value = 'Rows containing Errors - ';
      summaryWorksheet.getCell('B3').font = { bold: true };
      summaryWorksheet.getCell('D3').value = 'Rows containing Warnings - ';
      summaryWorksheet.getCell('D3').font = { bold: true };
    } else {
      summaryWorksheet.getCell('A1').value = 'There were no Errors / Warnings found in the Sales data.';
      summaryWorksheet.getCell('A1').font = { bold: true, size: 13 };
    }
  };

  let summaryWorksheet = workbook.getWorksheet('Error Summary');

  if (summaryWorksheet) {
    summaryWorksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.value = null;
      });
    });
  } else {
    summaryWorksheet = workbook.addWorksheet('Error Summary');
  }

  addSummaryStyling();

  let errorIndex = 0;
  (errorRows as Set<any>).forEach((row) => {
    const rowNumber = row.number;
    const linkCell = summaryWorksheet.getCell(`B${errorIndex + 4}`);
    linkCell.value = {
      text: `• Link to error in row ${rowNumber} in Sales`,
      hyperlink: `#Sales!J${rowNumber}`,
    };
    linkCell.font = { color: { argb: 'FF0000FF' }, underline: true };
    errorIndex++;
  });
  widenColumn(summaryWorksheet.getColumn(2));

  let warningIndex = 0;
  (warningRows as Set<any>).forEach((row) => {
    const rowNumber = row.number;
    const linkCell = summaryWorksheet.getCell(`D${warningIndex + 4}`);
    linkCell.value = {
      text: `• Link to warning in row ${rowNumber} in Sales`,
      hyperlink: `#Sales!J${rowNumber}`,
    };
    linkCell.font = { color: { argb: 'FF0000FF' }, underline: true };
    warningIndex++;
  });
  widenColumn(summaryWorksheet.getColumn(4));
};

const widenColumn = (column) => {
  let maxLength = 0;
  column.eachCell({ includeEmpty: true }, (cell) => {
    if (cell.value) {
      const cellLength = cell.value.toString().length;
      if (cellLength > maxLength) {
        maxLength = cellLength;
      }
    }
  });
  column.width = maxLength < 10 ? 10 : maxLength + 2;
};

const checkForBlankRow = (currentRow) => {
  const excludedKeys = ['rowNumber', 'details', 'response'];
  const newRow = Object.entries(currentRow).reduce((acc, [key, value]) => {
    if (!excludedKeys.includes(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
  let isBlank = true;
  isBlank = Object.values(newRow).every((value) => {
    if (!value) return true;
    return value?.toString().trim() === '';
  });
  return isBlank;
};

const cleanSpreadsheetData = (data: SpreadsheetData): SpreadsheetDataCleaned => {
  return {
    venues: data.venues.map((venue) => ({
      venueCode: venue.venueCode,
      venueId: null,
      bookings: venue.bookings.map((booking) => ({
        bookingDate: booking.bookingDate.toISOString(),
        finalSalesDate: booking.finalSalesDate,
        bookingId: null,
        sales: booking.sales.reduce((acc: any, sale) => {
          const { salesDate, salesType, seats, value, isFinal } = sale;

          let salesForDate = acc.find((s: any) => s.salesDate.getTime() === salesDate.getTime());
          if (!salesForDate) {
            salesForDate = {
              salesDate,
              isFinal,
              generalSales: null,
              generalReservations: null,
              schoolSales: null,
              schoolReservations: null,
            };
            acc.push(salesForDate);
          }

          switch (salesType) {
            case 'General Sales':
              salesForDate.generalSales = { seats, value };
              break;
            case 'General Reservations':
              salesForDate.generalReservations = { seats, value };
              break;
            case 'School Sales':
              salesForDate.schoolSales = { seats, value };
              break;
            case 'School Reservations':
              salesForDate.schoolReservations = { seats, value };
              break;
          }

          return acc;
        }, []),
      })),
    })),
  };
};

export default validateSpreadsheetFile;
