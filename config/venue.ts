export const dummyVenueContractData = [
  {
    VenueRole: 'Enter Job title',
    VenueFirstName: 'Enter First Name',
    VenueLastName: 'Enter Last Name',
    VenuePhone: 'Enter Phone No.',
    VenueEmail: 'Enter Email Address',
    delete: true,
  },
  {
    VenueRole: 'Box Office Default',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Box Office Manager',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Finance Manager',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Front of House Manager',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Marketing Contact',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Marketing Manager',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Operations Manager',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Stage Door',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Technical Manager',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Venue Chief LX',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Venue Head of Sound',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Venue Manager',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Venue Programming',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  {
    VenueRole: 'Venue Stage Manager',
    VenueFirstName: 'First Name',
    VenueLastName: 'Last Name',
    VenuePhone: '(00) 0000 000000',
    VenueEmail: 'name@theatrecompany.com',
    delete: false,
  },
  // Add more dummy data as needed
];

export const barredVenuesData = [
  {
    venueOptions: 'test',
  },
  {
    venueOptions: 'test-2',
  },
  // Add more dummy data as needed
];

export const initialMainVenueDetails = {
  venueCode: '',
  venueStatus: '',
  venueName: '',
  vatIndicator: false,
  culturallyExempt: false,
  venueFamily: null,
  currency: '',
  venueCapacity: null,
  townPopulation: null,
  venueWebsite: '',
  notes: '',
  excludeFromChecks: false,
};

export const initialVenueAddressDetails = {
  deliveryCountry: null,
  deliveryPostCode: '',
  deliveryTown: '',
  deliveryAddress3: '',
  deliveryAddress2: '',
  deliveryAddress1: '',
  deliveryEMail: '',
  deliveryPhoneNumber: '',

  primaryCountry: null,
  primaryPostCode: '',
  primaryTown: '',
  primaryAddress3: '',
  primaryAddress2: '',
  primaryAddress1: '',
  primaryPhoneNumber: '',
  primaryEMail: '',
  what3WordsStage: '',
  what3WordsLoading: '',
  what3WordsEntrance: '',
  primaryCoordinates: { latitude: null, longitude: null },
};

export const initialVenueBarringRules = {
  barringMiles: null,
  postShow: null,
  preShow: null,
  barringClause: '',
  barredVenues: [],
};

export const initialVenueTechnicalDetails = {
  flags: '',
  gridHeight: '',
  soundNotes: '',
  soundDesk: '',
  stageSize: '',
  techLXNotes: '',
  techLXDesk: '',
  techSpecsUrl: '',
  files: [],
};

export const initialVenueState = {
  ...initialMainVenueDetails,
  ...initialVenueAddressDetails,
  ...initialVenueBarringRules,
  ...initialVenueTechnicalDetails,
  venueContacts: [],
  confidentialNotes: '',
};

export const venueStatusOptions = [
  { text: 'Open', value: 'O' },
  { text: 'Closed', value: 'C' },
  { text: 'Warning', value: 'W' },
];
