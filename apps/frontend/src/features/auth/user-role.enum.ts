export enum UserRole {
  /** CDAX User with full dashboard access. */
  AdminUser = "user:admin",
  /** CDAX User with readonly access to the dashboard. */
  ViewerUser = "user:viewer",
  /** CDAX User with full access except some admin functions. */

  //TeamUser = "user:team", //deprecated
  TeamMember = "user:member",
  TeamManager = "user:manager",

  /** CDAX Super Admin */
  SuperAdmin = "admin:super",
}

export const UserRoles = [
  UserRole.SuperAdmin,
  UserRole.AdminUser,
  UserRole.TeamMember,
  UserRole.ViewerUser,

  UserRole.TeamManager,
  UserRole.TeamMember,
];
export const UserAdminRoles = [
  UserRole.SuperAdmin,
  UserRole.AdminUser,
  UserRole.TeamManager,
];
export const UserPaymentRoles = [
  UserRole.SuperAdmin,
  UserRole.AdminUser,
  UserRole.TeamMember,

  UserRole.TeamManager,
];
export const UserPaymentRolesWithoutSuperadmin = [
  UserRole.AdminUser,
  UserRole.TeamManager,
];
export const AdminRoles = [UserRole.SuperAdmin];
export const UserOrAdminRoles = [
  UserRole.AdminUser,
  UserRole.TeamMember,
  UserRole.ViewerUser,
  UserRole.SuperAdmin,

  UserRole.TeamManager,
  UserRole.TeamMember,
];
