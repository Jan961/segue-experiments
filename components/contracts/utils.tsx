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
  // DMCId: null,
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
