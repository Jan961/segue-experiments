export interface SpreadsheetRow {
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

export interface SpreadsheetData {
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

export enum SalesType {
  'General Sales',
  'General Reservations',
  'School Sales',
  'School Reservations',
}

export enum isFinalType {
  'Y',
  'y',
  'N',
  'n',
  '',
}

export enum ignoreWarningType {
  'Y',
  'y',
  'N',
  'n',
  '',
}

export interface SpreadsheetIssues {
  spreadsheetErrorOccurred: boolean;
  spreadsheetWarningOccurred: boolean;
  spreadsheetFormatIssue: boolean;
}

export const tableColMaps = {
  ProdCode: 1,
  VenueCode: 2,
  BookingDate: 3,
  SalesDate: 4,
  SalesType: 5,
  Seats: 6,
  Value: 7,
  isFinal: 8,
  ignoreWarning: 9,
  Response: 10,
  Details: 11,
};

export const expectedHeaders = [
  'Production Code',
  'Venue Code',
  'Booking Date',
  'Sales Date',
  'Sales Type',
  'Seats',
  'Value',
  'Is Final',
  'Ignore Warning',
  'Response',
  'Details',
];

export interface UploadParamType {
  onProgress: (file: File, uploadProgress: number) => void;
  onError: (file: File, errorMessage: string) => void;
  onUploadingImage: (file: File, imageUrl: string) => void;
  spreadsheetIssues: SpreadsheetIssues;
}
