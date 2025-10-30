export const hasPermission =  (userPermissions: string[], requiredPermissions: string[]) => {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

export const isAdmin = (userPermissions: string[]) => {
  return hasPermission(userPermissions, ['admin']);
};

export const isManager = (userPermissions: string[]) => {
  return hasPermission(userPermissions, ['manager']);
};

export const isOrganizationAdmin = (userRole: string) => {
  return userRole === 'organization:admin';
};

export const isOrganizationManager = (userRole: string) => {
  return userRole === 'organization:manager';
};

export const isOrganizationUser = (userRole: string) => {
  return userRole === 'organization:user';
};
