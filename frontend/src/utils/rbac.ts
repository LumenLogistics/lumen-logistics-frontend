// Roles matching the backend UserRole enum
export type UserRole = 'Admin' | 'Manager' | 'Viewer' | 'Driver';

// Legacy aliases used across the codebase
export type LegacyRole = 'company' | 'customer';

export type Action =
  | 'shipment:create'
  | 'shipment:upload-proof'
  | 'shipment:confirm-milestone'
  | 'shipment:delete'
  | 'shipment:bulk-update'
  | 'settlement:release-payment'
  | 'settlement:dispute'
  | 'user:manage-team'
  | 'user:invite'
  | 'user:change-role'
  | 'analytics:view'
  | 'api-keys:manage'
  | 'settings:company';

const PERMISSIONS: Record<UserRole, Action[]> = {
  Admin: [
    'shipment:create',
    'shipment:upload-proof',
    'shipment:confirm-milestone',
    'shipment:delete',
    'shipment:bulk-update',
    'settlement:release-payment',
    'settlement:dispute',
    'user:manage-team',
    'user:invite',
    'user:change-role',
    'analytics:view',
    'api-keys:manage',
    'settings:company',
  ],
  Manager: [
    'shipment:create',
    'shipment:upload-proof',
    'shipment:confirm-milestone',
    'shipment:bulk-update',
    'settlement:release-payment',
    'settlement:dispute',
    'analytics:view',
  ],
  Viewer: [],
  Driver: [
    'shipment:upload-proof',
  ],
};

export function can(role: UserRole | LegacyRole | null, action: Action): boolean {
  if (!role) return false;
  // Map legacy roles
  const normalized: UserRole =
    role === 'company' ? 'Admin' :
    role === 'customer' ? 'Viewer' :
    role as UserRole;
  return (PERMISSIONS[normalized] ?? []).includes(action);
}

export function hasRole(role: UserRole | LegacyRole | null, ...roles: UserRole[]): boolean {
  if (!role) return false;
  const normalized: UserRole =
    role === 'company' ? 'Admin' :
    role === 'customer' ? 'Viewer' :
    role as UserRole;
  return roles.includes(normalized);
}
