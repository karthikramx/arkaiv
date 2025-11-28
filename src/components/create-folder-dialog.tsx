"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import TagSelector from "@/components/ui/tag-selector";
import { Folder, FolderPermission, User } from "@/interfaces";
import { toast } from "sonner";
import { createFolder } from "@/services/folder";
import { useTeam } from "@/context/TeamContext";

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentFolderId: string;
  parentFolder?: Folder | null;
}

const FOLDER_COLORS = [
  { name: "Blue", value: "blue", bg: "bg-blue-100", border: "border-blue-300" },
  {
    name: "Green",
    value: "green",
    bg: "bg-green-100",
    border: "border-green-300",
  },
  {
    name: "Purple",
    value: "purple",
    bg: "bg-purple-100",
    border: "border-purple-300",
  },
  {
    name: "Orange",
    value: "orange",
    bg: "bg-orange-100",
    border: "border-orange-300",
  },
  { name: "Red", value: "red", bg: "bg-red-100", border: "border-red-300" },
  {
    name: "Yellow",
    value: "yellow",
    bg: "bg-yellow-100",
    border: "border-yellow-300",
  },
  { name: "Gray", value: "gray", bg: "bg-gray-100", border: "border-gray-300" },
] as const;

const DEFAULT_PERMISSIONS: FolderPermission[] = [
  { role: "ADMIN", actions: ["view", "edit", "delete"] },
  { role: "EMPLOYEE", actions: ["view"] },
  { role: "CONTRACTOR", actions: ["view"] },
];

export default function CreateFolderDialog({
  open,
  onOpenChange,
  parentFolderId,
  parentFolder,
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("untitled");
  const [inheritPermissions, setInheritPermissions] = useState(!!parentFolder);
  const [permissions, setPermissions] = useState<FolderPermission[]>(
    parentFolder?.permissions || DEFAULT_PERMISSIONS
  );
  const [contractorAccess, setContractorAccess] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] =
    useState<(typeof FOLDER_COLORS)[number]["value"]>("blue");
  const [isCreating, setIsCreating] = useState(false);
  const [contractors, setContractors] = useState<User[]>([]);

  const { userDoc } = useTeam();

  // Check if current user is admin
  const isAdmin =
    userDoc?.teams?.find((team) => team.teamId === userDoc.currentTeam)
      ?.role === "admin";

  // Fetch contractors when dialog opens (only for admins)
  useEffect(() => {
    const fetchContractors = async () => {
      if (!userDoc?.currentTeam) return;

      try {
        const response = await fetch(
          `/api/teams/${userDoc.currentTeam}/contractors`
        );
        const data = await response.json();

        if (response.ok && data.contractors) {
          setContractors(data.contractors);
        } else {
          console.error("Error fetching contractors:", data.error);
        }
      } catch (error) {
        console.error("Error fetching contractors:", error);
      }
    };

    if (open && isAdmin && userDoc?.currentTeam) {
      fetchContractors();
    }
  }, [open, isAdmin, userDoc?.currentTeam]);

  const availableTags = [
    "Important",
    "Confidential",
    "Archive",
    "Active",
    "Review",
  ];

  const handlePermissionChange = (
    roleIndex: number,
    action: "view" | "edit" | "delete",
    checked: boolean
  ) => {
    const newPermissions = [...permissions];
    const role = newPermissions[roleIndex];

    if (checked) {
      if (!role.actions.includes(action)) {
        role.actions.push(action);
      }
    } else {
      role.actions = role.actions.filter((a) => a !== action);
    }

    setPermissions(newPermissions);
  };

  const handleContractorToggle = (contractorId: string, checked: boolean) => {
    if (checked) {
      setContractorAccess([...contractorAccess, contractorId]);
    } else {
      setContractorAccess(contractorAccess.filter((id) => id !== contractorId));
    }
  };

  const resetToDefault = (roleIndex: number) => {
    const newPermissions = [...permissions];
    const defaultRole = DEFAULT_PERMISSIONS.find(
      (p) => p.role === permissions[roleIndex].role
    );
    if (defaultRole) {
      newPermissions[roleIndex] = { ...defaultRole };
      setPermissions(newPermissions);
    }
  };

  const handleCreateFolder = async () => {
    if (!userDoc?.currentTeam) {
      toast("Error: No team selected");
      return;
    }

    setIsCreating(true);
    try {
      const finalPermissions =
        inheritPermissions && parentFolder
          ? parentFolder.permissions
          : permissions;

      const finalContractorAccess =
        inheritPermissions && parentFolder
          ? parentFolder.contractorAccess
          : contractorAccess;

      await createFolder(folderName, parentFolderId, userDoc.currentTeam, {
        permissions: finalPermissions,
        contractorAccess: finalContractorAccess,
        inheritPermissions,
        tags,
        color: selectedColor,
      });

      toast(`Folder "${folderName}" created successfully`);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast("Error creating folder");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFolderName("untitled");
    setInheritPermissions(!!parentFolder);
    setPermissions(parentFolder?.permissions || DEFAULT_PERMISSIONS);
    setContractorAccess([]);
    setTags([]);
    setSelectedColor("blue");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Configure folder permissions, access, and properties
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Folder Name */}
          <div className="space-y-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>Folder Color</Label>
            <div className="flex flex-wrap gap-2">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 ${color.bg} ${
                    color.border
                  } ${
                    selectedColor === color.value ? "ring-2 ring-blue-500" : ""
                  } hover:scale-110 transition-transform`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagSelector
              tags={availableTags}
              existing={tags}
              onChange={setTags}
            />
          </div>

          <Separator />

          {/* Admin Only Notice */}
          {!isAdmin && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Only administrators can configure folder permissions. Default
                permissions will be applied.
              </p>
            </div>
          )}

          {/* Inheritance Option - Admin Only */}
          {parentFolder && isAdmin && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inheritPermissions"
                checked={inheritPermissions}
                onCheckedChange={(checked) => setInheritPermissions(!!checked)}
              />
              <Label htmlFor="inheritPermissions">
                Inherit permissions from parent folder
              </Label>
            </div>
          )}

          {/* Permissions Configuration - Admin Only */}
          {isAdmin && !inheritPermissions && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Permissions</Label>

              {permissions.map((permission, index) => (
                <div key={permission.role} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant={
                        permission.role === "ADMIN" ? "default" : "secondary"
                      }
                    >
                      {permission.role}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => resetToDefault(index)}
                    >
                      Reset to Default
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    {["view", "edit", "delete"].map((action) => (
                      <div key={action} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${permission.role}-${action}`}
                          checked={permission.actions.includes(
                            action as "view" | "edit" | "delete"
                          )}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              index,
                              action as "view" | "edit" | "delete",
                              !!checked
                            )
                          }
                        />
                        <Label htmlFor={`${permission.role}-${action}`}>
                          {action.charAt(0).toUpperCase() + action.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {/* Contractor Access */}
                  {permission.role === "CONTRACTOR" &&
                    contractors.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Contractor Access ({contractorAccess.length} selected)
                        </Label>
                        <div className="max-h-32 overflow-y-auto space-y-2 border rounded p-2">
                          {contractors.map((contractor) => (
                            <div
                              key={contractor.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`contractor-${contractor.id}`}
                                checked={contractorAccess.includes(
                                  contractor.id
                                )}
                                onCheckedChange={(checked) =>
                                  handleContractorToggle(
                                    contractor.id,
                                    !!checked
                                  )
                                }
                              />
                              <Label
                                htmlFor={`contractor-${contractor.id}`}
                                className="text-sm"
                              >
                                {contractor.name} ({contractor.email})
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={isCreating || !folderName.trim()}
            >
              {isCreating ? "Creating..." : "Create Folder"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
