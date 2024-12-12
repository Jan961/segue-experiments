import { selector } from 'recoil';
import { userPermissionsState } from '../userPermissionsState';
import { productionJumpState } from 'state/booking/productionJumpState';

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

  // Sales Tab
  'ACCESS_MARKETING_HOME_-_SALES',
  'EDIT_ACTIVTIY_FLAGS',

  // Archived Sales Tab
  'ACCESS_MARKETING_HOME_-_ARCHIVED_SALES',
  'EXPORT_DISPLAYED_SALES_DATA',

  // activities tab and features within
  'ACCESS_MARKETING_HOME_-_ACTIVITIES',
  'ACCESS_EDIT_ACTIVITY_MODAL',
  'EDIT_ACTIVITY',
  'DELETE_ACTIVITY',
  'ADD_NEW_ACTIVITY',
  'EDIT_ACTIVITIES_CHECKS',
  'EDIT_MARKETING_COSTS',
  'ACCESS_GLOBAL_ACTIVITY_DETAIL',

  // Sales Entry
  'ACCESS_SALES_ENTRY',
  'EDIT_BOOKING_SALES_NOTES',
  'EDIT_COMPS_NOTES',
  'EDIT_COMPS_TABLE',
  'EDIT_HOLDS_NOTES',
  'EDIT_SALES_ENTRY',
  'EDIT_HOLDS_TABLE',

  // Global Activities Module
  'ACCESS_EDIT_GLOBAL_ACTIVITY',
  'ADD_NEW_GLOBAL_ACTIVITY',
  'DELETE_GLOBAL_ACTIVITY',
  'EDIT_GLOBAL_ACTIVITY',

  // Contact Notes Tab
  'ACCESS_MARKETING_HOME_-_CONTACT_NOTES',
  'DELETE_CONTACT_NOTES',
  'EDIT_CONTACT_NOTE',
  'EXPORT_CONTACT_NOTES_REPORT',

  // Venue Contacts Tab
  'ACCESS_MARKETING_HOME_-_VENUE_CONTACTS',
  'ADD_NEW_CONTACT', // REMOVE UNDERSCORE WHEN SETEVE UPDATES DB
  'DELETE_VENUE_CONTACTS',
  'EDIT_VENUE_CONTACTS',

  // Promoter Holds Tab
  'ACCESS_MARKETING_HOME_-_PROMOTER_HOLDS',
  'ADD_NEW_ALLOCATED_SEATS',
  'EDIT_ALLOCATED_SEATS',
  'EDIT_AVAILABLE_SEATS',
  'EDIT_CAST_RATE',
  'EXPORT_ALLOCATED_SEATS',
  'DELETE_ALLOCATED_SEATS',

  // Attachments Tab
  'ACCESS_MARKETING_HOME_-_ATTACHMENTS',
  'DELETE_PRODUCTION_ATTACHMENT',
  'DELETE_VENUE_ATTACHMENT',
  'UPLOAD_NEW_PRODUCTION_ATTACHMENT',
  'UPLOAD_NEW_VENUE_ATTACHMENT',
  'VIEW_PRODUCTION_ATTACHMENT',
  'VIEW_VENUE_ATTACHMENT',

  // Reports
  'EXPORT_HOLDS_+_COMPS',
  'EXPORT_PROMOTER_HOLDS',
  'EXPORT_SALES_GRAPHS',
  'EXPORT_SALES_SUMARY_+_WEEKLY_TOTALS',
  'EXPORT_SALES_SUMMARY',
  'EXPORT_SALES_VS_CAPACITY_%',
  'EXPORT_SELECTED_VENUES',
  'EXPORT_TOTAL_GROSS_SALES',
  'EXPORT_TOTAL_SALES',

  // Misc
  'ACCESS_VENUE_WEBSITE',
  'EDIT_LANDING_PAGE',
];

const CONTRACTS_HOME_PERMISSIONS = [
  'CONTRACTS',
  'ACCESS_ARTISTE_CONTRACTS',
  'ACCESS_CREATIVE_CONTRACTS',
  'ACCESS_VENUE_CONTRACTS',
  'ACCESS_SM_/_CREW_/_TECH_CONTRACTS',
  'CONTRACTS_ADD_PERSON',
];

const CONTRACTS_ARTISTE_PERMISSIONS = [
  'ADD_NEW_ARTISTE_CONTRACT',
  'EDIT_ARTISTE_CONTRACT_STATUS_DROPDOWNS',
  'EDIT_CONTRACT_ARTISTE',
  'EDIT_PERSON_DETAILS_ARTISTE',
  'EXPORT_ARTISTE_CONTRACT',
];

const CONTRACTS_CREATIVES_PERMISSIONS = [
  'ADD_NEW_CREATIVE_CONTRACT',
  'EDIT_CONTRACT_CREATIVE',
  'EDIT_CREATIVE_CONTRACT_STATUS_DROPDOWNS',
  'EDIT_PERSON_DETAILS_CREATIVE',
  'EXPORT_CREATIVE_CONTRACT',
];

const CONTRACTS_TECH_PERMISSIONS = [
  'ADD_NEW_TECH_CONTRACT',
  'EDIT_TECH_CONTRACT',
  'EDIT_TECH_CONTRACT_STATUS_DROPDOWNS',
  'EDIT_TECH_PERSON_DETAILS',
  'EXPORT_TECH_CONTRACT',
];

const CONTRACTS_VENUE_PERMISSIONS = [
  'ACCESS_DEAL_MEMO_AND_CONTRACT_OVERVIEW',
  'ACCESS_EDIT_DEAL_MEMO',
  'EDIT_DEAL_MEMO',
  'CREATE_DEAL_MEMO',
  'EDIT_DEAL_MEMO_AND_CONRTACT_OVERVIEW',
  'EXPORT_DEAL_MEMO',
  'EXPORT_VENUE_CONTRACT_DETAILS',
  'UPLOAD_CONTRACT_ATTACHMENTS',
  'VIEW_ATTACHMENTS',
];

const BOOKINGS_HOME_PERMISSIONS = [
  'ACCESS_BOOKING_HOME',
  'ACCESS_MANAGE_SHOWS_PRODUCTIONS',
  'ACCESS_MANAGE_VENUE_DATABASE',
  'ACCESS_TOUR_SUMMARY',
  'ACCESS_VENUE_HISTORY',
  'ACCESS_BARRING_CHECK',
  'EXPORT_BARRING_CHECK',
  'ACCESS_BOOKING_NOTES',
  'EDIT_BOOKING_NOTES',
  'CREATE_NEW_BOOKING',
  'ACCESS_BOOKING_DETAILS',
  'ACCESS_BOOKING_REPORTS',
  'EDIT_BOOKING_DETAILS',
  'CHANGE_BOOKING_LENGTH',
  'DELETE_BOOKING',
  'MOVE_BOOKING',
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
  'EDIT_PRODUCTION_DETAILS',
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
  'ACCESS_ACCOUNT_DETAILS',
  'ACCESS_PRODUCTION_COMPANIES',
  'EDIT_USER',
  'ADD_NEW_USER',
  'CREATE_USER_PERMISSION_GROUP',
  'EDIT_USER_PERMISSION_GROUP',
  'DELETE_USER_PERMISSION_GROUP',
  'DELETE_USER',
  'ACCESS_ACCOUNT_DETAILS',
];

const PROJECT_MANAGEMENT_PERMISSIONS = [
  'ACCESS_MASTER_TASK_LIST',
  'ACCESS_PRODUCTION_TASK_LISTS',
  'ACCESS_MASTER_TASK_NOTES',
  'ADD_MASTER_TASK',
  'CLONE_MASTER_TASK',
  'DELETE_MASTER_TASK',
  'ACCESS_EDIT_MASTER_TASKS',
  'EDIT_MASTER_TASKS',
  'ACCESS_EDIT_PROD_TASKS',
  'ACCESS_PROD_TASK_NOTES',
  'ACCESS_PROD_TASK_REPORTS',
  'CLONE_PROD_TASK',
  'ADD_PROD_TASK',
  'EDIT_PROD_TASK_DROPDOWNS',
  'DELETE_PROD_TASK',
  'EDIT_PROD_TASK',
  'EDIT_MASTER_TASK_NOTES',
  'EDIT_PROD_TASK_NOTES',
  'EXPORT_MASTER_TASK_LIST',
  'EXPORT_PRODUCTION_TASK_LIST',
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

export const accessContractsHome = selector({
  key: 'accesContractsHomeSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => CONTRACTS_HOME_PERMISSIONS.includes(x));
  },
});

export const accessCreativesContracts = selector({
  key: 'accessCreativesContractsSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => CONTRACTS_CREATIVES_PERMISSIONS.includes(x));
  },
});

export const accessArtisteContracts = selector({
  key: 'accessArtisteContractsSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => CONTRACTS_ARTISTE_PERMISSIONS.includes(x));
  },
});

export const accessTechContracts = selector({
  key: 'accessTechContractsSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => CONTRACTS_TECH_PERMISSIONS.includes(x));
  },
});

export const accessAllContracts = selector({
  key: 'accessAllContracts',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) =>
      [...CONTRACTS_ARTISTE_PERMISSIONS, ...CONTRACTS_CREATIVES_PERMISSIONS, ...CONTRACTS_TECH_PERMISSIONS].includes(x),
    );
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

export const accessVenueContracts = selector({
  key: 'accessVenueContracts',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => CONTRACTS_VENUE_PERMISSIONS.includes(x));
  },
});

export const accessAdminHome = selector({
  key: 'accesAdminHomeSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => ADMIN_HOME_PERMISSIONS.includes(x));
  },
});

export const accessProjectManagement = selector({
  key: 'accessProjectManagement',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => PROJECT_MANAGEMENT_PERMISSIONS.includes(x));
  },
});

export const isPermissionsInitialised = selector({
  key: 'isPermissionsInitialisedSelector',
  get: ({ get }) => {
    const { isInitialised } = get(userPermissionsState);
    return isInitialised;
  },
});

export const productionsState = selector({
  key: 'productionsState',
  get: ({ get }) => {
    const { accessibleProductions = [] } = get(userPermissionsState);
    const { selected, productions } = get(productionJumpState);
    return {
      selected,
      productions: productions.filter((x) => accessibleProductions?.includes(x.Id)),
    };
  },
});
