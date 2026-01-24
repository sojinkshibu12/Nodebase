

import { StarIcon, XIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({
  open,
  onOpenChange,
}: UpgradeModalProps) => {
  if (!open) return null;

  const onClose = () => onOpenChange(false);

//   const onUpgrade = async () => {
//     try {
//       await authClient.checkout({
//         slug: "nodebase-pro",
//         successUrl: "/billing/success",
//         cancelUrl: "/billing/cancel",
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Failed to start checkout");
//     }
//   };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <XIcon className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <StarIcon className="h-6 w-6 text-yellow-600" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900">
          Upgrade to Pro
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600">
          You need an active{" "}
          <span className="font-medium">Pro subscription</span> to unlock
          all features and access premium workflows.
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={()=>{
                authClient.checkout({slug:"Nodebase-pro"})
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900"
          >
            <StarIcon className="h-4 w-4" />
            Upgrade to Pro
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
