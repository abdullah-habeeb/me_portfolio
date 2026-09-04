import { useEffect, useState } from "react";

import { adminCheckSession } from "@/lib/useContent";

import { AdminShell } from "./AdminShell";
import { LoginScreen } from "./LoginScreen";

export function AdminRoot() {
  const [status, setStatus] = useState<"checking" | "in" | "out">("checking");

  useEffect(() => {
    adminCheckSession().then((authed) => setStatus(authed ? "in" : "out"));
  }, []);

  if (status === "checking") {
    return <div className="grid h-screen w-screen place-items-center bg-background text-sm text-muted-foreground">Loading…</div>;
  }
  if (status === "out") {
    return <LoginScreen onSuccess={() => setStatus("in")} />;
  }
  return <AdminShell onLoggedOut={() => setStatus("out")} />;
}
