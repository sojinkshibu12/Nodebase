"use client";

import { XIcon } from "lucide-react";

import { Nodetype } from "@/generated/prisma/enums";

interface NodePickerSidebarProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: Nodetype) => void;
}

const NODE_OPTIONS = [
  {
    type: Nodetype.MANUALLTRIGGER,
    title: "Manual Trigger",
    description: "Starts the workflow manually when you click run.",
  },
  {
    type: Nodetype.HTTPREQUEST,
    title: "HTTP Request",
    description: "Calls an external API endpoint and passes the response.",
  },
] as const;

export const NodePickerSidebar = ({
  open,
  onClose,
  onSelect,
}: NodePickerSidebarProps) => {
  return (
    <aside
      className={`absolute right-0 top-0 z-20 h-full w-80 border-l bg-background shadow-lg transition-transform ${
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

      <div className="space-y-2 p-3">
        {NODE_OPTIONS.map((option) => (
          <button
            key={option.type}
            className="w-full rounded-md border p-3 text-left transition hover:bg-accent"
            onClick={() => onSelect(option.type)}
            type="button"
          >
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
