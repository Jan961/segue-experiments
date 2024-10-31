import { selector } from 'recoil';
import { userPermissionsState } from '../userPermissionsState';

const HOME_PERMISSIONS = [
  'BOOKINGS',
  'CONTRACTS',
  'MARKETING',
  'PROJECT_MANAGEMENT',
  'SYSTEM_ADMIN',
  'TOURING_MANAGEMENT',
];

const MARKETING_HOME_PERMISSIONS = [
  'MARKETING',
  'ACCESS_MARKETING_HOME_-_SALES',
  'ACCESS_MARKETING_HOME_-_ARCHIVED_SALES',

  // activities tab and features within
  'ACCESS_MARKETING_HOME_-_ACTIVITIES',
  'ACCESS_EDIT_ACTIVITY_MODAL',
  'EDIT_ACTIVITY',
  'DELETE_ACTIVITY',
  'ADD_NEW_ACTIVITY',
  'EDIT_ACTIVITIES_CHECKS',
  'EDIT_MARKETING_COSTS',
  'ACCESS_GLOBAL_ACTIVITY_DETAIL',

  // Global Activities Module
  'ACCESS_EDIT_GLOBAL_ACTIVITY',
  'ADD_NEW_GLOBAL_ACTIVITY',
  'DELETE_GLOBAL_ACTIVITY',
  'EDIT_GLOBAL_ACTIVITY',

  'ACCESS_MARKETING_HOME_-_CONTACT_NOTES',
  'ACCESS_MARKETING_HOME_-_VENUE_CONTACTS',
  'ACCESS_MARKETING_HOME_-_PROMOTER_HOLDS',
  'ACCESS_MARKETING_HOME_-_ATTACHMENTS',
  'EDIT_LANDING_PAGE',
];

const CONTRACTS_HOME_PERMISSIONS = [
  'CONTRACTS',
  'ACCESS_ARTISTE_CONTRACTS',
  'ACCESS_CREATIVE_CONTRACTS',
  'ACCESS_VENUE_CONTRACTS',
  'ACCESS_SM_/_CREW_/_TECH_CONTRACTS',
];

const BOOKINGS_HOME_PERMISSIONS = [
  'BOOKINGS',
  'ACCESS_BOOKINGS',
  'ACCESS_TOUR_SUMMARY',
  'ACCESS_VENUE_HISTORY',
  'ACCESS_BARRING_CHECK',
  'ACCESS_BOOKING_NOTES',
  'CREATE_NEW_BOOKING',
  'ACCESS_BOOKING_DETAILS',
  'ACCESS_BOOKING_REPORTS',
  'EDIT_BOOKING_DETAILS',
  'EXPORT_ALL_PRODUCTIONS_MASTERPLAN',
  'EXPORT_MULTIPLE_PENCIL_REPORT',
  'EXPORT_TO_MYTRBK',
  'EXPORT_TRAVEL_SUMMARY',
  'EXPORT_TOUR_SCHEDULE',
  'EXPORT_VENUE_HISTORY',
  'ACCESS_MILEAGE_CHECK',
  'ACCESS_EDIT_VENUE',
  'DELETE_VENUE',
  'EDIT_VENUE_DETAILS',
  'UPLOAD_ATTACHMENTS',
  'ADD_NEW_VENUE',
];

const SHOWS_PERMISSIONS = [
  'ADD_NEW_SHOW',
  'EDIT_SHOW_NAME_AND_CODE',
  'ARCHIVE_SHOW',
  'DELETE_SHOW',
  'ACCESS_VIEW_EDIT_PRODUCTIONS',
  'ADD_NEW_PRODUCTION',
  'DELETE_PRODUCTION',
  'ACCESS_EDIT_PRODUCTION DETAILS',
  'ACCESS_CURRENCY_CONVERSION',
  'EDIT_CURRENCY_CONVERSION',
  'EDIT_PRODUCTION_DETAILS',
];

const ADMIN_HOME_PERMISSIONS = [
  'SYSTEM_ADMIN',
  'ACCESS_USERS',
  'ACCESS_COMPANY_DETAILS',
  'ACCESS_ACCOUNT_PREFERENCES',
  'ACCESS_PRODUCTION_COMPANIES',
  'EDIT_USER',
  'ADD_NEW_USER',
  'CREATE_USER_PERMSSION_GROUP',
  'EDIT_USER_PERMISSION_GROUP',
  'DELETE_USER_PERMISSION_GROUP',
  'DELETE_USER',
];

export const accessHome = selector({
  key: 'accessHomeSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => HOME_PERMISSIONS.includes(x));
  },
});

export const accessMarketingHome = selector({
  key: 'accessMarketingHomeSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => MARKETING_HOME_PERMISSIONS.includes(x));
  },
});

export const accesContractsHome = selector({
  key: 'accesContractsHomeSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => CONTRACTS_HOME_PERMISSIONS.includes(x));
  },
});

export const accessBookingsHome = selector({
  key: 'accessBookingsHomeSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => BOOKINGS_HOME_PERMISSIONS.includes(x));
  },
});

export const accessShows = selector({
  key: 'accessShowsSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => SHOWS_PERMISSIONS.includes(x));
  },
});

export const accessAdminHome = selector({
  key: 'accesAdminHomeSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => ADMIN_HOME_PERMISSIONS.includes(x));
  },
});
