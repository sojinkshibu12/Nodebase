"use client";

import { XIcon } from "lucide-react";

import { NODE_PICKER_OPTIONS } from "@/config/node-catalog";
import { Nodetype } from "@/generated/prisma/enums";

interface NodePickerSidebarProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: Nodetype) => void;
}

export const NodePickerSidebar = ({
  open,
  onClose,
  onSelect,
}: NodePickerSidebarProps) => {
  return (
    <aside
      className={`absolute right-0 top-0 z-20 flex h-full w-80 flex-col border-l bg-background shadow-lg transition-transform ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Add Node</h2>
        <button
          className="rounded p-1 text-muted-foreground hover:bg-accent"
          onClick={onClose}
          type="button"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {NODE_PICKER_OPTIONS.map((option) => (
          <button
            key={option.type}
            className="w-full rounded-md border p-3 text-left transition hover:bg-accent"
            onClick={() => onSelect(option.type)}
            type="button"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {option.category}
            </p>
            <p className="text-sm font-medium">{option.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </aside>
  );
};
