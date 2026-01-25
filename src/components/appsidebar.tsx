"use client";

import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/app/functionalities/subscrpition/hooks/use-subscription";

/* ------------------ Menu ------------------ */
const menuItems = [
  {
    title: "Workflows",
    items: [
      {
        title: "Workflows",
        url: "/workflow",
        icon: FolderOpenIcon,
      },
      {
        title: "Credentials",
        url: "/credentials",
        icon: KeyIcon,
      },
      {
        title: "Executions",
        url: "/executions",
        icon: HistoryIcon,
      },
    ],
  },
];

/* ------------------ Component ------------------ */
export const AppSidebar = () => {
  const {hasActivesubscription,isLoading} = useHasActiveSubscription()
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex h-14 items-center px-4 lg:hidden ">
        <button onClick={() => setOpen(true)}>
          <MenuIcon className="h-5 w-5" />
        </button>
        
      </div>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 flex h-screen w-64 shrink-0 flex-col border-r  bg-white transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Nodebase Logo" width={28} height={28} />
            <span className="text-sm font-semibold">Nodebase</span>
          </Link>

          {/* Close button (mobile) */}
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <nav className="flex-1 space-y-6 p-2">
          {menuItems.map((group) => (
            <div key={group.title}>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url);

                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm transition
                        ${
                          active
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-2 space-y-1">
          {!hasActivesubscription && !isLoading && (
          <button className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-gray-600 hover:bg-gray-100"
          onClick={()=>authClient.checkout({slug:"Nodebase-pro"})}
          >
            <StarIcon className="h-4 w-4" />
            Upgrade to Pro
          </button>
          )}
          <button className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-gray-600 hover:bg-gray-100">
            <CreditCardIcon className="h-4 w-4" />
            Billing portal
          </button>

          <button
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => router.push("/login"),
                },
              })
            }
            className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOutIcon className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};
