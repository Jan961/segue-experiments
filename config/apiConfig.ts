export enum ERROR_CODES {
  VALIDATION_ERROR = 0,
}

const bookingsSlug = /\/bookings\/[a-zA-Z0-9]+/;
const routePermissions = new Map<RegExp, string[]>([
  [/^\/bookings$/, ['ACCESS_BOOKING_HOME']],
  [bookingsSlug, ['ACCESS_BOOKING_HOME']],
  [/^\/marketing$/, ['MARKETING']],
  [/^\/tasks$/, ['PROJECT_MANAGEMENT']],
  [/^\/contracts$/, ['CONTRACTS']],
  [/^\/system-admin$/, ['SYSTEM_ADMIN']],
  [/^\/touring-management$/, ['TOURING_MANAGEMENT']],
]);

export const allowRoute = (path: string, permissions: string[]) => {
  if (path === '/') {
    return true;
  }
  const key = [...routePermissions.keys()].find((key) => key.test(path));
  if (!key) {
    return true; // set to true temporarily to allow all routes tah have not been catered for
  }
  const necessaryPermissions = routePermissions.get(key);
  // We need to ensure that user has all the permissions required to access the route
  return necessaryPermissions.every((item) => permissions.includes(item));
};
