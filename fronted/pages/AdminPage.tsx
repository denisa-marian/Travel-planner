import React from "react";
import AdminPanel from "./AdminPanel";
import AdminGuard from "../components/AdminGuard";

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPanel />
    </AdminGuard>
  );
}
