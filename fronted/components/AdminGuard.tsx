import React from "react";
import { getAuth } from "../services/auth";
import "./AdminGuard.css";

type Props = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: Props) {
  const auth = getAuth();

  if (!auth) {
    return (
      <div className="admin-guard">
        <h1>Admin</h1>
        <div className="admin-guard-box">
          Trebuie să fii logat ca administrator pentru a accesa această pagină.
        </div>
      </div>
    );
  }

  if (auth.role !== "admin") {
    return (
      <div className="admin-guard">
        <h1>Admin</h1>
        <div className="admin-guard-box">
          Nu ai drepturi de administrator.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
