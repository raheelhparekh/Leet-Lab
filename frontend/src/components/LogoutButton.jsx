import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";

function LogoutButton({ children }) {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    await logout();
    console.log("logged out")
  };

  return (
    <button className="btn btn-primary" onClick={onLogout}>
      {children}
    </button>
  );
}

export default LogoutButton;
