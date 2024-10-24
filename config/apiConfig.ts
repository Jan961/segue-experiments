export enum ERROR_CODES {
  VALIDATION_ERROR = 0,
}

const bookingsSlug = /\/bookings\/[a-zA-Z0-9]+/;
const marketingSlug = /\/marketing\/[a-zA-Z0-9]+/;

// It is important that all slug routes are listed after the spefic routes
const routePermissions = new Map<RegExp, string[]>([
  [/^\/bookings$/, ['ACCESS_BOOKING_HOME']],
  [/^\/bookings\/shows$/, ['ACCESS_MANAGE_SHOWS_PRODUCTIONS']],
  [/^\/bookings\/venues$/, ['ACCESS_MANAGE_VENUE_DATABASE']],
  [/^\/marketing$/, ['MARKETING']],
  [/^\/tasks$/, ['ACCESS_PRODUCTION_TASK_LISTS']],
  [/^\/tasks\/master$/, ['ACCESS_MASTER_TASK_LIST']],
  [/^\/contracts$/, ['CONTRACTS']],
  [/^\/system-admin$/, ['SYSTEM_ADMIN']],
  [/^\/admin\/users$/, ['ACCESS_USERS']],
  [/^\/admin\/company-information$/, ['ACCESS_COMPANY_DETAILS']],
  [/^\/admin\/account-preferences\/[a-zA-Z0-9]+$/, ['ACCESS_ACCOUNT_PREFERENCES']],
  [/^\/admin\/payment-details\/[a-zA-Z0-9]+$/, ['ACCESS_PAYMENT_DETAILS']],
  [/^\/touring-management$/, ['TOURING_MANAGEMENT']],
  [bookingsSlug, ['ACCESS_BOOKING_HOME']],
  [marketingSlug, ['MARKETING']],
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
