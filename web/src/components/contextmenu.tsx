import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import React from "react";

interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface ContextMenuComponentProps {
  items: MenuItem[];
  children: React.ReactNode;
}

export default function ContextMenuComponent({
  items,
  children,
}: ContextMenuComponentProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {items.map((item, idx) => (
          <ContextMenuItem
            key={idx}
            disabled={item.disabled}
            onClick={item.onClick}
          >
            {item.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
