"use client";

import { PlusIcon } from "lucide-react";
import { memo } from "react";

interface AddNodeButtonProps {
  onClick: () => void;
}

export const AddnodeButton = memo(({ onClick }: AddNodeButtonProps) => {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-foreground text-white transition hover:bg-gray-600"
      onClick={onClick}
      type="button"
    >
      <PlusIcon size={16} />
    </button>
  );
});

AddnodeButton.displayName = "AddnodeButton";
