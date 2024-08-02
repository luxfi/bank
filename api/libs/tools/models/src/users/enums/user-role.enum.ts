export enum UserRole {
  SuperAdmin = 'admin:super',
  AdminUser = 'user:admin',
  TeamManager = 'user:manager',
  TeamMember = 'user:member',
  ViewerUser = 'user:viewer'
}

export const UserRoles = [
  UserRole.AdminUser,
  UserRole.TeamMember,
  UserRole.ViewerUser,
  UserRole.TeamManager,
];

export const AdminRoles = [UserRole.SuperAdmin];
export const MemberRoles = [UserRole.TeamMember];
export const ManagerRoles = [UserRole.AdminUser, UserRole.TeamManager];
