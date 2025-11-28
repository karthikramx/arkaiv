"use client";

import * as React from "react";
import { useState } from "react";
import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
  },
  navMain: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Project",
          url: "/project-settings",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { userDoc, createTeam, switchTeam } = useTeam();
  const [createTeamDialog, setCreateTeamDialog] = useState(false);
  const [teamName, setTeamName] = useState("Team X");
  const [activeTeam, setActiveTeam] = React.useState<{
    teamId: string;
    imageUrl: string;
    name: string;
  } | null>(null);

  data.user.email = user?.email ?? "";
  data.user.name = user?.displayName ?? "Update Display Name";

  React.useEffect(() => {
    if (!userDoc?.email) return;
    const currentTeam = userDoc?.teams.find(
      (t) => t.teamId === userDoc?.currentTeam
    );
    if (currentTeam) {
      setActiveTeam(currentTeam);
    }
  }, [userDoc]);

  const onAddTeamHander = async () => {
    setCreateTeamDialog(true);
  };

  return (
    <div>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher
            teams={
              userDoc?.teams?.map((team) => ({
                ...team,
                logo: GalleryVerticalEnd,
              })) || []
            }
            activeTeam={activeTeam}
            setActiveTeam={switchTeam}
            addTeamHandler={onAddTeamHander}
          />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={
              userDoc
                ? {
                    name: userDoc.name,
                    email: userDoc.email,
                    avatar: userDoc.imageUrl,
                  }
                : data.user
            }
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <Dialog open={createTeamDialog} onOpenChange={setCreateTeamDialog}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a new Team</DialogTitle>
              <DialogDescription>
                Create a new Team by entering its name and type. This action can
                be undone by deleting the team
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input
                  id="name-1"
                  name="name"
                  defaultValue={teamName}
                  onChange={(e) => {
                    setTeamName(e.target.value);
                  }}
                />
              </div>
              <div className="grid gap-3">
                <FieldSet>
                  <FieldLabel>Team Type</FieldLabel>
                  <FieldDescription>
                    You can either create a team for yourself or for your group
                    / enterprise
                  </FieldDescription>
                  <RadioGroup defaultValue="monthly">
                    <Field orientation="horizontal">
                      <RadioGroupItem value="monthly" id="plan-monthly" />
                      <FieldLabel
                        htmlFor="plan-monthly"
                        className="font-normal"
                      >
                        Team
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <RadioGroupItem value="yearly" id="plan-yearly" />
                      <FieldLabel htmlFor="plan-yearly" className="font-normal">
                        Enterprise
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <RadioGroupItem value="lifetime" id="plan-lifetime" />
                      <FieldLabel
                        htmlFor="plan-lifetime"
                        className="font-normal"
                      >
                        Self
                      </FieldLabel>
                    </Field>
                  </RadioGroup>
                </FieldSet>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={async () => {
                  await createTeam(teamName, "team");
                  toast("New team created");
                  setCreateTeamDialog(false);
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
