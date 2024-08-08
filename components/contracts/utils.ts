import { nanoid } from 'nanoid';
import { DateTimeEntry } from 'types/ContractTypes';

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
        DMPTicketPrice: price.DMPTicketPrice,
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
      holdData.value = dealHoldObj[holdData.HoldTypeId].DMHoldValue;
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
  { first: 'First Name', second: 'Email Address', type: 'textInput' },
  { first: 'Last Name', second: 'Landline Number', type: 'textInput' },
  { first: 'Address', second: 'Mobile Number', type: 'textInput' },
  { first: ' ', second: 'Full Name as it appears on Passport', type: 'textInput' },
  { first: ' ', second: 'Passport Number', type: 'select' },
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

// Expect string to come in format "HH:MM? YYYY-MM-DD" - where HH:MM may not be included
export const parseAndSortDates = (arr: string[]): DateTimeEntry[] => {
  const parsedEntries = arr.map((str) => {
    const [timePart, isoDatePart] = str.split('? ');
    return { timePart: timePart.trim(), date: new Date(isoDatePart.trim()) };
  });

  parsedEntries.sort((a, b) => a.date.getTime() - b.date.getTime());

  const groupedByDate = parsedEntries.reduce(
    (acc, entry) => {
      const dateKey = entry.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(entry.timePart);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const result = Object.entries(groupedByDate).map(([date, times]) => {
    const formattedDate = `${date} ${times.join(' ')}`;
    return { formattedDate, id: nanoid() };
  });

  return result;
};

export const checkDecimalStringFormat = (decimalString, precision, scale) => {
  const [integerPart, fractionalPart] = decimalString.split('.');
  if (integerPart.length > precision - scale || (fractionalPart && fractionalPart.length > scale)) return false;
  return true;
};
