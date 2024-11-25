import { Time } from 'components/core-ui-lib/TimeInput/TimeInput';
import { startOfDay } from 'date-fns';
import { pick } from 'radash';
import { getShortWeekFormat, newDate, simpleToDate } from 'services/dateService';
import { formatDecimalValue, isNullOrEmpty, isNullOrUndefined, isUndefined } from 'utils';
import { PriceState } from './modal/EditDealMemoContractModal';
import { UTCDate } from '@date-fns/utc';

export const defaultPrice = [
  { DMPTicketName: 'Premium', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  { DMPTicketName: 'Concession', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  {
    DMPTicketName: 'Family Tickets (per four)',
    DMPTicketPrice: 0,
    DMPNumTickets: 0,
    DMPDeMoId: 0,
    DMPNotes: '',
  },
  { DMPTicketName: 'Groups', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  { DMPTicketName: 'Schools', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  { DMPTicketName: 'Babes in Arms', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
];

export const defaultCustomPrice = {
  DMPTicketName: '',
  DMPTicketPrice: 0,
  DMPNumTickets: 0,
  DMPDeMoId: 0,
  DMPNotes: '',
};

export const defaultTechProvision = [
  {
    DMTechName: 'Lighting',
    DMTechVenue: '',
    DMTechCompany: '',
  },
  {
    DMTechName: 'Sound',
    DMTechVenue: '',
    DMTechCompany: '',
  },
  {
    DMTechName: 'Other',
    DMTechVenue: '',
    DMTechCompany: '',
  },
  {
    DMTechName: 'Technical Staff',
    DMTechVenue: '',
    DMTechCompany: '',
  },
];

export const defaultDemoCall = {
  DMCDeMoId: null,
  DMCCallNum: 0,
  DMCPromoterOrVenue: '',
  DMCType: '',
  DMCValue: null,
};

export const filterPrice = (dealMemoPrice: any): PriceState => {
  if (isUndefined(dealMemoPrice) || dealMemoPrice.length === 0) {
    return { custom: [defaultCustomPrice], default: defaultPrice };
  } else {
    const customPriceList = [];
    const defaultPriceList = [];

    dealMemoPrice.forEach((price) => {
      const defPriceIndex = defaultPrice.findIndex((defPrice) => defPrice.DMPTicketName === price.DMPTicketName);
      if (defPriceIndex === -1) {
        customPriceList.push({
          ...price,
          DMPTicketPrice: price.DMPTicketPrice !== '0' ? formatDecimalValue(price.DMPTicketPrice) : '',
        });
      } else {
        defaultPriceList.push({
          ...price,
          DMPTicketPrice: price.DMPTicketPrice !== '0' ? formatDecimalValue(price.DMPTicketPrice) : '',
        });
      }
    });

    return { custom: customPriceList.length === 0 ? [defaultCustomPrice] : customPriceList, default: defaultPriceList };
  }
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

export const parseAndSortDates = (arr: string[]): Array<string> => {
  // if input array length is false, return emptry array
  if (arr.length === 0) {
    return [];
  }

  // if the entry has a time pre-pended - remove this and use the datetime in JS date format
  const parsedEntries = arr.map((show) => {
    const [time, date] = show.split('? ');
    return { time, date: newDate(date) };
  });

  // Sort dates in ascending order
  parsedEntries.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Group by date and format as object - e.g. {dd-mm-yy: {dt: js date, times: [array of times in hh:mm]}}
  const groupedByDate: { [key: number]: string[] } = parsedEntries.reduce(
    (acc, entry) => {
      const dateKey = startOfDay(entry.date).getTime();
      acc[dateKey] = acc[dateKey] || [];

      acc[dateKey].push(entry.time === '' ? 'TBC' : entry.time);
      return acc;
    },
    {} as { [key: number]: string[] },
  );

  // Process groupedByDate to format for UI
  const dayArray: string[] = [];
  Object.entries(groupedByDate).forEach(([dateKey, times]) => {
    const epochTime = parseInt(dateKey);
    const date = newDate(epochTime);
    dayArray.push(`${getShortWeekFormat(date)} ${simpleToDate(date.toISOString())} ${times.join('; ')}`);
  });

  return dayArray;
};

export const dtToTime = (datetime: UTCDate): Time => {
  if (datetime === null) {
    return null;
  }

  return {
    hrs: datetime.getHours().toString(),
    min: datetime.getMinutes().toString(),
    sec: datetime.getSeconds().toString(),
  };
};

export const timeToDateTime = (inputTime: Time | string): UTCDate => {
  if (isNullOrEmpty(inputTime)) {
    return null;
  }

  let time: Time = {};

  if (typeof inputTime === 'string') {
    const timeSplit = inputTime.split(':');
    time = { hrs: timeSplit[0], min: timeSplit[1] };
  } else {
    time = inputTime;
  }

  const datetime = newDate();
  datetime.setHours(parseInt(time.hrs), parseInt(time.min), 0);

  return datetime;
};

export const formatDecimalFields = (dealMemoData: any, type: string) => {
  const costObj = pick(dealMemoData, [
    'GuaranteeAmount',
    'VenueRental',
    'StaffingContra',
    'AgreedContraItems',
    'RestorationLevy',
    'BookingFees',
    'TxnChargeAmount',
    'LocalMarketingBudget',
    'LocalMarketingContra',
    'SellPitchFee',
    'AdvancePaymentAmount',
    'ROTTPercentage',
  ]);

  Object.entries(costObj).forEach(([key, value]) => {
    costObj[key] = type === 'string' ? formatDecimalValue(value) : parseFloat(value);
  });

  return costObj;
};

export const formatValue = (value: any) => {
  if (isNullOrEmpty(value)) {
    return '';
  } else if (value === '0') {
    return '';
  } else {
    return value;
  }
};

export const formatSeatKillValues = (dmHoldData: any, dmTypes: any) => {
  // if dmHoldData is undefined - initialise object with zeros and the hold type ids
  if (isNullOrUndefined(dmHoldData)) {
    const emptyDmHolds = [];
    dmTypes.forEach((dmType) => {
      emptyDmHolds.push({
        DMHoldHoldTypeId: dmType.HoldTypeId,
        DMHoldSeats: 0,
        DMHoldValue: 0,
      });
    });
    return emptyDmHolds;
  } else {
    return dmHoldData.map((hold) => ({
      ...hold,
      DMHoldValue: formatValue(hold.DMHoldValue) === '' ? '' : formatDecimalValue(hold.DMHoldValue),
    }));
  }
};

export const formatAddress = (...fields: (string | null)[]): string => {
  return fields.filter((field) => !isNullOrEmpty(field)).join(', ');
};
