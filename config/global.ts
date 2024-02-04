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
  default: { iconName: 'touring-management', stroke: '', fill: '' },
  active: { iconName: 'touring-management', stroke: '#7B568D;', fill: '#7B568D' },
};

export const systemAdminIcon = {
  default: { iconName: 'system-admin', stroke: '', fill: '#21345B' },
  active: { iconName: 'system-admin', stroke: '#E94580', fill: '#21345B' },
};
