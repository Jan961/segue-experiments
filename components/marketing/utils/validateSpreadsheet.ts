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
    seats: 0,
    value: '',
    isFinal: '',
    ignoreWarning: '',
    response: '',
    details: '',
  };
  const previousRow: SpreadsheetRow = {
    productionCode: '',
    venueCode: '',
    bookingDate: '',
    salesDate: '',
    salesType: '',
    seats: 0,
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

  workbook.eachSheet((worksheet) => {
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        currentRow.productionCode = row.getCell(1).value as string;
        if (currentRow.productionCode) {
          const currentProductionCode = currentRow.productionCode;
          console.log(currentProductionCode);
        }
        currentRow.venueCode = row.getCell(2).value as string;
        if (currentRow.venueCode) {
          const currentVenueCode = currentRow.venueCode;
          console.log(currentVenueCode);
        }
        currentRow.bookingDate = row.getCell(3).value as string;
        currentRow.salesDate = row.getCell(4).value as string;
        currentRow.salesType = row.getCell(5).value as string;
        currentRow.seats = row.getCell(6).value as number;
        currentRow.value = row.getCell(7).value as string;
        currentRow.isFinal = row.getCell(8).value as string;
        currentRow.ignoreWarning = row.getCell(9).value as string;
        currentRow.response = row.getCell(10).value as string;
        currentRow.details = row.getCell(11).value as string;

        const { detailsMessage, rowErrorOccurred, rowWarningOccured } = validateRow(
          currentRow,
          previousRow,
          rowNumber,
          prodCode,
          venueList,
          dateRange,
        );
        const responseCell = row.getCell(10);

        if (rowErrorOccurred) {
          responseCell.value = 'ERROR';

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
        } else {
          responseCell.value = 'OK';

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
) => {
  let detailsMessage = '';
  let rowErrorOccurred = false;
  const rowWarningOccured = false;

  const prodValidation = validateProductionCode(currentRow, rowNumber, prodCode);
  detailsMessage += prodValidation.returnString;
  if (prodValidation.errorOccurred) rowErrorOccurred = true;

  const venueValidation = validateVenueCode(currentRow, venueList);
  detailsMessage += venueValidation.returnString;
  if (venueValidation.errorOccurred) rowErrorOccurred = true;

  const bookingValidation = validateBookingDate(currentRow, dateRange, prodCode);
  detailsMessage += bookingValidation.returnString;
  if (bookingValidation.errorOccurred) rowErrorOccurred = true;

  return { detailsMessage, rowErrorOccurred, rowWarningOccured };
};

const validateProductionCode = (currentRow: SpreadsheetRow, rowNumber, prodCode) => {
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

  if ((rowDate < prodStartDate || rowDate > prodEndDate) && currentRow.bookingDate) {
    returnString += '| ERROR - Booking Date is outside range of ' + prodCode + ' start/end date';
    errorOccurred = true;
  }

  return { returnString, errorOccurred };
};

export default validateSpreadsheetFile;
