export const availableLocales = [
  {
    text: 'United States',
    value: 'en-US',
  },
  {
    text: 'United Kingdom',
    value: 'en-GB',
  },
  {
    text: 'French',
    value: 'fr-FR',
  },
];

export const tileColors = {
  bookings: '#EC6255',
  marketing: '#41A29A',
  tasks: '#FFBE43',
  contracts: '#0093C0',
  systemAdmin: '#E94580',
};

export const homeIcon = {
  default: { iconName: 'home', stroke: '', fill: '' },
  active: { iconName: 'home', stroke: '', fill: '' },
};
export const bookingsIcon = {
  default: { iconName: 'bookings', stroke: '', fill: '' },
  active: { iconName: 'bookings', stroke: '', fill: tileColors.bookings },
};
export const marketingIcon = {
  default: { iconName: 'marketing', stroke: '', fill: '#21345B' },
  active: { iconName: 'marketing', stroke: '#41A29A', fill: '#21345B' },
};

export const contractsIcon = {
  default: { iconName: 'contracts', stroke: '', fill: '' },
  active: { iconName: 'contracts', stroke: '#0093C0', fill: '#21345B' },
};

export const tasksIcon = {
  default: { iconName: 'tasks', stroke: '', fill: '#ffffff' },
  active: { iconName: 'tasks', stroke: '#FDCE74', fill: '#FDCE74' },
};

export const tourManagementIcon = {
  default: { iconName: 'production-management', stroke: '', fill: '' },
  active: { iconName: 'production-management', stroke: '#7B568D;', fill: '#7B568D' },
};

export const systemAdminIcon = {
  default: { iconName: 'system-admin', stroke: '', fill: '#21345B' },
  active: { iconName: 'system-admin', stroke: '#E94580', fill: '#21345B' },
};

export const pdfStandardColors = {
  HEADER_ROW_COLOR: '#EC6255',
  EVEN_ROW_COLOR: '#fcfcfc',
  ODD_ROW_COLOR: '#fff',
  PDF_INNER_BORDER_COLOR: '#dde2eb',
  PDF_OUTER_BORDER_COLOR: '#babfc7',
};

/* 
  Validate Email Rexgex checks for the following
    1. Starts with one or more alphanumeric characters, hyphens, or dots.
    2. Contains an @ symbol.
    3. Contains one or more groups of alphanumeric characters or hyphens followed by a dot (e.g., domain.).
    4. Ends with a top-level domain that is between 2 and 4 characters long, consisting of alphanumeric characters or hyphens.
  Valid  values - user.name@example.com, user-name@sub.domain.co.uk, username@domain.info
  Invalid values - username@domain, user@.com
*/
export const emailRegex = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const NEW_ACCOUNT_WELCOME_EMAIL = 'NEW_ACCOUNT_WELCOME_EMAIL';
export const NEW_USER_VERIFY_EMAIL = 'NEW_USER_VERIFY_EMAIL';
export const NEW_ACCOUNT_SETUP_EMAIL = 'NEW_ACCOUNT_SETUP_EMAIL';
export const NEW_USER_WELCOME_EMAIL = 'NEW_USER_WELCOME_EMAIL';
export const NEW_USER_PIN_EMAIL = 'NEW_USER_PIN_EMAIL';
export const PASSWORD_RESET_EMAIL = 'PASSWORD_RESET_EMAIL';
