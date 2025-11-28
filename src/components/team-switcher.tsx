"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
  activeTeam,
  setActiveTeam,
  addTeamHandler,
}: {
  teams: {
    name: string;
    imageUrl: string;
    teamId?: string;
    role?: string;
  }[];
  activeTeam: {
    name: string;
    imageUrl: string;
    teamId?: string;
  } | null;
  setActiveTeam: (teamId: string) => Promise<void>;
  addTeamHandler: () => Promise<void>;
}) {
  const { isMobile } = useSidebar();

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {activeTeam.imageUrl ? (
                  <Image
                    src={activeTeam.imageUrl}
                    alt={activeTeam.teamId || activeTeam.name}
                    width={16}
                    height={16}
                    className="size-4"
                  />
                ) : (
                  <div className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={index}
                onClick={async () => {
                  if (team.teamId) {
                    await setActiveTeam(team.teamId);
                  }
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {team.imageUrl ? (
                    <Image
                      src={team.imageUrl}
                      alt={team.teamId || team.name}
                      width={14}
                      height={14}
                      className="size-3.5 shrink-0"
                    />
                  ) : (
                    <div className="size-4" />
                  )}
                </div>
                {team.name}
                {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div
                onClick={async () => {
                  await addTeamHandler();
                }}
                className="text-muted-foreground font-medium"
              >
                Add team
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
