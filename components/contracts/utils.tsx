const defaultPrice = {
  Premium: { DMPTicketName: 'Premium', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  Concession: { DMPTicketName: 'Concession', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  'Family Tickets(per four)': {
    DMPTicketName: 'Family Tickets(per four)',
    DMPTicketPrice: 0,
    DMPNumTickets: 0,
    DMPDeMoId: 0,
    DMPNotes: '',
  },
  Groups: { DMPTicketName: 'Groups', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  Schools: { DMPTicketName: 'Schools', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
  'Babes in Arms': { DMPTicketName: 'Babes in Arms', DMPTicketPrice: 0, DMPNumTickets: 0, DMPDeMoId: 0, DMPNotes: '' },
};

const techProv = ['Lighting', 'Sound', 'Other', 'Technical Stuff'];

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
  'Technical Stuff': {
    DMTechName: 'Technical Stuff',
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
