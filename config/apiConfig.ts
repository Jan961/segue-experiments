export enum ERROR_CODES {
  VALIDATION_ERROR = 0,
}

const routePermissions = {
  '/bookings': ['BOOKINGS'],
  '/marketing': ['MARKETING'],
  '/tasks': ['TASKS'],
  '/contracts': ['CONTRACTS'],
  '/admin': ['SYSTEM_ADMIN'],
  '/tours': ['TOURING_MANAGEMENT'],
};

export const allowRoute = (path: string, permissions: string[]) => {
  if (routePermissions[path]) {
    return permissions.some((permission) => routePermissions[path].includes(permission));
  }
  return true;
};
