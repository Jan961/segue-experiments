import ExcelJS from 'exceljs';
import { VenueMinimalDTO } from 'interfaces';
import { simpleToDateDMY } from 'services/dateService';

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

export const validateSpreadsheetFile = async (file, prodCode, venueList, dateRange) => {
  // file[0].file = new File([], file[0].file.name)
  // note that the check when hitting the ok/upload button uses the selectedfiles list to check for progress and updating the file name here and not there cause issue

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
  };
  let spreadsheetErrorOccured = false;
  let spreadsheetWarningOccured = false;
  console.log(spreadsheetErrorOccured);
  console.log(spreadsheetWarningOccured);
  const productionCodes = [];
  const venueCodes = [];

  workbook.eachSheet((worksheet) => {
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        currentRow.productionCode = row.getCell(1).value as string;
        currentRow.venueCode = row.getCell(2).value as string;
        currentRow.bookingDate = row.getCell(3).value as string;
        currentRow.salesDate = row.getCell(4).value as string;
        currentRow.salesType = row.getCell(5).value as string;
        currentRow.seats = row.getCell(6).value as number;
        currentRow.value = row.getCell(7).value as string;
        currentRow.isFinal = (row.getCell(8).value as string) ?? '';
        currentRow.ignoreWarning = (row.getCell(9).value as string) ?? '';
        currentRow.response = row.getCell(10).value as string;
        currentRow.details = row.getCell(11).value as string;

        const { detailsMessage, rowErrorOccurred, rowWarningOccured } = validateRow(
          currentRow,
          previousRow,
          rowNumber,
          prodCode,
          venueList,
          dateRange,
          productionCodes,
          venueCodes,
        );
        const responseCell = row.getCell(10);

        if (rowErrorOccurred) {
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

          const detailsCell = row.getCell(11);
          detailsCell.value = detailsMessage;

          spreadsheetErrorOccured = true;
        } else if (rowWarningOccured) {
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

          const detailsCell = row.getCell(11);
          detailsCell.value = detailsMessage;

          const ignoreWarningCell = row.getCell(9);
          if (ignoreWarningCell.value !== 'Y') {
            spreadsheetWarningOccured = true;
          }

          spreadsheetWarningOccured = true;
        } else {
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

          const detailsCell = row.getCell(11);
          detailsCell.value = '';
        }

        previousRow = { ...currentRow };
        if (currentRow.productionCode) {
          productionCodes.push(currentRow.productionCode);
        }
        if (currentRow.venueCode) {
          venueCodes.push(currentRow.venueCode);
        }
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: file[0].file.type });

  const newFile = new File([blob], file[0].file.name, {
    type: file[0].file.type,
  });

  file[0].file = newFile;

  return file;
};

const validateRow = (
  currentRow: SpreadsheetRow,
  previousRow: SpreadsheetRow,
  rowNumber,
  prodCode,
  venueList: Record<number, VenueMinimalDTO>,
  dateRange,
  productionCodes: string[],
  _venueCodes: string[],
) => {
  let detailsMessage = '';
  let rowErrorOccurred = false;
  let rowWarningOccured = false;

  const prodValidation = validateProductionCode(currentRow, rowNumber, prodCode, productionCodes);
  detailsMessage += prodValidation.returnString;
  rowErrorOccurred = prodValidation.errorOccurred;

  const venueValidation = validateVenueCode(currentRow, venueList);
  detailsMessage += venueValidation.returnString;
  rowErrorOccurred = venueValidation.errorOccurred;

  const bookingValidation = validateBookingDate(currentRow, dateRange, prodCode);
  detailsMessage += bookingValidation.returnString;
  rowErrorOccurred = bookingValidation.errorOccurred;

  const salesDateValidation = validateSalesDate(currentRow);
  detailsMessage += salesDateValidation.returnString;
  rowErrorOccurred = salesDateValidation.errorOccurred;

  const salesTypeValidation = validateSalesType(currentRow);
  detailsMessage += salesTypeValidation.returnString;
  rowErrorOccurred = salesTypeValidation.errorOccurred;

  const seatsValidation = validateSeats(currentRow, previousRow);
  detailsMessage += seatsValidation.returnString;
  rowWarningOccured = seatsValidation.warningOccured;
  rowErrorOccurred = seatsValidation.errorOccurred;

  const valueValidation = validateValue(currentRow, previousRow);
  detailsMessage += valueValidation.returnString;
  rowWarningOccured = valueValidation.warningOccured;

  const finalValidation = validateIsFinal(currentRow);
  detailsMessage += finalValidation.returnString;
  rowErrorOccurred = finalValidation.errorOccurred;

  const ignoreWarningValidation = validateIgnoreWarning(currentRow);
  detailsMessage += ignoreWarningValidation.returnString;
  rowErrorOccurred = ignoreWarningValidation.errorOccurred;

  return { detailsMessage, rowErrorOccurred, rowWarningOccured };
};

const validateProductionCode = (currentRow: SpreadsheetRow, rowNumber, prodCode, productionCodes: string[]) => {
  let returnString = '';
  let errorOccurred = false;
  if (rowNumber === 2 && !currentRow.productionCode) {
    returnString += '| ERROR - Must include at least 1 ProdCode at start of file';
    errorOccurred = true;
  }
  if (currentRow.productionCode && currentRow.productionCode !== prodCode) {
    returnString += '| ERROR - ProdCode does not match selected production (' + prodCode + ')';
    errorOccurred = true;
  }
  if (productionCodes.includes(currentRow.productionCode)) {
    returnString += '| ERROR - Spreadsheet should only represent sales for one production';
  }
  return { returnString, errorOccurred };
};

const validateVenueCode = (currentRow: SpreadsheetRow, venueList: Record<number, VenueMinimalDTO>) => {
  let returnString = '';
  let errorOccurred = false;
  if (currentRow.productionCode && !currentRow.venueCode) {
    returnString += '| ERROR - must include at least one venue code for a given production';
    errorOccurred = true;
  }
  if (currentRow.venueCode && !Object.values(venueList).some((venue) => venue.Code === currentRow.venueCode)) {
    returnString += '| ERROR - Venue Code ' + currentRow.venueCode + ' not found';
    errorOccurred = true;
  }

  return { returnString, errorOccurred };
};

const validateBookingDate = (currentRow: SpreadsheetRow, dateRange, prodCode) => {
  let returnString = '';
  let errorOccurred = false;

  const productionDates = dateRange.split('-');
  const prodStartDate = simpleToDateDMY(productionDates[0]);
  const prodEndDate = simpleToDateDMY(productionDates[1]);
  const rowDate = new Date(currentRow.bookingDate);

  if (!currentRow.bookingDate && currentRow.venueCode) {
    returnString += '| ERROR - Must specify a Booking Date for a new Venue Code';
    errorOccurred = true;
    return { returnString, errorOccurred };
  }

  if (currentRow.bookingDate && isNaN(rowDate.getTime())) {
    returnString += '| ERROR - Booking Date is not valid. Please use DD/MM/YYYY format';
    errorOccurred = true;
    return { returnString, errorOccurred };
  }

  if ((rowDate < prodStartDate || rowDate > prodEndDate) && currentRow.bookingDate) {
    returnString += '| ERROR - Booking Date is outside range of ' + prodCode + ' start/end date';
    errorOccurred = true;
  }

  return { returnString, errorOccurred };
};

const validateSalesDate = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const rowDate = new Date(currentRow.salesDate);

  if (!currentRow.salesDate) {
    returnString += '| ERROR - Must include a date for the sale';
    errorOccurred = true;
    return { returnString, errorOccurred };
  }

  if (currentRow.salesDate && isNaN(rowDate.getTime())) {
    returnString += '| ERROR - Sales Date is not valid. Please use DD/MM/YYYY format';
    errorOccurred = true;
    return { returnString, errorOccurred };
  }

  return { returnString, errorOccurred };
};

const validateSalesType = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;

  if (!Object.values(SalesType).includes(currentRow.salesType)) {
    returnString +=
      "| ERROR - Sales type must be either 'General Sales', 'General Reservations', 'School Sales', 'School Reservations'";
    errorOccurred = true;
  }

  return { returnString, errorOccurred };
};

const validateSeats = (currentRow: SpreadsheetRow, previousRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  let warningOccured = false;

  if (!currentRow.seats) {
    returnString += '| ERROR - Must specify a value for Seats';
    errorOccurred = true;
    return { returnString, errorOccurred, warningOccured };
  }

  if (previousRow.seats && !currentRow.venueCode) {
    if (currentRow.seats >= previousRow.seats * 1.15) {
      returnString += '| WARNING - Seats increased by more than 15%';
      if (currentRow.ignoreWarning.toUpperCase() !== 'Y') warningOccured = true;
    }
    if (currentRow.seats < previousRow.seats) {
      returnString += '| WARNING - Seats decreased from previous entry';
      if (currentRow.ignoreWarning.toUpperCase() !== 'Y') warningOccured = true;
    }
  }

  return { returnString, warningOccured };
};

const validateValue = (currentRow: SpreadsheetRow, previousRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = true;
  let warningOccured = false;

  if (!currentRow.value) {
    returnString += '| ERROR - Must specify a value for Value';
    errorOccurred = true;
    return { returnString, errorOccurred, warningOccured };
  }

  if (previousRow.value && !currentRow.venueCode) {
    if (parseFloat(currentRow.value) >= parseFloat(previousRow.value) * 1.15) {
      returnString += '| WARNING - Value increased by more than 15%';
      if (currentRow.ignoreWarning.toUpperCase() !== 'Y') warningOccured = true;
    }
    if (parseFloat(currentRow.value) < parseFloat(previousRow.value)) {
      returnString += '| WARNING - Value decreased from previous entry';
      if (currentRow.ignoreWarning.toUpperCase() !== 'Y') warningOccured = true;
    }
  }

  return { returnString, warningOccured };
};

const validateIsFinal = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;

  if (!Object.values(isFinalType).includes(currentRow.isFinal)) {
    returnString += "| ERROR - Is Final must either be 'Y', 'N', or blank";
    errorOccurred = true;
  }

  return { returnString, errorOccurred };
};

const validateIgnoreWarning = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;

  if (!Object.values(ignoreWarningType).includes(currentRow.ignoreWarning)) {
    returnString += "| ERROR - Ignore Warning must either be 'Y', 'N', or blank";
    errorOccurred = true;
  }

  return { returnString, errorOccurred };
};

export default validateSpreadsheetFile;
