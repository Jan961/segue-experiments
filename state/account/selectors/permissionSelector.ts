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

const ADMIN_PERMISSIONS = [
  'SYSTEM_ADMIN',
  'ACCESS_USERS',
  'ACCESS_PAYMENT_DETAILS',
  'ACCESS_COMPANY_DETAILS',
  'ACCESS_ACCOUNT_PREFERENCES',
];

const MARKETING_HOME_PERMISSIONS = [
  'MARKETING',
  'ACCESS_MARKETING_HOME_-_SALES',
  'ACCESS_MARKETING_HOME_-_ARCHIVED_SALES',
  'ACCESS_MARKETING_HOME_-_ACTIVITIES',
  'ACCESS_MARKETING_HOME_-_CONTACT_NOTES',
  'ACCESS_MARKETING_HOME_-_VENUE_CONTACTS',
  'ACCESS_MARKETING_HOME_-_PROMOTER_HOLDS',
  'ACCESS_MARKETING_HOME_-_ATTACHMENTS',
  'EDIT_LANDING_PAGE',
];

export const accessHome = selector({
  key: 'accessHomeSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => HOME_PERMISSIONS.includes(x));
  },
});

export const accessAdmin = selector({
  key: 'accessAdminSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => ADMIN_PERMISSIONS.includes(x));
  },
});

export const accessMarketingHome = selector({
  key: 'accessMarketingHomeSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => MARKETING_HOME_PERMISSIONS.includes(x));
  },
});
