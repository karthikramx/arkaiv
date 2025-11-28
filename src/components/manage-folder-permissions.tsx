"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import TagSelector from "@/components/ui/tag-selector";
import { Folder, FolderPermission, User } from "@/interfaces";
import { toast } from "sonner";
import { updateDocument } from "@/lib/firestore";
import { useTeam } from "@/context/TeamContext";

interface ManageFolderPermissionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: Folder;
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

export default function ManageFolderPermissions({
  open,
  onOpenChange,
  folder,
}: ManageFolderPermissionsProps) {
  const [permissions, setPermissions] = useState<FolderPermission[]>(
    folder.permissions || DEFAULT_PERMISSIONS
  );
  const [contractorAccess, setContractorAccess] = useState<string[]>(
    folder.contractorAccess || []
  );
  const [tags, setTags] = useState<string[]>(folder.tags || []);
  const [selectedColor, setSelectedColor] = useState<
    (typeof FOLDER_COLORS)[number]["value"]
  >(folder.color || "blue");
  const [isSaving, setIsSaving] = useState(false);
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

  // Close dialog if user is not admin
  useEffect(() => {
    if (open && !isAdmin) {
      toast("Only administrators can manage folder permissions");
      onOpenChange(false);
    }
  }, [open, isAdmin, onOpenChange]);

  const availableTags = [
    "Important",
    "Confidential",
    "Archive",
    "Active",
    "Review",
  ];

  // Reset form when folder changes
  useEffect(() => {
    setPermissions(folder.permissions || DEFAULT_PERMISSIONS);
    setContractorAccess(folder.contractorAccess || []);
    setTags(folder.tags || []);
    setSelectedColor(folder.color || "blue");
  }, [folder]);

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

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateDocument("folders", folder.id, {
        permissions,
        contractorAccess,
        tags,
        color: selectedColor,
      });

      toast(`Folder permissions updated successfully`);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating folder permissions:", error);
      toast("Error updating folder permissions");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Folder: {folder.name}</DialogTitle>
          <DialogDescription>
            Configure folder permissions, access, and properties
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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

          {/* Permissions Configuration */}
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
                {permission.role === "CONTRACTOR" && contractors.length > 0 && (
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
                            checked={contractorAccess.includes(contractor.id)}
                            onCheckedChange={(checked) =>
                              handleContractorToggle(contractor.id, !!checked)
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
