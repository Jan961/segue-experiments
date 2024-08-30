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
      // finalSaleEntry: {
      //   hasIsFinalOccured: boolean;
      //   finalSalesDate: Date;
      // }
      sales: {
        salesDate: Date;
        salesType: string;
        seats: number;
        value: string;
        isFinal: string;
        ignoreWarning: string;
        rowNumber: number;
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

export const validateSpreadsheetFile = async (file, prodCode, venueList, prodDateRange) => {
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
  let spreadsheetErrorOccured = false;
  let spreadsheetWarningOccured = false;
  const spreadsheetData: SpreadsheetData = {
    venues: [],
  };
  // let currentProduction = '';
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

          if (currentRow.ignoreWarning.toLocaleUpperCase() !== 'Y') spreadsheetWarningOccured = true; // don't raise a warning when ignore flag
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
      }
    });
  });

  console.log(spreadsheetData);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: file[0].file.type });
  const newFile = new File([blob], file[0].file.name, {
    type: file[0].file.type,
  });
  file[0].file = newFile;

  return { file, spreadsheetErrorOccured, spreadsheetWarningOccured };
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
) => {
  const validations = [
    validateProductionCode(currentRow, prodCode),
    validateVenueCode(currentRow, venueList),
    validateBookingDate(currentRow, prodDateRange, prodCode),
    validateSalesDate(currentRow),
    validateSalesType(currentRow),
    validateSeats(currentRow, previousRow),
    validateValue(currentRow, previousRow),
    validateIsFinal(currentRow),
    validateIgnoreWarning(currentRow),
  ];

  let detailsMessage = '';
  let rowErrorOccurred = false;
  let rowWarningOccured = false;

  validations.forEach((validation) => {
    detailsMessage += validation.returnString;
    if (validation.errorOccurred) rowErrorOccurred = true;
    if (validation.warningOccured) rowWarningOccured = true;
  });

  const { returnString, errorOccurred, warningOccured } = updateValidateSpreadsheedData(
    spreadsheetData,
    currentRow,
    currentVenue,
    currentBookingDate,
  );
  detailsMessage += returnString;
  if (errorOccurred) rowErrorOccurred = true;
  if (warningOccured) rowWarningOccured = true;

  return { detailsMessage, rowErrorOccurred, rowWarningOccured };
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
      warningOccured = true;
    }
    if (currentRow.seats < previousRow.seats) {
      returnString += '| WARNING - Seats decreased from previous entry';
      warningOccured = true;
    }
  }

  return { returnString, warningOccured, errorOccurred };
};

const validateValue = (currentRow: SpreadsheetRow, previousRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  let warningOccured = false;

  if (!currentRow.value) {
    returnString += '| ERROR - Must specify a value for Value';
    errorOccurred = true;
    return { returnString, errorOccurred, warningOccured };
  }

  if (previousRow.value && !currentRow.venueCode) {
    if (parseFloat(currentRow.value) >= parseFloat(previousRow.value) * 1.15) {
      returnString += '| WARNING - Value increased by more than 15%';
      warningOccured = true;
    }
    if (parseFloat(currentRow.value) < parseFloat(previousRow.value)) {
      returnString += '| WARNING - Value decreased from previous entry';
      warningOccured = true;
    }
  }

  return { returnString, warningOccured, errorOccurred };
};

const validateIsFinal = (currentRow: SpreadsheetRow) => {
  let returnString = '';
  let errorOccurred = false;
  const warningOccured = false;

  if (!Object.values(isFinalType).includes(currentRow.isFinal)) {
    returnString += "| ERROR - Is Final must either be 'Y', 'N', or blank";
    errorOccurred = true;
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

// Update SpreadsheetData var with the new row data and return any Warnings/Errors raised in the process
const updateValidateSpreadsheedData = (
  spreadsheetData: SpreadsheetData,
  currentRow: SpreadsheetRow,
  currentVenue: string,
  currentBookingDate: string,
) => {
  let returnString = '';
  const warningOccured = false;
  let errorOccurred = false;

  const venue = spreadsheetData.venues.find((v) => v.venueCode === currentVenue);

  if (venue) {
    // if VenueCode has already been entered in Spreadsheet previously
    const booking = venue.bookings.find((b) => b.bookingDate.getTime() === new Date(currentBookingDate).getTime());

    if (booking) {
      // if VenueCode/BookingDate has already been entered in Spreadsheet previously
      const sale = booking.sales.find((s) => s.salesDate.getTime() === new Date(currentRow.salesDate).getTime());

      if (sale) {
        // if VenueCode/BookingDate/SalesDate has already been entered in Spreadsheet previously
        if (
          sale.seats !== currentRow.seats ||
          sale.value !== currentRow.value ||
          sale.salesType !== currentRow.salesType ||
          sale.isFinal.toUpperCase() !== currentRow.isFinal.toUpperCase() ||
          sale.ignoreWarning.toUpperCase() !== currentRow.ignoreWarning.toUpperCase()
        ) {
          // if any of the values do not match up between duplicate VenueCode/BookingDate/SalesDate entries
          returnString += `| ERROR - Mismatch in information for Booking at Venue ${currentVenue} on ${dateToSimple(
            currentBookingDate,
          )}, on Sales Date ${dateToSimple(currentRow.salesDate)}. (Row ${sale.rowNumber})`;
          errorOccurred = true;
        }
      } else {
        booking.sales.push({
          salesDate: new Date(currentRow.salesDate),
          salesType: currentRow.salesType,
          seats: currentRow.seats,
          value: currentRow.value,
          isFinal: currentRow.isFinal,
          ignoreWarning: currentRow.ignoreWarning,
          rowNumber: currentRow.rowNumber,
        });
      }
    } else {
      venue.bookings.push({
        bookingDate: new Date(currentRow.bookingDate),
        sales: [
          {
            salesDate: new Date(currentRow.salesDate),
            salesType: currentRow.salesType,
            seats: currentRow.seats,
            value: currentRow.value,
            isFinal: currentRow.isFinal,
            ignoreWarning: currentRow.ignoreWarning,
            rowNumber: currentRow.rowNumber,
          },
        ],
      });
    }
  } else {
    spreadsheetData.venues.push({
      venueCode: currentRow.venueCode,
      bookings: [
        {
          bookingDate: new Date(currentRow.bookingDate),
          sales: [
            {
              salesDate: new Date(currentRow.salesDate),
              salesType: currentRow.salesType,
              seats: currentRow.seats,
              value: currentRow.value,
              isFinal: currentRow.isFinal,
              ignoreWarning: currentRow.ignoreWarning,
              rowNumber: currentRow.rowNumber,
            },
          ],
        },
      ],
    });
  }

  return { returnString, warningOccured, errorOccurred };
};

export default validateSpreadsheetFile;
