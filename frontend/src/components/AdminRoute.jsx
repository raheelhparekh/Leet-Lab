import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (!authUser || authUser.role === "USER") {
    return <Navigate to={"/"} />;
  }

  return <Outlet />;
}

export default AdminRoute;
