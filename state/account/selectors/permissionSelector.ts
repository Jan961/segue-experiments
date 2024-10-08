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

export const accessHome = selector({
  key: 'accessDepartmentsSelector',
  get: ({ get }) => {
    const { permissions = [] } = get(userPermissionsState);
    return permissions.filter((x) => HOME_PERMISSIONS.includes(x));
  },
});
