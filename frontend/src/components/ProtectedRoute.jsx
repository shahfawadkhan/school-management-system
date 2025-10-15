import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRole }) => {
  // If user data is not yet available, avoid redirect (prevent flicker)
  if (user === undefined || user === null) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  // Extract role safely (handle both user.role and user.user.role)
  const role = user?.user?.role || user?.role;

  // If user role matches the allowed role → render
  if (role === allowedRole) {
    return <Outlet />;
  }

  // Otherwise redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
