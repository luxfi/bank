import { UserRole } from "../../auth/user-role.enum";

export const userRolesObject = {
  //"user:team": "Team member",
  "user:admin": "Admin",
  "user:manager": "Team Manager",
  "user:member": "Team Member",
  "user:viewer": "Viewer",
};

export const userRoles = (currentUserRole?: UserRole): Map<string, string> => {
  const roles = new Map(Object.entries(userRolesObject));
  if (currentUserRole === UserRole.TeamManager) {
    roles.delete("user:admin");
    return roles;
  }
  if (currentUserRole === UserRole.TeamMember) {
    roles.delete("user:admin");
    roles.delete("user:manager");
    return roles;
  }
  // if Admin can invite all
  return roles;
};
