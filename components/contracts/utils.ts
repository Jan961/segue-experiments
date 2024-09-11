import { startOfDay } from 'date-fns';
import { getShortWeekFormat, getTimeFromDateAndTime } from 'services/dateService';
import { formatDecimalValue } from 'utils';
import formatInputDate from 'utils/dateInputFormat';

const defaultPrice = {
  Premium: { DMPTicketName: 'Premium', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  Concession: { DMPTicketName: 'Concession', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  'Family Tickets (per four)': {
    DMPTicketName: 'Family Tickets (per four)',
    DMPTicketPrice: 0,
    DMPNumTickets: 0,
    DMPDeMoId: 0,
    DMPNotes: '',
  },
  Groups: { DMPTicketName: 'Groups', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  Schools: { DMPTicketName: 'Schools', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  'Babes in Arms': { DMPTicketName: 'Babes in Arms', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
};

const techProv = ['Lighting', 'Sound', 'Other', 'Technical Staff'];

export const defaultTechProvision = {
  Lighting: {
    DMTechName: 'Lighting',
    DMTechVenue: '',
    DMTechCompany: '',
  },
  Sound: {
    DMTechName: 'Sound',
    DMTechVenue: '',
    DMTechCompany: '',
  },
  Other: {
    DMTechName: 'Other',
    DMTechVenue: '',
    DMTechCompany: '',
  },
  'Technical Staff': {
    DMTechName: 'Technical Staff',
    DMTechVenue: '',
    DMTechCompany: '',
  },
};
export const defaultDemoCall = {
  DMCDeMoId: null,
  DMCCallNum: 0,
  DMCPromoterOrVenue: '',
  DMCType: '',
  DMCValue: null,
};

export const filterPrice = (dealMemoPrice) => {
  if (!dealMemoPrice) return [defaultPrice, []];
  if (dealMemoPrice.length === 0) return [defaultPrice, []];
  const customePriceList = [];
  dealMemoPrice.forEach((price) => {
    if (defaultPrice[price.DMPTicketName]) {
      defaultPrice[price.DMPTicketName] = {
        DMPTicketName: price.DMPTicketName,
        DMPTicketPrice: formatDecimalValue(price.DMPTicketPrice),
        DMPNumTickets: price.DMPNumTickets,
        DMPId: price.DMPId,
        DMPDeMoId: price.DMPDeMoId,
      };
    } else {
      customePriceList.push(price);
    }
  });
  return [defaultPrice, customePriceList];
};

export const filterTechProvision = (techProvision) => {
  const techData = [];
  techProv.forEach((tech, index) => {
    if (techProvision.length > 0 && techProvision[index].DMTechName === tech) {
      techData.push(techProvision[index]);
    } else {
      techData.push(defaultTechProvision[tech]);
    }
  });
  return techData;
};

export const filterHoldTypeData = (dealHoldType, dealMemoHoldData) => {
  const dealHoldObj = {};
  if (dealMemoHoldData && dealMemoHoldData.length > 0) {
    dealMemoHoldData.forEach((hold) => {
      dealHoldObj[hold.DMHoldHoldTypeId] = hold;
    });
  }
  const holdTypeTableData = dealHoldType.map((holdData) => {
    if (dealHoldObj[holdData.HoldTypeId]) {
      const decimalPrice = formatDecimalValue(dealHoldObj[holdData.HoldTypeId].DMHoldValue);
      holdData.value = decimalPrice === '0.00' ? '' : decimalPrice;
      holdData.seats = dealHoldObj[holdData.HoldTypeId].DMHoldSeats;
      holdData.DMHoldDeMoId = holdData.HoldTypeId;
    } else {
      holdData.value = '';
      holdData.seats = '';
    }
    holdData.type = holdData.HoldTypeName;
    return holdData;
  });

  return holdTypeTableData;
};

export const filterPercentage = (num: number) => {
  if ((num >= 0 && num < 100) || Number.isNaN(num)) {
    return Math.floor(num * 100) / 100;
  }
  return 100;
};

export const formatDecimalOnBlur = (event: any) => {
  const value = event.target.value;
  return formatDecimalValue(value);
};

export const filterCurrencyNum = (num: number) => {
  return Math.floor(num * 100) / 100;
};

export const disabledDemo = (key) => {
  if (key === 1) {
    return false;
  }
  return true;
};

export const seatKillsData = [
  { type: 'Promoter', seats: '', value: '' },
  { type: 'Press', seats: '', value: '' },
  { type: 'Mixer', seats: '', value: '' },
  { type: 'Off Sale', seats: '', value: '' },
  { type: 'Wheelchair Spaces', seats: '', value: '' },
  { type: 'Companion Seats', seats: '', value: '' },
  { type: 'Restricted View Seats', seats: '', value: '' },
  { type: 'Staff', seats: '', value: '' },
  { type: 'Other', seats: '', value: '' },
  { type: 'Venue', seats: '', value: '' },
  { type: 'Technical', seats: '', value: '' },
  { type: 'House Management', seats: '', value: '' },
  { type: 'Cast/Crew', seats: '', value: '' },
];

export const addNewPersonInputData = [
  {
    first: 'First Name',
    second: 'Email Address',
    type: 'textInput',
    dataFieldFirst: 'PersonFirstName',
    dataFieldSecond: 'PersonEmail',
  },
  {
    first: 'Last Name',
    second: 'Landline Number',
    type: 'textInput',
    dataFieldFirst: 'PersonLastName',
    dataFieldSecond: 'PersonPhone',
  },
  {
    first: 'Address',
    second: 'Mobile Number',
    type: 'textInput',
    dataFieldFirst: 'Address1',
    dataFieldSecond: 'PersonMobile',
  },
  {
    first: ' ',
    second: 'Full Name as it appears on Passport',
    type: 'textInput',
    dataFieldFirst: 'Address2',
    dataFieldSecond: 'PersonPassportName',
  },
  {
    first: ' ',
    second: 'Passport Number',
    type: 'textInput',
    dataFieldFirst: 'Address3',
    dataFieldSecond: 'passportNumber',
  },
];

export const emergecnyContactData = [
  { first: 'First Name', second: 'First Name', type: 'textInput' },
  { first: 'Last Name', second: 'Last Name', type: 'textInput' },
  { first: 'Address', second: 'Address', type: 'textInput' },
  { first: ' ', second: ' ', type: 'textInput' },
  { first: ' ', second: ' ', type: 'textInput' },
  { first: 'Town', second: 'Town', type: 'textInput' },
  { first: 'Postcode', second: 'Postcode', type: 'textInput' },
  { first: 'Country', second: 'Country', type: 'select' },
  { first: 'Email Address', second: 'Email Address', type: 'textInput' },
  { first: 'Landline Number', second: 'Landline Number', type: 'textInput' },
  { first: 'Mobile Number', second: 'Mobile Number', type: 'textInput' },
];

export const agencyDetailsData = [
  { first: 'Agent First Name', second: 'Email Address', type: 'textInput' },
  { first: 'Agent Last Name', second: 'Landline Number', type: 'textInput' },
  { first: 'Address', second: 'Address', type: 'textInput' },
  { first: 'Agency Name', second: 'Mobile Number', type: 'textInput' },
  { first: 'Address', second: 'Agency Website', type: 'textInput' },
  { first: ' ', type: 'textInput' },
  { first: ' ', type: 'textInput' },
  { first: 'Town', type: 'select' },
  { first: 'Postcode', type: 'textInput' },
  { first: 'Country', type: 'select' },
];

export const salaryDetailsData = [
  { first: 'Bank Account Name', second: 'Bank Account Name', type: 'textInput' },
  { first: 'Sort Code', second: 'Sort Code', type: 'textInput' },
  { first: 'Account Number', second: 'Account Number', type: 'textInput' },
  { first: 'SWIFT (if applicable)', second: 'SWIFT (if applicable)', type: 'textInput' },
  { first: 'IBAN (if applicable)', second: 'IBAN (if applicable)', type: 'textInput' },
  { first: 'Country', second: 'Country', type: 'select' },
];

export const parseAndSortDates = (arr: string[]): { showArray: Array<string>; maxWidth: number } => {
  // if the entry has a time pre-pended - remove this and use the datetime in JS date format
  const parsedEntries = arr.map((show) => {
    return show.includes('?') ? new Date(show.split('? ')[1]) : new Date(show);
  });

  // Sort dates in ascending order
  parsedEntries.sort((a, b) => a.getTime() - b.getTime());

  // Group by date and format as object - e.g. {dd-mm-yy: {dt: js date, times: [array of times in hh:mm]}}
  const groupedByDate: { [key: number]: string[] } = parsedEntries.reduce(
    (acc, entry) => {
      const dateKey = startOfDay(entry).getTime();
      acc[dateKey] = acc[dateKey] || [];
      acc[dateKey].push(getTimeFromDateAndTime(entry));
      return acc;
    },
    {} as { [key: number]: string[] },
  );

  // Process groupedByDate to format for UI
  const dayArray: string[] = [];
  Object.entries(groupedByDate).forEach(([dateKey, times]) => {
    const epochTime = parseInt(dateKey);
    const date = new Date(epochTime);
    dayArray.push(`${getShortWeekFormat(date)} ${formatInputDate(date)} ${times.join('; ')}`);
  });

  // Join and return as a break line delimited string
  return { showArray: dayArray, maxWidth: Math.max(...dayArray.map((line) => line.length)) };
};

export const checkDecimalStringFormat = (decimalString, precision, scale) => {
  const [integerPart, fractionalPart] = decimalString.split('.');
  if (integerPart.length > precision - scale || (fractionalPart && fractionalPart.length > scale)) return false;
  return true;
};
