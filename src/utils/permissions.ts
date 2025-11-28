import { Folder, User } from "@/interfaces";

/**
 * Filters folders based on user permissions and role
 * @param folders - Array of folders to filter
 * @param user - Current user
 * @returns Filtered array of folders the user can access
 */
export function filterFoldersByPermissions(
  folders: Folder[],
  user: User
): Folder[] {
  // If user is not provided, return empty array
  if (!user || !user.teams || user.teams.length === 0) {
    return [];
  }

  // Get user's role in current team
  const currentTeam = user.teams.find(
    (team) => team.teamId === user.currentTeam
  );
  if (!currentTeam) {
    return [];
  }

  const userRole = currentTeam.role.toLowerCase();

  return folders.filter((folder) => {
    // If no permissions are set, default to visible for admin/employee
    if (!folder.permissions || folder.permissions.length === 0) {
      return userRole === "admin" || userRole === "employee";
    }

    // Check if user has permissions based on their role
    const userPermission = folder.permissions.find(
      (perm) => perm.role.toLowerCase() === userRole
    );

    // If no specific permission found for user's role, deny access
    if (!userPermission) {
      return false;
    }

    // If user is a contractor, check if they're in the contractor access list
    if (userRole === "contractor") {
      return folder.contractorAccess?.includes(user.id) || false;
    }

    // For admin and employee roles, check if they have at least view permission
    return userPermission.actions.includes("view");
  });
}

/**
 * Checks if a user can perform a specific action on a folder
 * @param folder - The folder to check permissions for
 * @param user - Current user
 * @param action - The action to check ("view", "edit", "delete")
 * @returns Boolean indicating if user can perform the action
 */
export function canUserPerformAction(
  folder: Folder,
  user: User,
  action: "view" | "edit" | "delete"
): boolean {
  if (!user || !user.teams || user.teams.length === 0) {
    return false;
  }

  // Get user's role in current team
  const currentTeam = user.teams.find(
    (team) => team.teamId === user.currentTeam
  );
  if (!currentTeam) {
    return false;
  }

  const userRole = currentTeam.role.toLowerCase();

  // If no permissions are set, default permissions
  if (!folder.permissions || folder.permissions.length === 0) {
    if (userRole === "admin") return true;
    if (userRole === "employee") return action === "view";
    if (userRole === "contractor") return false;
  }

  // Check specific permissions
  const userPermission = folder.permissions.find(
    (perm) => perm.role.toLowerCase() === userRole
  );

  if (!userPermission) {
    return false;
  }

  // For contractors, also check if they're in the access list
  if (userRole === "contractor") {
    if (!folder.contractorAccess?.includes(user.id)) {
      return false;
    }
  }

  return userPermission.actions.includes(action);
}

/**
 * Filters folders and applies permission inheritance from parent folders
 * @param folders - Array of all folders
 * @param user - Current user
 * @returns Filtered and permission-processed folders
 */
export function processInheritedPermissions(
  folders: Folder[],
  user: User
): Folder[] {
  // Create a map for quick folder lookup
  const folderMap = new Map(folders.map((f) => [f.id, f]));

  // Process each folder to inherit permissions if needed
  const processedFolders = folders.map((folder) => {
    if (!folder.inheritPermissions || !folder.parentFolderId) {
      return folder;
    }

    // Find parent folder
    const parentFolder = folderMap.get(folder.parentFolderId);
    if (!parentFolder) {
      return folder;
    }

    // Inherit permissions from parent
    return {
      ...folder,
      permissions: parentFolder.permissions || folder.permissions,
      contractorAccess:
        parentFolder.contractorAccess || folder.contractorAccess,
    };
  });

  // Filter folders based on permissions
  return filterFoldersByPermissions(processedFolders, user);
}
