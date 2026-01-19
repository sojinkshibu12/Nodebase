"use client"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  
  return (
    <Button
      onClick={async () => {
        await authClient.signOut()
        window.location.href = "/login"
      }}
    >
      Logout
    </Button>
  )
}
